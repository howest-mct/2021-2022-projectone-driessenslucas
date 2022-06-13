from ast import Pass
from email.utils import formatdate
import json
from random import randint
from subprocess import check_output
import time
from wsgiref.handlers import format_date_time
from RPi import GPIO
from h11 import Data
import threading
from threading import Event
import matplotlib.pyplot as plt
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, jsonify, request
from repositories.DataRepository import DataRepository

from selenium import webdriver

endpoint = '/api/v1'
wls_deviceID = 1

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


# Code voor Hardware
import time
import smbus
from helpers.i2c_helper import LCD
from helpers.spi_class import spi_class
import os
import pickle

from hx711 import HX711

GPIO.setmode(GPIO.BCM)

NO_TOUCH = 0xFE
max_val_wls = 95
Coffee_machine_on = False
relais_coffee_machine_pin = 24
relais_make_coffee_pin = 23
toggle_coffee_machine = False


i2c = smbus.SMBus(1)
sda = 1
scl = 1
lcd = LCD()

hx = HX711(dout_pin=21, pd_sck_pin=20)
swap_file_name = 'swap_file.swp'
if os.path.isfile(swap_file_name):
    with open(swap_file_name, 'rb') as swap_file:
        hx = pickle.load(swap_file)

GPIO.setup(23, GPIO.OUT)
GPIO.setup(24, GPIO.OUT)

def turn_on_coffee_machine():
    time.sleep(1)
    print('turning on coffee machine')
    DataRepository.create_log(1,4,6,1,"coffee machine aan")
    GPIO.output(23, GPIO.LOW)
    time.sleep(1)

def turn_off_coffee_machine():
    time.sleep(1)
    print('turning off coffee machine')
    DataRepository.create_log(1,4,6,0,"coffee machine uit")
    GPIO.output(23, GPIO.HIGH)
    time.sleep(1)

def make_coffee():
    #aanpassen zodat we coffeemachine apart kunnen aanzetten
    print('brewing coffee')
    GPIO.output(24, GPIO.LOW)
    time.sleep(10)#120 seconden na development
    GPIO.output(24, GPIO.HIGH)
    time.sleep(1)
    print('coffee is done')
    DataRepository.create_log(1,4,5,1,"coffee gemaakt")
    socketio.emit('B2F_brewingStatus', {'coffee_status': 0})
    fsr(True)
    

def write_lcd():
    lcd.init_LCD()
    lcd.write_line("coffee machine  ")
    ips = str(check_output(['hostname','--all-ip-addresses']))
    ip_addr = ips.split(' ')
    print(ip_addr)
    while True:
        lcd.next_line()
        lcd.write_line(f"{ip_addr[1]}   ")
        time.sleep(4)
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
    socketio.emit('B2F_WLS', {'current_waterlevel': value},broadcast=True)
    # print(f"waterlevel: {value}")
    return value

def tmp(write_to_db):
        spi = spi_class(0,0)
        hz = 10 ** 5
        data = spi.read_channel(hz,0)
        volt = data/1023.0 *3.3
        temp = (100 * volt) - 50
        status = 1
        commentaar = "get current temperature"
        if write_to_db:
            data = DataRepository.create_log(temp,2,1,status,commentaar)
            if data != 0:
                print('gelukt temperatuur wegschrijven')
        socketio.emit('B2F_temp', {'current_temp': round(temp,0)},broadcast=True)
        return round(temp,0)
    
def fsr(write_to_db):
    #tijdelijke code tot defitge weight sensor
    #print(f"fsr{write_to_db}")

    weight = hx.get_weight_mean(20)
    commentaar = "read coffee pot weight"
    if weight < 0:
        weight = 0
    if weight > 10:
            status = 1
    if weight is not None and write_to_db:
        
            data = DataRepository.create_log(weight,3,3,status,commentaar)
            if data != 0:
                print('gelukt weight wegschrijven')
            print('gelukt wegschrijven gewicht')  
    socketio.emit('B2F_coffepot', {'coffepot_status': status},broadcast=True)
    return weight
    
