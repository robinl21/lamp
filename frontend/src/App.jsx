import { useState } from 'react'

function App() {
  const [status, setStatus] = useState('Ready for connection...')

  const sendCommand = async (cmd) => {
    try {
      const response = await fetch('/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      })
      const data = await response.json()
      setStatus(`Last action: ${cmd}`)
      console.log('Server response:', data)
    } catch (err) {
      setStatus('Connection error')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tight">Robotic Arm</h1>
          <p className="text-sm opacity-60 uppercase tracking-widest">Local Control Interface</p>
        </header>

        <div className="space-y-6">
          {/* Rotation */}
          <div className="control-group">
            <label className="text-xs font-medium uppercase tracking-wider opacity-50">Base Rotation</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => sendCommand('ROTATE_CCW')} className="btn-control">LEFT</button>
              <button onClick={() => sendCommand('ROTATE_CW')} className="btn-control">RIGHT</button>
            </div>
          </div>

          {/* Joint 1 */}
          <div className="control-group">
            <label className="text-xs font-medium uppercase tracking-wider opacity-50">Joint One</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => sendCommand('J1_UP')} className="btn-control">UP</button>
              <button onClick={() => sendCommand('J1_DOWN')} className="btn-control">DOWN</button>
            </div>
          </div>

          {/* Joint 2 */}
          <div className="control-group">
            <label className="text-xs font-medium uppercase tracking-wider opacity-50">Joint Two</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => sendCommand('J2_UP')} className="btn-control">UP</button>
              <button onClick={() => sendCommand('J2_DOWN')} className="btn-control">DOWN</button>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs opacity-40 italic">
          {status}
        </footer>
      </div>
    </div>
  )
}

export default App