import { gatewayObjects } from '../../data/gatewayObjects'

type SceneProps = {
  selectedId: string
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

function TableSurface() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#d9d0c2" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[14.4, 0.16, 10.4]} />
        <meshStandardMaterial color="#c9bea8" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

function AIStack({ active }: { active: boolean }) {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} position={[index * 0.02, index * 0.024, index * 0.018]} rotation={[0.03, -0.07, -0.03]}>
          <boxGeometry args={[1.55, 0.08, 1.05]} />
          <meshStandardMaterial
            color={index === 0 ? '#f7f3ec' : '#ece5d8'}
            roughness={0.95}
            metalness={0}
            emissive={active ? '#36291f' : '#000000'}
            emissiveIntensity={active ? 0.08 : 0}
          />
        </mesh>
      ))}
      <mesh position={[0.02, 0.18, 0.05]} rotation={[0.03, -0.07, -0.03]}>
        <boxGeometry args={[1.43, 0.02, 0.93]} />
        <meshStandardMaterial color="#b7b0a1" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

function ArchitectureModel({ active }: { active: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[2.8, 0.14, 2.2]} />
        <meshStandardMaterial color="#e3d9c7" roughness={1} />
      </mesh>
      <mesh position={[-0.72, 0.52, -0.3]}>
        <boxGeometry args={[0.26, 0.72, 1.82]} />
        <meshStandardMaterial color={active ? '#8f8577' : '#b4aa96'} roughness={1} />
      </mesh>
      <mesh position={[0.6, 0.44, 0.7]}>
        <boxGeometry args={[1.55, 0.56, 0.28]} />
        <meshStandardMaterial color={active ? '#948879' : '#a79d8c'} roughness={1} />
      </mesh>
      <mesh position={[0.15, 0.8, -0.2]}>
        <boxGeometry args={[1.1, 0.28, 1.2]} />
        <meshStandardMaterial color="#d4c8b3" roughness={1} />
      </mesh>
      <mesh position={[1.02, 0.88, -0.68]}>
        <boxGeometry args={[0.5, 0.36, 0.5]} />
        <meshStandardMaterial color="#c7bba8" roughness={1} />
      </mesh>
      <mesh position={[-0.2, 0.43, 0.54]}>
        <boxGeometry args={[0.38, 0.66, 0.36]} />
        <meshStandardMaterial color="#8f8577" roughness={1} />
      </mesh>
    </group>
  )
}

function FutureObject({ active }: { active: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.45, 0.56, 1.45]} />
        <meshStandardMaterial color={active ? '#c98c52' : '#d9a66d'} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.84, 0.28, 0.84]} />
        <meshStandardMaterial color={active ? '#b36f31' : '#c68a45'} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.34, 0.18, 0.34]} />
        <meshStandardMaterial color="#8c5c2e" roughness={0.9} />
      </mesh>
    </group>
  )
}

function shadowPosition(position: [number, number, number]): [number, number, number] {
  return [position[0], 0.01, position[2]]
}

export function TabletopScene({ selectedId, onSelect, onHover }: SceneProps) {
  const activeObjectId = selectedId

  return (
    <group>
      <TableSurface />
      {gatewayObjects.map((object) => (
        <mesh key={`${object.id}-shadow`} position={shadowPosition(object.position)} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[object.id === 'architecture' ? 1.6 : 1.2, 32]} />
          <meshBasicMaterial color="#6a5e4d" transparent opacity={0.12} />
        </mesh>
      ))}

      {gatewayObjects[0].enabled && (
        <group
          position={gatewayObjects[0].position}
          rotation={gatewayObjects[0].rotation}
          scale={activeObjectId === gatewayObjects[0].id ? [1.05, 1.05, 1.05] : [1, 1, 1]}
          onPointerOver={() => onHover(gatewayObjects[0].id)}
          onPointerOut={() => onHover(null)}
          onClick={() => onSelect(gatewayObjects[0].id)}
        >
          <AIStack active={activeObjectId === gatewayObjects[0].id} />
        </group>
      )}

      {gatewayObjects[1].enabled && (
        <group
          position={gatewayObjects[1].position}
          rotation={gatewayObjects[1].rotation}
          scale={activeObjectId === gatewayObjects[1].id ? [1.05, 1.05, 1.05] : [1, 1, 1]}
          onPointerOver={() => onHover(gatewayObjects[1].id)}
          onPointerOut={() => onHover(null)}
          onClick={() => onSelect(gatewayObjects[1].id)}
        >
          <ArchitectureModel active={activeObjectId === gatewayObjects[1].id} />
        </group>
      )}

      {gatewayObjects[2].enabled && (
        <group
          position={gatewayObjects[2].position}
          rotation={gatewayObjects[2].rotation}
          scale={activeObjectId === gatewayObjects[2].id ? [1.05, 1.05, 1.05] : [1, 1, 1]}
          onPointerOver={() => onHover(gatewayObjects[2].id)}
          onPointerOut={() => onHover(null)}
          onClick={() => onSelect(gatewayObjects[2].id)}
        >
          <FutureObject active={activeObjectId === gatewayObjects[2].id} />
        </group>
      )}
    </group>
  )
}