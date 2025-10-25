import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@repo/utils/db'
import Box3D from './components/stages/Box3D'
import QuizForm from './components/stages/QuizForm'
import FinalView from './components/stages/FinalView'

async function ensureLead() {
  const ck = cookies()
  let leadId = ck.get('leadId')?.value
  if (!leadId) {
    const lead = await prisma.lead.create({ data: {} })
    leadId = lead.id
    // @ts-ignore
    ck.set('leadId', leadId, { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 * 180 })
    await prisma.progress.create({ data: { leadId: lead.id } })
  }
  return leadId
}

export default async function Page() {
  const leadId = await ensureLead()
  const progress = await prisma.progress.findUnique({ where: { leadId } })
  if (!progress) redirect('/')

  const stage = (progress.stage as 'box' | 'quiz' | 'final') ?? 'box'

  return (
    <main className="container mx-auto p-4">
      {stage === 'box' && <Box3D leadId={leadId} />}
      {stage === 'quiz' && <QuizForm leadId={leadId} />}
      {stage === 'final' && <FinalView leadId={leadId} />}
    </main>
  )
}
