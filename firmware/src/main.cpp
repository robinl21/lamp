#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// Create the PWM driver object
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

// Servo Pulse definitions (Adjust based on your specific servos)
#define SERVOMIN  150 // Minimum pulse length count
#define SERVOMAX  600 // Maximum pulse length count
#define SERVO_FREQ 50 // Analog servos run at ~50 Hz

// PCA9685 Channel Assignments
#define BASE_CH  0
#define JOINT1_CH 1
#define JOINT2_CH 2

int basePos = 90;
int j1Pos = 90;
int j2Pos = 90;
const int stepSize = 10;

// Helper to convert degrees to PWM pulse length for PCA9685
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
  setServoAngle(BASE_CH, basePos);
  setServoAngle(JOINT1_CH, j1Pos);
  setServoAngle(JOINT2_CH, j2Pos);

  delay(10);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "ROTATE_CW") {
      basePos = constrain(basePos + stepSize, 0, 180);
      setServoAngle(BASE_CH, basePos);
    } 
    else if (command == "ROTATE_CCW") {
      basePos = constrain(basePos - stepSize, 0, 180);
      setServoAngle(BASE_CH, basePos);
    }
    else if (command == "J1_UP") {
      j1Pos = constrain(j1Pos + stepSize, 0, 180);
      setServoAngle(JOINT1_CH, j1Pos);
    }
    else if (command == "J1_DOWN") {
      j1Pos = constrain(j1Pos - stepSize, 0, 180);
      setServoAngle(JOINT1_CH, j1Pos);
    }
    else if (command == "J2_UP") {
      j2Pos = constrain(j2Pos + stepSize, 0, 180);
      setServoAngle(JOINT2_CH, j2Pos);
    }
    else if (command == "J2_DOWN") {
      j2Pos = constrain(j2Pos - stepSize, 0, 180);
      setServoAngle(JOINT2_CH, j2Pos);
    }

    Serial.print("Status: ");
    Serial.println(command);
  }
}