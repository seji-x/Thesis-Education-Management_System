import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import clsx from 'clsx'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/config/fonts'
import ProgressBar from '@/components/layouts/ProgressBar'
import BaseRegistry from '@/components/common/BaseRegistry'
import ReduxProvider from '@/components/common/ReduxProvider'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Student management',
    template: `%s - ${'Student management'}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <ReduxProvider>
            <ProgressBar>{children}</ProgressBar>
          </ReduxProvider>
          <BaseRegistry />
          {/* <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                title="nextui.org homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">NextUI</p>
              </Link>
            </footer>
          </div> */}
        </Providers>
      </body>
    </html>
  )
}