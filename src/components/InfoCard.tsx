// src/components/InfoCard.tsx

import Link from 'next/link'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from './ui/button'

// import FooterNav from './FooterNav'
// import { Button } from './ui/button'

interface InfoCardProps {
  index: number
  title: string
  description: string
}

const InfoCard: React.FC<InfoCardProps> = ({ index, title, description }) => {
  return (
    <Card className="flex w-[290px] shrink-0 flex-col">
      <CardHeader className="pb-1">
        <CardTitle className="shrink-0">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="bg-primary px-4 py-2" size="sm">
          <Link href={`/tipos-de-violencia?index=${index}`}>
            Más información
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default InfoCard
