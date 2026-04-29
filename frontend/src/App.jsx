import { useState, Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Edges } from '@react-three/drei'

function LampModel({ angles }) {
  const materialProps = {
    transparent: true,
    opacity: 0.15, // Slightly opaque for better depth perception
    color: "#FFFFFF",
    roughness: 0,
  };
  const edgeColor = "#FFFFFF";

  return (
    <group position={[0, -1, 0]}>
      {/* Fixed Mounting Base - Beefier & Sketchlike */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.3, 32]} />
        <meshStandardMaterial {...materialProps} />
        <Edges color={edgeColor} thickness={1} />
      </mesh>
      
      {/* Sketch-like Construction Rings (Searching Lines) */}
      {[1.45, 1.52].map((r, i) => (
        <mesh key={i} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.005, 16, 100]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Base Crosshair / Construction Lines */}
      <group position={[0, 0.01, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[3.2, 0.005, 0.005]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.2} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[3.2, 0.005, 0.005]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.2} />
        </mesh>
      </group>
      
      {/* Radial Mounting Bolts - Beefier */}
      {[0, 90, 180, 270].map((deg, i) => (
        <mesh key={i} position={[
          Math.cos(deg * Math.PI / 180) * 1.0, 
          0.2, 
          Math.sin(deg * Math.PI / 180) * 1.0
        ]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
          <meshStandardMaterial {...materialProps} />
          <Edges color={edgeColor} thickness={1} />
        </mesh>
      ))}

      {/* Rotating Assembly */}
      <group rotation={[0, (angles.base - 90) * (Math.PI / 180), 0]}>
        {/* Central Power Gear */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.25, 3]} />
          <meshStandardMaterial {...materialProps} />
          <Edges color={edgeColor} thickness={1} />
        </mesh>

        {/* Joint 1 Pivot Axis */}
        <group position={[0, 0.8, 0]} rotation={[0, 0, (angles.j1 - 90) * (Math.PI / 180)]}>
          {/* Motor Housing 1 - Beefier */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.6, 0.5]} />
            <meshStandardMaterial {...materialProps} />
            <Edges color={edgeColor} thickness={1} />
          </mesh>

          {/* Horizontal Parallel Beams for Joint 1 - Wider and Thicker */}
          {[ -0.3, 0.3 ].map((z, i) => (
            <mesh key={i} position={[0, 0.75, z]}>
              <boxGeometry args={[0.25, 1.5, 0.12]} />
              <meshStandardMaterial {...materialProps} />
              <Edges color={edgeColor} thickness={1} />
            </mesh>
          ))}

          {/* Joint 2 Assembly */}
          <group position={[0, 1.5, 0]} rotation={[0, 0, (angles.j2 - 90) * (Math.PI / 180)]}>
            {/* Motor Housing 2 - Beefier */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.3]} />
              <meshStandardMaterial {...materialProps} />
              <Edges color={edgeColor} thickness={1} />
            </mesh>

            {/* Horizontal Parallel Beams for Joint 2 - Wider and Thicker */}
            {[ -0.2, 0.2 ].map((z, i) => (
              <mesh key={i} position={[0, 0.2, z]}>
                <boxGeometry args={[0.2, 0.4, 0.1]} />
                <meshStandardMaterial {...materialProps} />
                <Edges color={edgeColor} thickness={1} />
              </mesh>
            ))}

            {/* Saturn Head Assembly - Elevated & Refined */}
            <group position={[0, 1.0, 0]}>
              {/* Connecting Support Arms from Joint 2 */}
              {[ -1, 1 ].map((side, i) => (
                <mesh 
                  key={i} 
                  position={[0, -0.3, side * 0.35]} 
                  rotation={[side * 0.7, 0, 0]}
                >
                  {/* Diagonals are now larger/thicker */}
                  <boxGeometry args={[0.08, 0.75, 0.08]} />
                  <meshStandardMaterial {...materialProps} />
                  <Edges color={edgeColor} thickness={1} />
                </mesh>
              ))}

              {/* Main Saturn Ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.7, 0.01, 16, 100]} />
                <meshStandardMaterial {...materialProps} />
                <Edges color={edgeColor} thickness={1} />
              </mesh>

              {/* Large Glowing Core (The "Very Big" Ball) */}
              <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                {/* meshBasicMaterial ignores scene lighting, staying pure white */}
                <meshBasicMaterial color="#FFFFFF" />
                {/* This light source will actually illuminate the wireframe arm */}
                <pointLight intensity={80} distance={20} decay={1.5} color="#FFFFFF" />
                <Edges color={edgeColor} thickness={0.5} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

