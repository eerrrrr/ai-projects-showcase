import { Canvas } from '@react-three/fiber'
import { CameraDirector } from './CameraDirector'
import { TabletopScene } from './TabletopScene'

type GatewayCanvasProps = {
  reducedMotion: boolean
  selectedId: string
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export default function GatewayCanvas(props: GatewayCanvasProps) {
  return (
    <div className="gateway-canvas" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 7.5, 10], fov: 38, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f4f0e8', 0)
        }}
      >
        <color attach="background" args={['#f4f0e8']} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[6, 10, 4]} intensity={1.7} castShadow={false} />
        <directionalLight position={[-5, 4, -3]} intensity={0.6} />
        <TabletopScene
          selectedId={props.selectedId}
          onSelect={props.onSelect}
          onHover={props.onHover}
        />
        <CameraDirector selectedId={props.selectedId} reducedMotion={props.reducedMotion} />
      </Canvas>
    </div>
  )
}