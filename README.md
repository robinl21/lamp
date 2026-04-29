# Robotic Arm Control Interface

A minimalist web-based UI to control a robotic arm via serial communication.

## Architecture
This project uses a **decoupled architecture**:
- **Backend (Flask)**: Acts as an API that communicates with the hardware via Serial.
- **Frontend (React)**: A minimalist UI that sends commands to the API.

## Prerequisites
- **Python 3.x**: For the backend server.
- **Node.js & npm**: For the React frontend. [Download here](https://nodejs.org/).

## Setup
1. Connect the Raspberry Pi via USB.
2. Update the `SERIAL_PORT` in `app.py` to match your device (e.g., `/dev/tty.usbmodem123` on macOS or `/dev/ttyUSB0` on Linux).
3. Run the server:
   ```bash
   python app.py
   ```

## Frontend (React + Vite)

The UI is being transitioned to a modern React application for better state management and component reusability.

### Key Dependencies
- **React**: Component-based library for the UI logic.
- **Vite**: High-performance build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for minimalist styling.
- **Lucide React**: Minimalist icon set for the control interface.

### Installation & Setup
1. **Initialize the React project**:
   Run this from the root `lamp` directory:
   ```bash
   npm create vite@latest frontend -- --template react
   cd frontend
   ```
2. **Install all packages**:
   ```bash
   npm install
   npm install --save-dev tailwindcss postcss autoprefixer
   ```
3. **Initialize Tailwind CSS**:
   If `npx tailwindcss init -p` fails with an executable error:
   - Ensure `tailwind.config.js` exists.
   - Manually create `postcss.config.js` with:
     `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Development
By default, the React dev server runs on `http://localhost:5173`. To avoid CORS issues, we use a proxy in `vite.config.js` to route API calls to the Flask backend on port `5000`.