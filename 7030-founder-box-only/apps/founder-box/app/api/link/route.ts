import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../packages/utils/db'
import { randomBytes } from 'crypto'

async function sendEmail(to: string, url: string) {
  if (!process.env.RESEND_API_KEY) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: '70/30 <founder@7030.example>',
        to: [to],
        subject: 'Tu acceso a la etapa final',
        html: `<p>Gracias por completar el test. Accede aquí:</p><p><a href="${url}">${url}</a></p>`
      })
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const { leadId, channel, email, phone } = await req.json()
    if (!leadId || !channel) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    const token = randomBytes(24).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await prisma.accessToken.create({ data: { token, leadId, stage: 'final', expiresAt } })

    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const finalUrl = `${base}/final?token=${token}`

    if (channel === 'email') {
      if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
      await sendEmail(email, finalUrl)
      return NextResponse.json({ ok: true })
    }

    if (channel === 'whatsapp') {
      if (!phone) return NextResponse.json({ error: 'Teléfono requerido' }, { status: 400 })
      const text = encodeURIComponent(`Tu acceso a la etapa final de 70/30: ${finalUrl}`)
      const wa = `https://wa.me/${phone.replace(/[^\d+]/g, '')}?text=${text}`
      return NextResponse.json({ ok: true, whatsappUrl: wa })
    }

    return NextResponse.json({ error: 'Canal inválido' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}