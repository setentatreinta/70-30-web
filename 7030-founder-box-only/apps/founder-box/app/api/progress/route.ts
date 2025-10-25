import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../packages/utils/db'

export async function POST(req: NextRequest) {
  try {
    const { leadId, stage, measurement } = await req.json()
    if (!leadId || !stage) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    const lead = await prisma.lead.upsert({
      where: { id: leadId },
      update: {},
      create: { id: leadId, email: measurement?.email }
    })

    await prisma.progress.upsert({
      where: { leadId },
      update: { stage },
      create: { leadId, stage }
    })

    if (measurement) {
      const { waistCm, inseamCm, email } = measurement
      await prisma.measurement.upsert({
        where: { leadId },
        update: { waistCm, inseamCm },
        create: { leadId, waistCm, inseamCm }
      })
      if (email && !lead.email) {
        await prisma.lead.update({ where: { id: leadId }, data: { email } })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}