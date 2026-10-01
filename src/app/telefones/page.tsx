// src/app/telefones/page.tsx
// Server Component: consulta la API en el servidor (con respaldo
// estático si falla) y entrega la página ya armada.

import FooterNav from '@/components/FooterNav'
import { HelpCard } from '@/components/HelpCard'
import { getPhones } from '@/http/api/queries'

import { HeaderWithReturn } from '../components/header-with-return'

export const revalidate = 300

export default async function HelpPage() {
  const phones = await getPhones()

  return (
    <div className="flex flex-col gap-4 p-8 pb-28 md:px-0">
      <HeaderWithReturn />

      <header>
        <h1>¿Cómo pedir ayuda?</h1>
      </header>

      <section className="mt-4 flex flex-col gap-4">
        {phones.map((contact) => (
          <HelpCard
            key={contact.id}
            number={contact.number}
            title={contact.title}
            description={contact.description}
          />
        ))}
      </section>

      <FooterNav />
    </div>
  )
}
