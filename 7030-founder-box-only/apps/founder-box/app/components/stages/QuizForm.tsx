'use client'
import { useState } from 'react'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  waistCm: z.coerce.number().int().min(60).max(140),
  inseamCm: z.coerce.number().int().min(60).max(110),
  channel: z.enum(['email', 'whatsapp']),
  phone: z.string().optional()
})

export default function QuizForm({ leadId }: { leadId: string }) {
  const [pending, setPending] = useState(false)
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg('')
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries()) as any
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      setMsg(parsed.error.issues[0].message)
      return
    }
    setPending(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          stage: 'final',
          measurement: {
            email: parsed.data.email,
            waistCm: parsed.data.waistCm,
            inseamCm: parsed.data.inseamCm
          }
        })
      })
      if (!res.ok) throw new Error('Error guardando medidas')

      const res2 = await fetch('/api/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          channel: parsed.data.channel,
          email: parsed.data.email,
          phone: parsed.data.phone
        })
      })
      const json = await res2.json()
      if (!res2.ok) throw new Error(json?.error ?? 'Error creando link')

      if (parsed.data.channel === 'whatsapp') {
        window.location.href = json.whatsappUrl
      } else {
        setMsg('Te hemos enviado el link por email. Revisa tu bandeja (y SPAM).')
      }
      setTimeout(() => location.reload(), 1500)
    } catch (err: any) {
      setMsg(err.message ?? 'Error inesperado')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md grid gap-4">
      <input name="email" type="email" placeholder="tu@email" className="px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700" required />
      <div className="grid grid-cols-2 gap-3">
        <input name="waistCm" type="number" placeholder="Cintura (cm)" className="px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700" required />
        <input name="inseamCm" type="number" placeholder="Largo (cm)" className="px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm text-neutral-300">¿Cómo quieres recibir el link?</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2"><input type="radio" name="channel" value="email" defaultChecked /> Email</label>
          <label className="flex items-center gap-2"><input type="radio" name="channel" value="whatsapp" /> WhatsApp</label>
        </div>
        <input name="phone" type="tel" placeholder="+34xxxxxxxxx (si WhatsApp)" className="px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700" />
      </div>
      <button disabled={pending} className="px-5 py-3 rounded-xl bg-white text-black font-medium disabled:opacity-50">
        {pending ? 'Enviando…' : 'Enviar y recibir link'}
      </button>
      {msg && <p className="text-sm text-amber-300">{msg}</p>}
    </form>
  )
}