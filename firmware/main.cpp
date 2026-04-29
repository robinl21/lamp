#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// Create the PWM driver object (Default I2C address is 0x40)
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

// Servo Pulse definitions (Adjust these to your specific servos)
#define SERVOMIN  150 // Minimum pulse length count (out of 4096)
#define SERVOMAX  600 // Maximum pulse length count (out of 4096)
#define SERVO_FREQ 50 // Analog servos run at ~50 Hz updates

int basePos = 90;
int j1Pos = 90;
int j2Pos = 90;
const int stepSize = 10;

// Helper to convert degrees to PWM pulse length
void setServoAngle(uint8_t channel, int angle) {
  int pulse = map(angle, 0, 180, SERVOMIN, SERVOMAX);
  pwm.setPWM(channel, 0, pulse);
}

void setup() {
  Serial.begin(9600);
  
  pwm.begin();
  pwm.setOscillatorFrequency(27000000);
  pwm.setPWMFreq(SERVO_FREQ);

  // Initialize positions on channels 0, 1, and 2
  setServoAngle(0, basePos);
  setServoAngle(1, j1Pos);
  setServoAngle(2, j2Pos);
  
  delay(10);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "ROTATE_CW") {
      basePos = constrain(basePos + stepSize, 0, 180);
      setServoAngle(0, basePos);
    } 
    else if (command == "ROTATE_CCW") {
      basePos = constrain(basePos - stepSize, 0, 180);
      setServoAngle(0, basePos);
    }
    else if (command == "J1_UP") {
      j1Pos = constrain(j1Pos + stepSize, 0, 180);
      setServoAngle(1, j1Pos);
    }
    else if (command == "J1_DOWN") {
      j1Pos = constrain(j1Pos - stepSize, 0, 180);
      setServoAngle(1, j1Pos);
    }
    else if (command == "J2_UP") {
      j2Pos = constrain(j2Pos + stepSize, 0, 180);
      setServoAngle(2, j2Pos);
    }
    else if (command == "J2_DOWN") {
      j2Pos = constrain(j2Pos - stepSize, 0, 180);
      setServoAngle(2, j2Pos);
    }

    Serial.print("Status: ");
    Serial.println(command);
  }
}