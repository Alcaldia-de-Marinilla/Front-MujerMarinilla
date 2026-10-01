'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

interface HeaderWithReturnPaginatedProps {
  currentPage: string
}

export function HeaderWithReturnPaginated({
  currentPage,
}: HeaderWithReturnPaginatedProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push(`/equipamentos?page=${currentPage}`)
  }

  return (
    <div className="flex items-center pb-4 pt-7">
      <Button
        variant="secondary"
        size="icon"
        onClick={handleBack}
        className="rounded-full"
      >
        <ChevronLeft />
      </Button>
    </div>
  )
}
