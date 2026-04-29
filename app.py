import serial
from flask import Flask, request, jsonify
import logging

app = Flask(__name__)

# Configuration - Adjust SERIAL_PORT to match your local system
SERIAL_PORT = '/dev/tty.usbmodem14101' 
BAUD_RATE = 9600

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
except Exception as e:
    print(f"Serial Warning: {e}. Running in simulated mode.")
    ser = None

@app.route('/command', methods=['POST'])
def send_command():
    data = request.json
    command = data.get('command')
    
    if not command:
        return jsonify({"status": "error", "message": "No command provided"}), 400

    print(f"Executing: {command}")
    
    if ser and ser.is_open:
        try:
            ser.write(f"{command}\n".encode('utf-8'))
            return jsonify({"status": "success", "sent": command})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    
    return jsonify({"status": "simulated", "sent": command})

if __name__ == '__main__':
    app.run(debug=True, port=5000)