function App() {
  const [status, setStatus] = useState('Ready for connection...')
  const [angles, setAngles] = useState({ base: 90, j1: 90, j2: 90 })
  const stepSize = 10
  
  // Refs for smooth animation loop and network throttling
  const movingRef = useRef(null) 
  const animationRef = useRef(null)
  const lastNetworkCallRef = useRef(0)

  useEffect(() => {
    const animate = (time) => {
      if (movingRef.current) {
        const { part, direction, cmd } = movingRef.current

        // 1. Visual Update: 60FPS smooth rotation
        // Speed is calibrated to match the hardware step size over time
        setAngles(prev => {
          const speed = 1.6 // degrees per frame (~100 deg/sec)
          const nextAngle = prev[part] + (direction * speed)
          return {
            ...prev,
            [part]: Math.min(180, Math.max(0, nextAngle))
          }
        })

        // 2. Hardware Update: Throttle serial commands to ~10Hz
        if (time - lastNetworkCallRef.current > 100) {
          sendHardwareCommand(cmd)
          lastNetworkCallRef.current = time
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const keyMap = {
      w: { cmd: 'J1_UP', part: 'j1', direction: 1 },
      s: { cmd: 'J1_DOWN', part: 'j1', direction: -1 },
      a: { cmd: 'ROTATE_CCW', part: 'base', direction: -1 },
      d: { cmd: 'ROTATE_CW', part: 'base', direction: 1 },
      arrowup: { cmd: 'J2_UP', part: 'j2', direction: 1 },
      arrowdown: { cmd: 'J2_DOWN', part: 'j2', direction: -1 },
    }

    const handleKeyDown = (e) => {
      if (e.repeat) return // Prevent stutter from OS key repeat
      const action = keyMap[e.key.toLowerCase()]
      if (action) startMoving(action.cmd, action.part, action.direction)
    }

    const handleKeyUp = (e) => {
      const action = keyMap[e.key.toLowerCase()]
      // Only stop moving if the key released matches the currently active command
      if (action && movingRef.current?.cmd === action.cmd) {
        stopMoving()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const startMoving = (cmd, part, direction) => {
    movingRef.current = { cmd, part, direction }
  }

  const stopMoving = () => {
    movingRef.current = null
  }

  // Dedicated function for the hardware API call
  const sendHardwareCommand = async (cmd) => {
    try {
      const response = await fetch('/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      })
      if (response.ok) {
        setStatus(`Active: ${cmd}`)
      }
    } catch (err) {
      console.error("Hardware sync failed")
    }
  }

  // Single click support
  const handleSingleClick = (cmd, part, direction) => {
    setAngles(prev => ({
      ...prev,
      [part]: Math.min(180, Math.max(0, prev[part] + (direction * stepSize)))
    }))
    sendHardwareCommand(cmd)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-sketch-bg">
      {/* 3D Visualizer Section */}
      <div className="flex-1 h-[400px] md:h-screen border-r border-sketch-line/20 relative">
        <Canvas shadows>
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <LampModel angles={angles} />
            <PerspectiveCamera makeDefault position={[5, 5, 5]} />
            <OrbitControls enableZoom={true} autoRotate={false} makeDefault />
          </Suspense>
        </Canvas>
        
        {/* Technical overlay lines */}
        <div className="absolute top-8 left-8 border-l border-t border-white/20 w-12 h-12"></div>
        <div className="absolute bottom-8 right-8 border-r border-b border-white/20 w-12 h-12"></div>
      </div>

      {/* Controls Section */}
      <div className="max-w-md w-full p-12 flex flex-col justify-center space-y-12 bg-sketch-bg">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Robotic Arm</h1>
          <p className="text-[10px] opacity-40 uppercase tracking-[0.3em]">Local Control Interface</p>
        </header>

        <div className="space-y-6">
          {/* Rotation */}
          <div className="control-group">
            <label className="text-[10px] uppercase tracking-widest opacity-40">Base Rotation</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onMouseDown={() => startMoving('ROTATE_CCW', 'base', -1)}
                onMouseUp={stopMoving}
                onMouseLeave={stopMoving}
                onClick={() => handleSingleClick('ROTATE_CCW', 'base', -1)}
                className="btn-control">LEFT</button>
              <button
                onMouseDown={() => startMoving('ROTATE_CW', 'base', 1)}
                onMouseUp={stopMoving}
                onMouseLeave={stopMoving}
                onClick={() => handleSingleClick('ROTATE_CW', 'base', 1)}
                className="btn-control">RIGHT</button>
            </div>
          </div>

          {/* Joint 1 */}
          <div className="control-group">
            <label className="text-[10px] uppercase tracking-widest opacity-40">Joint One</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onMouseDown={() => startMoving('J1_UP', 'j1', 1)}
                onMouseUp={stopMoving}
                onMouseLeave={stopMoving}
                onClick={() => handleSingleClick('J1_UP', 'j1', 1)}
                className="btn-control">UP</button>
              <button
                onMouseDown={() => startMoving('J1_DOWN', 'j1', -1)}
                onMouseUp={stopMoving}
                onMouseLeave={stopMoving}
                onClick={() => handleSingleClick('J1_DOWN', 'j1', -1)}
                className="btn-control">DOWN</button>
            </div>
          </div>

          {/* Joint 2 */}
          <div className="control-group">
            <label className="text-[10px] uppercase tracking-widest opacity-40">Joint Two</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onMouseDown={() => startMoving('J2_UP', 'j2', 1)}
                onMouseUp={stopMoving}
                onMouseLeave={stopMoving}
                onClick={() => handleSingleClick('J2_UP', 'j2', 1)}
                className="btn-control">UP</button>
              <button
                onMouseDown={() => startMoving('J2_DOWN', 'j2', -1)}
                onMouseUp={stopMoving}
                onMouseLeave={stopMoving}
                onClick={() => handleSingleClick('J2_DOWN', 'j2', -1)}
                className="btn-control">DOWN</button>
            </div>
          </div>
        </div>

        <footer className="text-center text-[10px] opacity-40 font-mono uppercase tracking-widest">
          {status}
        </footer>
      </div>
    </div>
  )
}

export default App