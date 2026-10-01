import { Phone } from 'lucide-react'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from './ui/button'

interface HelpCardProps {
  number: string
  title: string
  description: string
}

export function HelpCard({ number, title, description }: HelpCardProps) {
  // Define el tamaño de la fuente según la longitud del número
  const getFontSize = (text: string) => {
    if (text.length <= 4) return 'text-6xl' // Grande para textos cortos
    if (text.length <= 6) return 'text-5xl' // Medio
    return 'text-3xl' // Más pequeño para textos largos
  }
  return (
    <Card>
      <CardHeader className="space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className={`${getFontSize(number)} text-primary`}>
            {number}
          </CardTitle>
          <Button
            asChild
            className="size-11 rounded-full bg-card"
            size="icon"
            variant="outline"
          >
            <Link
              className="md:hidden"
              href={`tel:${number}`}
              aria-label={`Llamar al ${number}`}
            >
              <Phone />
            </Link>
          </Button>
        </div>
        <CardDescription className="mt-0 text-base leading-5 text-foreground">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
