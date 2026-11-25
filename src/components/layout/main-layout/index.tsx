import { useState, type ReactNode } from 'react'
import { Header } from '../header'
import { Sidebar } from '../sidebar'
import type { Page } from '../../../constants/routes'

type MainLayoutProps = {
  children: ReactNode
  activePage: Page
  onNavigate: (page: Page) => void
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  profileName: string
  onProfileNameChange: (name: string) => void
}

export function MainLayout({
  children,
  activePage,
  onNavigate,
  theme,
  onThemeChange,
  profileName,
  onProfileNameChange,
}: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function navigate(page: Page) {
    onNavigate(page)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="app-shell">
      {isMobileMenuOpen && (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isMobileOpen={isMobileMenuOpen}
        theme={theme}
        onThemeChange={onThemeChange}
        profileName={profileName}
        onProfileNameChange={onProfileNameChange}
      />
      <div className="app-content">
        <Header
          onNewTransaction={() => navigate('transactions')}
          onMenuToggle={() => setIsMobileMenuOpen((open) => !open)}
        />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}