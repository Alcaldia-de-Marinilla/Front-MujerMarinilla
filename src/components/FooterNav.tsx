'use client'

import { ClipboardList, Info, Map, Phone } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/',
    icon: <ClipboardList aria-label="Inicio" strokeWidth={1.5} />,
    label: 'Inicio',
  },
  {
    href: '/infos',
    icon: <Info aria-label="Información" strokeWidth={1.5} />,
    label: 'Info',
  },
  {
    href: '/equipamentos',
    icon: <Map aria-label="Mapa" strokeWidth={1.5} />,
    label: 'Mapa',
  },
  {
    href: '/telefones',
    icon: <Phone aria-label="Teléfonos" strokeWidth={1.5} />,
    label: 'Teléfonos',
  },
]
const FooterNav = () => {
  const pathname = usePathname()

  const isActive = (route: string) => pathname === route

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[5.33rem] max-w-md justify-around bg-primary p-4 shadow-[0_-2px_5px_rgba(0,0,0,0.2)]">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex min-w-[62.763px] flex-col items-center text-white no-underline"
        >
          <div className="h-6 w-6">{item.icon}</div>
          <span
            className={`mt-1 h-4 text-sm transition ${
              isActive(item.href) ? 'font-bold' : 'font-medium'
            }`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </footer>
  )
}

export default FooterNav
