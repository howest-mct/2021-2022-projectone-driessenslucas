from ast import Pass
import json
from subprocess import check_output
import time
from RPi import GPIO
from h11 import Data
import threading
from threading import Event

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, jsonify, request
from repositories.DataRepository import DataRepository

from selenium import webdriver

endpoint = '/api/v1'

# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options

# Code voor Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'geheim!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False,
                    engineio_logger=False, ping_timeout=1)

CORS(app)


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)


intterupt_make_coffee = Event()
# Code voor Hardware
import time
import smbus
import numpy as np
from helpers.i2c_helper import LCD
from helpers.spi_class import spi_class

NO_TOUCH = 0xFE
max_val_wls = 100
Coffee_machine_on = False
relais_coffee_machine_pin = 21
relais_make_coffee_pin = 23
toggle_coffee_machine = False


i2c = smbus.SMBus(1)
sda = 1
scl = 1
lcd = LCD()

GPIO.setmode(GPIO.BCM)

GPIO.setup(relais_coffee_machine_pin, GPIO.OUT)
GPIO.setup(relais_make_coffee_pin, GPIO.OUT)

def make_coffee():
    print('turning on coffee machine')
    GPIO.output(relais_coffee_machine_pin, GPIO.HIGH)
    time.sleep(1)
    print('coffee wordt gemaakt')
    DataRepository.create_log(1,4,6,1,"coffee machine aan")
    GPIO.output(23, GPIO.HIGH)
    time.sleep(20)
    GPIO.output(23, GPIO.LOW)
    DataRepository.create_log(0,4,6,0,"coffee machine uit")
    print('coffee is klaar')
    DataRepository.create_log(1,4,5,1,"coffee gemaakt")
    GPIO.output(relais_coffee_machine_pin, GPIO.LOW)


def tmp(write_to_db):
        #print(f"tmp{write_to_db}")
        spi = spi_class(0,0)
        hz = 10 ** 5
        data = spi.read_channel(hz,0)
        volt = data/1023.0 *3.3
        temp = (100 * volt) - 50
        status = 1
        if write_to_db:
            data = DataRepository.create_log(temp,2,1,status,"temperatuur ophalen")
            if data != 0:
                print('gelukt temperatuur wegschrijven')
        socketio.emit('B2F_tmp', {'current_tmp': round(temp,0)})
        return round(temp,0)
    

def fsr(write_to_db):
    #tijdelijke code tot defitge weight sensor
    #print(f"fsr{write_to_db}")
    GPIO.setup(20, GPIO.IN)
    fsrval = GPIO.input(20)
    commentaar = "fsr uitlezen"
    if fsrval is not None and write_to_db:
            data = DataRepository.create_log(fsrval,3,3,fsrval,commentaar)
            if data != 0:
                print('gelukt wegschrijven fsr')    
    socketio.emit('B2F_coffepot', {'coffepot_status': fsrval})
    return fsrval
    

def write_lcd():
    lcd.reset_lcd()
    lcd.init_LCD()
    lcd.write_line("coffee machine  ")
    ips = str(check_output(['hostname','--all-ip-addresses']))
    ip_addr = ips.split(' ')
    print(ip_addr[0][2:])
    
    while True:
        lcd.next_line()
        lcd.write_line(f"{ip_addr[0][2:]}   ")
        time.sleep(2)
        lcd.next_line()
        lcd.write_line(f"temp: {tmp(False)}C      ")
        time.sleep(2)
        lcd.next_line()
        lcd.write_line(f"waterlevel: {wls(False)}%   ")
        time.sleep(2)


def check_water_level():
    touch_val = 0
    low_data =  i2c.read_i2c_block_data(0x77, 0x01, 8)
    high_data = i2c.read_i2c_block_data(0x78, 0x01, 12)
    
    for i in range(8):
        if low_data[i] > max_val_wls:
            touch_val += 1
       
    for i in range(12):
        if high_data[i] > max_val_wls:
            touch_val += 1
    
    value = touch_val * 5
    return value

def wls(write_to_db):
        #print(f"wls{write_to_db}")
        percent = check_water_level()
        status = 0
        if percent > 10 & percent < 98:
            status = 1
        else:
            status - 0
        commentaar = "water niveau ophalen"
        if write_to_db:
            data = DataRepository.create_log(percent,1,2,status,commentaar)
            if data != 0:
                print('gelukt waterlevel')
        socketio.emit('B2F_waterlevel', {'current_waterlevel': percent})
        
        return percent
        