def wls(write_to_db):
        #print(f"wls{write_to_db}")
        percent = check_water_level()
        status = 0
        if percent > 10 & percent < 98:
            status = 1
        else:
            status - 0
        commentaar = "get water level"
        if write_to_db:
            data = DataRepository.create_log(percent,1,2,status,commentaar)
            if data != 0:
                print('gelukt waterlevel')
        return percent
# API ENDPOINTS


@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

@app.route(endpoint + '/logs/', methods=['GET','DELETE'])
def get_all_logs():
    if request.method == 'GET':
        return jsonify(logs=DataRepository.get_logs()), 200
    elif request.method == 'DELETE':
        formmdata = DataRepository.json_or_formdata(request)
        print(formmdata)
        id = DataRepository.delete_readings_today(formmdata['datum'])
        if id >0:
            print('gelukt verwijderen')
            return jsonify(status='success'),201
        else:
            print('niet gelukt verwijderen')
            return jsonify(status="no update",id=id), 201
    
@app.route(endpoint + '/logs/<volgnummer>/', methods=['GET'])
def get_logs_from_device(volgnummer):
    if request.method == 'GET':
        if volgnummer != 0:
            data = DataRepository.get_logs_from_device(volgnummer)
            if data is not None:
                return jsonify(data=data),200
            else:
                return jsonify(message="niet gevonden, foutive id"),400

@app.route(endpoint + '/weeklylogs/<weeknr>/', methods=['GET'])
def get_weekly_logs(weeknr):
    if request.method == 'GET':
        if weeknr != 0:
            data = DataRepository.get_weekly_logs(weeknr)
            if data is not None:
                return jsonify(data=data),200
            else:
                return jsonify(message="week niet gevonden"),400
    
@app.route(endpoint + '/status/', methods=['GET'])
def get_status():
    if request.method == 'GET':
        data = DataRepository.get_status()
        if data is not None:
            return jsonify(status=data),200
        else: 
            return jsonify(message="foutive status"),400



#socketio
    

@socketio.on('connect')
def initial_connection():
    pass

@socketio.on('F2B_brew')
def brew():
    print('brew')
    socketio.emit('B2F_brewingStatus', {'coffee_status': 1})
    thread4 = threading.Thread(target=make_coffee,args=(),daemon=True)
    thread4.start()
    
@socketio.on('F2B_turn_on')
def turn_on():
    
    print('turn on')
    turn_on_coffee_machine()

@socketio.on('F2B_turn_off')
def turn_off():
    
    print('turn off')
    turn_off_coffee_machine()

@socketio.on('F2B_getWeightLogs')
def get_weight_logs(data):
    socketio.emit('B2F_weightLogs', {'weight_logs': DataRepository.get_weekly_weight(data['weeknr'])})

@socketio.on('F2B_getCoffeeLogs')
def get_coffee_logs(data):
    socketio.emit('B2F_coffeeLogs', {'coffee_logs': DataRepository.get_weekly_coffee_made(data['weeknr'])})


#threads


def sensors_to_db():
    while True:
        try:
            wls(True)
            tmp(True)
            time.sleep(60)
        except:
            pass
            # print("error while writing to db")

def lcd_thread():
    try:
        write_lcd()
    except:
        pass

def sensors_to_frontend():
    while True:
        try:
            fsr(False)
            tmp(False)
            wls(False)
            time.sleep(1)
        except:
            #print("error uitlezen sensors")\
            pass

        


def start_thread():
    print("**** Starting THREAD ****")
    thread = threading.Thread(target=sensors_to_db, args=(), daemon=True)
    thread.start()
def start_thread2():
    print("**** Starting THREADlcd ****")
    thread2 = threading.Thread(target=lcd_thread,args=(),daemon=True)
    thread2.start()
def start_thread3():
    print("**** Starting THREADFSR ****")
    thread3 = threading.Thread(target=sensors_to_frontend,args=(),daemon=True)
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


if __name__ == '__main__':
    try:
        GPIO.output(23, GPIO.HIGH)
        GPIO.output(24, GPIO.HIGH)
        start_thread()
        start_thread2()
        start_thread3()
        start_chrome_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print ('KeyboardInterrupt exception is caught')
    finally:
        GPIO.cleanup()

