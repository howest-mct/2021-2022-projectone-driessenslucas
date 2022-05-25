import RPi.GPIO as GPIO
from smbus import SMBus
import time

i2c = SMBus()
i2c.open(1)

class LCD:
    def __init__(self,e=26,rs=19):
        self.e_pin = e
        self.rs_pin = rs
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.e_pin,GPIO.OUT)
        GPIO.setup(self.rs_pin,GPIO.OUT)


    def set_bits(self,value):
        GPIO.output(self.e_pin,GPIO.HIGH)
        i2c.write_byte(0x38,value)
        GPIO.output(self.e_pin,GPIO.LOW)
        time.sleep(0.01)

    def instruct(self,data):
        GPIO.output(self.rs_pin,GPIO.LOW)
        self.set_bits(data)
    
    def init_LCD(self,display = 1,cursor = 1, blink = 1):
        self.instruct(0b00111000)
        self.instruct(0b00001000 | display<<2 | cursor<<1|blink<<0)
        self.instruct(0b00000001)

    def write_to_LCD(self,data):
        GPIO.output(self.rs_pin,GPIO.HIGH)
        self.set_bits(data)

    def write_line(self,str_data):
        for character in str_data:
            self.write_to_LCD(ord(character))
    
    def next_line(self):
        self.instruct(0b10000000 | 0x40)

    def reset_lcd(self):
        self.instruct(0b00000001)
    
    def close_i2c(self):
        i2c.close()