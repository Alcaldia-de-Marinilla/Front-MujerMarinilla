'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export function HeaderWithReturn() {
  const router = useRouter()

  return (
    <div className="flex items-center pb-4 pt-7">
      <Button
        variant="secondary"
        size="icon"
        onClick={router.back}
        className="rounded-full"
      >
        <ChevronLeft />
      </Button>
    </div>
  )
}
