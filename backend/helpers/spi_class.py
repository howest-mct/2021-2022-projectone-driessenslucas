import spidev
class spi_class:
    def __init__(self,bus=0,device=0):
        self.spi = spidev.SpiDev()
        self.bus = bus
        self.device = device

    def read_channel(self,hz=10 ** 5,ch=0):
        self.spi.open(self.bus, self.device) 
        self.spi.max_speed_hz = hz
        bytes_out = [1,(8 | ch) << 4,0]
        bytes_in = self.spi.xfer(bytes_out) 
        data = ((bytes_in[1]&3) << 8) | bytes_in[2]
        return data

    def closespi(self):
        self.spi.close()