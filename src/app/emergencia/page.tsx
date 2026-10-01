'use client'

import { useRouter } from 'next/navigation'

import { HelpCard } from '@/components/HelpCard'
import { Button } from '@/components/ui/button'
import { usePhone } from '@/context/PhoneContext'

// import { Footer } from '../components/footer'
import { HeaderWithReturn } from '../components/header-with-return'

export default function EmergencyScreen() {
  const router = useRouter()
  const { selectedPhones } = usePhone()

  return (
    <div className="flex min-h-dvh flex-col px-8 py-4">
      <HeaderWithReturn />
      <div className="mt-4 flex flex-grow flex-col">
        <div className="flex-grow overflow-y-auto">
          <h1>
            ¡Llama de inmediato a{' '}
            {selectedPhones.length > 1 ? 'uno de estos números' : 'este número'}!
          </h1>
          <div className="mt-9 flex flex-col gap-4">
            {selectedPhones.map((phone, index) => (
              <HelpCard
                key={index}
                number={phone.number}
                description={phone.description}
                title={phone.title}
              />
            ))}
          </div>
        </div>

        <div className="w-full text-center">
          <Button
            className="text-primary underline transition-colors hover:text-primary/80 hover:no-underline"
            variant="link"
            onClick={() => router.push('/infos')}
          >
            Más información
          </Button>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}
