import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { prisma } from '@repo/utils/db'

export default async function FinalPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token
  const ck = cookies()
  const leadId = ck.get('leadId')?.value

  if (!leadId) notFound()

  if (token) {
    const tok = await prisma.accessToken.findUnique({ where: { token } })
    if (!tok || tok.leadId !== leadId || tok.usedAt || tok.expiresAt < new Date()) notFound()
    await prisma.accessToken.update({ where: { token }, data: { usedAt: new Date() } })
  } else {
    const prog = await prisma.progress.findUnique({ where: { leadId } })
    if (!prog || prog.stage !== 'final') notFound()
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold">Bienvenido a la etapa final</h1>
      <p className="text-neutral-300 mt-2">Aquí iría la experiencia/checkout/código Founder, etc.</p>
    </main>
  )
}
