from ast import Pass
import json
import time
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

NO_TOUCH = 0xFE
max_val_wls = 100


i2c = smbus.SMBus(1)
    


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



def wls():
    while True:
        percent = check_water_level()
        print(f"water level = {percent}%")
        data = DataRepository.update_waterlevel(percent,1,2)
        if data != 0:
            print('gelukt')
            s = DataRepository.get_latest_value(1)
        socketio.emit('B2F_connected', {'current_waterlevel': s['Waarde']})
        time.sleep(10)



# START een thread op. Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# werk enkel met de packages gevent en gevent-websocket.
# def all_out():
#     while True:
#         print('*** We zetten alles uit **')
#         DataRepository.update_status_alle_lampen(0)
#         GPIO.output(ledPin, 0)
#         status = DataRepository.read_status_lampen()
#         socketio.emit('B2F_status_lampen', {'lampen': status})
#         time.sleep(15)

def start_thread():
    print("**** Starting THREAD ****")
    thread = threading.Thread(target=wls, args=(), daemon=True)
    thread.start()


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
        # start_thread()
        start_chrome_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print ('KeyboardInterrupt exception is caught')
    finally:
        GPIO.cleanup()

