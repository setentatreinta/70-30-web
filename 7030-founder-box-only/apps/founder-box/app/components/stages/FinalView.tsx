'use client'
export default function FinalView({ leadId }: { leadId: string }) {
  return (
    <section className="max-w-2xl grid gap-4">
      <h1 className="text-2xl font-semibold">Acceso Final</h1>
      <p className="text-neutral-300">Ya estás dentro. Desde aquí puedes continuar a la tienda o a la experiencia que toque.</p>
      <a href="/final" className="px-5 py-3 rounded-xl bg-white text-black font-medium w-fit">Abrir vista final</a>
    </section>
  )
}