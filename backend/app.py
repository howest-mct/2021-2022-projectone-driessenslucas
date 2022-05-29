from ast import Pass
import json
import time
from wsgiref.simple_server import demo_app
from RPi import GPIO
from helpers.klasseknop import Button
import threading

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, jsonify, request
from repositories.DataRepository import DataRepository

from selenium import webdriver

endpoint = '/api/v1'

# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options



# Code voor Hardware
import time
import smbus
import numpy as np
from helpers.i2c_helper import LCD
from helpers.spi_class import spi_class

NO_TOUCH = 0xFE
max_val_wls = 100


i2c = smbus.SMBus(1)
sda = 1
scl = 1

GPIO.setmode(GPIO.BCM)

def tmp():
        spi = spi_class(0,0)
        hz = 10 ** 5
        data = spi.read_channel(hz,0)
        volt = data/1023.0 *3.3
        temp = (100 * volt) - 50
        status = 1
        prev_temp = DataRepository.get_latest_value(2)
        if round(temp,0) != round(prev_temp['Waarde'],0):
            data = DataRepository.create_log(temp,2,1,status,"temperatuur ophalen")
            if data != 0:
                socketio.emit('B2F_tmp', {'current_tmp': round(temp,0)})
    

def fsr():
    #tijdelijke code tot defitge weight sensor
    GPIO.setup(20, GPIO.IN)
    fsrval = GPIO.input(20)
    commentaar = "fsr uitlezen"
    if fsrval is not None:
            data = DataRepository.create_log(fsrval,3,3,fsrval,commentaar)
            if data != 0:    
                socketio.emit('B2F_coffepot', {'coffepot_status': fsrval})
    

def write_lcd():
        lcd = LCD()
        lcd.reset_lcd()
        lcd.init_LCD()
        lcd.write_line("coffee machine  ")
        lcd.next_line()
        lcd.write_line("192.168.168.169 ")

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

def wls():
        percent = check_water_level()
        print(f"water level = {percent}%")
        status = 0
        if percent > 10 & percent < 98:
            status = 1
        else:
            status - 0
        commentaar = "water niveau ophalen"
        data = DataRepository.create_log(percent,1,2,status,commentaar)
        if data != 0:
            print('gelukt waterlevel')
            s = DataRepository.get_latest_value(1)
            socketio.emit('B2F_waterlevel', {'current_waterlevel': s['Waarde']})
        




# Code voor Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'geheim!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False,
                    engineio_logger=False, ping_timeout=1)

CORS(app)


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)



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





@socketio.on('connect')
def initial_connection():
    print('A new client connect')
    # # Send to the client!
    # vraag de status op van de lampen uit de DB
    data = DataRepository.get_latest_value(1)
    if data['Waarde']:
        percentage = data['Waarde']
    else:
        percentage = 0
    emit('B2F_connected', {'current_waterlevel': percentage})




def wls_thread():
    while True:
        try:
            wls()
            time.sleep(20)
        except:
            pass

def lcd_thread():
    try:
        write_lcd()
    except:
        pass

def fsr_thread():
    while True:
        fsr()
        tmp()
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


if __name__ == '__main__':
    try:
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

