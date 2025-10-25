'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTransition } from 'react'

export default function Box3D({ leadId }: { leadId: string }) {
  const [pending, start] = useTransition()

  async function advance() {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, stage: 'quiz' })
    })
    location.reload()
  }

  return (
    <div className="grid gap-6">
      <div className="h-[60vh] rounded-xl overflow-hidden border border-neutral-800">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <mesh rotation={[0.3, 0.4, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial />
          </mesh>
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <button
        onClick={() => start(advance)}
        disabled={pending}
        className="w-full md:w-auto px-5 py-3 rounded-xl bg-white text-black font-medium disabled:opacity-50"
      >
        {pending ? 'Cargando…' : 'Desbloquear → Test + Medidas'}
      </button>
    </div>
  )
}