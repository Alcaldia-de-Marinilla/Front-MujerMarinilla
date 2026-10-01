import './globals.css'

import type { Metadata } from 'next'
import { DM_Sans as DmSans, Inter } from 'next/font/google'
import Script from 'next/script'

import { FormProvider } from '@/context/FormContext'
import { MapProvider } from '@/context/MapContext'
import { PhoneProvider } from '@/context/PhoneContext'
import { getEnv } from '@/env/server'
import { getPhones } from '@/http/api/queries'

const dmSans = DmSans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// TODO (branding Marinilla): confirmar el nombre oficial del programa
// con la Alcaldía y ajustar title/description.
export const metadata: Metadata = {
  title: 'Mujer Marinilla',
  description:
    'Reconoce las señales de violencia y encuentra apoyo especializado en Marinilla. Una aplicación creada para ayudar a las mujeres a buscar seguridad y orientación.',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const env = await getEnv()
  const phones = await getPhones()
  return (
    <html lang="es-CO">
      <body className={`${dmSans.variable} ${inter.variable} antialiased`}>
        {/* Hotjar */}
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${env.HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
        {/* Google Analytics Data Stream */}
        <Script
          strategy="afterInteractive" // Ensures script runs after the page is interactive
          src={`https://www.googletagmanager.com/gtag/js?id=${env.GOOGLE_ANALYTICS_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${env.GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${env.GOOGLE_TAG_MANAGER_ID}');
            `,
          }}
        />
        <div className="mx-auto max-w-md">
          <FormProvider>
            <PhoneProvider phones={phones}>
              <MapProvider>{children}</MapProvider>
            </PhoneProvider>
          </FormProvider>
        </div>
      </body>
    </html>
  )
}