# API ENDPOINTS


@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

@app.route(endpoint + '/historiek/', methods=['GET','DELETE'])
def get_progress():
    if request.method == 'GET':
        return jsonify(historiek=DataRepository.get_historiek()), 200
    elif request.method == 'DELETE':
        formmdata = DataRepository.json_or_formdata(request)
        print(formmdata)
        id = DataRepository.delete_readings_today(formmdata['datum'])
        if id >0:
            return jsonify(status='success'),201
        else:
            return jsonify(status="no update", id=id), 201
    
@app.route(endpoint + '/historiek/<volgnummer>/', methods=['GET'])
def get_specific_historiek(volgnummer):
    if request.method == 'GET':
        if volgnummer != 0:
            data = DataRepository.get_specific_historiek(volgnummer)
            if data is not None:
                return jsonify(data=data),200
            else:
                return jsonify(message="niet gevonden, foutive id"),400
    

@app.route(endpoint + '/status/', methods=['GET'])
def get_status():
    if request.method == 'GET':
        data = DataRepository.get_status()
        if data is not None:
            return jsonify(status=data),200
        else: 
            return jsonify(message="foutive status"),400




    

@socketio.on('F2B_make_coffee')
def turn_on():
    thread4 = threading.Thread(target=make_coffee,args=(),daemon=True)
    emit('B2F_makecoffee', {'coffepot_status': 1})
    thread4.start()
    thread4.join()
    emit('B2F_makecoffee', {'coffepot_status': 0})
    



@socketio.on('connect')
def initial_connection():
    print('A new client connect')
    # # Send to the client!
    data = DataRepository.get_latest_value(1)
    if data['Waarde']:
        percentage = data['Waarde']
    else:
        percentage = 0
    emit('B2F_connected', {'current_waterlevel': percentage})

def wls_thread():
    while True:
            wls(True)
            fsr(True)
            tmp(True)
            time.sleep(60)

def lcd_thread():
    try:
        write_lcd()
    except:
        pass

def fsr_thread():
    while True:
        fsr(False)
        tmp(False)
        wls(False)
        time.sleep(1)

        


def start_thread():
    print("**** Starting THREAD ****")
    thread = threading.Thread(target=wls_thread, args=(), daemon=True)
    thread.start()
def start_thread2():
    print("**** Starting THREADlcd ****")
    thread2 = threading.Thread(target=lcd_thread,args=(),daemon=True)
    thread2.start()
def start_thread3():
    print("**** Starting THREADFSR ****")
    thread3 = threading.Thread(target=fsr_thread,args=(),daemon=True)
    thread3.start()
    


def start_chrome_kiosk():
    import os

    os.environ['DISPLAY'] = ':0.0'
    options = webdriver.ChromeOptions()
    # options.headless = True
    # options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36")
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-running-insecure-content')
    options.add_argument("--disable-extensions")
    # options.add_argument("--proxy-server='direct://'")
    options.add_argument("--proxy-bypass-list=*")
    options.add_argument("--start-maximized")
    options.add_argument('--disable-gpu')
    # options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    options.add_argument('--kiosk')
    # chrome_options.add_argument('--no-sandbox')         
    # options.add_argument("disable-infobars")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    driver = webdriver.Chrome(options=options)
    driver.get("http://localhost")
    while True:
        pass


def start_chrome_thread():
    print("**** Starting CHROME ****")
    chromeThread = threading.Thread(target=start_chrome_kiosk, args=(), daemon=True)
    chromeThread.start()



# ANDERE FUNCTIES
# GPIO.add_event_detect(stop_btn,GPIO.RISING,callback=Coffee_stop,bouncetime = 300)
thread4 = threading.Thread(target=make_coffee,args=(),daemon=True)

if __name__ == '__main__':
    try:
        
        GPIO.output(23, GPIO.LOW)
        GPIO.output(21, GPIO.LOW)
        start_thread()
        start_thread2()
        start_thread3()
        # start_thread()
        start_chrome_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print ('KeyboardInterrupt exception is caught')
    finally:
        GPIO.cleanup()

