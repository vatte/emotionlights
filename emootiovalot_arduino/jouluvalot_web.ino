#include <TimerOne.h>
#include <LPD6803.h>

const int dataPin = 2;       // 'yellow' wire
const int clockPin = 3;      // 'green' wire
const int nLeds = 50;

LPD6803 strip = LPD6803(nLeds, dataPin, clockPin);

void setup() {
  strip.setCPUmax(50);
  strip.begin();
  strip.show();
  Serial.begin(115200);
}

void loop() {  
  while(Serial.available()) {
    char c = Serial.read();
    if (c == 'C') {
      int index = Serial.parseInt();
      int red = Serial.parseInt();
      int green = Serial.parseInt();
      int blue = Serial.parseInt();
      
      Serial.print(index);
      Serial.print("\t");
      Serial.print(red);
      Serial.print("\t");
      Serial.print(green);
      Serial.print("\t");
      Serial.println(blue);
      
      uint16_t c = Color(red, green, blue);
      strip.setPixelColor(index, c);
      strip.show();
    }
  }
  
  delay(1);
}




// Create a 15 bit color value from R,G,B
unsigned int Color(byte r, byte g, byte b)
{
  //Take the lowest 5 bits of each value and append them end to end
  return( ((unsigned int)b & 0x1F )<<10 | ((unsigned int)r & 0x1F)<<5 | (unsigned int)g & 0x1F);
}

