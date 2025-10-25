# 70/30 — Founder Box 🪡

**Proyecto base del ecosistema 70/30.**  
Esta versión contiene únicamente la primera experiencia: **Founder Box**, el acceso inicial al universo 70/30.

---

## 🧩 Estructura
apps/founder-box/ → App principal (Next.js 14)
packages/utils/ → Prisma Client
packages/ui/ → Tokens de diseño
prisma/schema.prisma → Modelos de base de datos
.env.example → Variables de entorno

---

## 🚀 Cómo iniciar

```bash
npm install -g pnpm
pnpm install
pnpm dlx prisma generate
pnpm dlx prisma migrate dev -n init
pnpm --filter founder-box dev
🧠 Etapas
Caja 3D: experiencia inicial con Three.js.
Test + Medidas: formulario con validación y guardado en BD.
Link Final: token único enviado por email o WhatsApp.
⚙️ Tecnologías
Next.js 14 (App Router)
TypeScript + TailwindCSS
Prisma + SQLite
Three.js / React Three Fiber
“No compras un pantalón; compras tu lugar en el futuro.”
— 70/30
