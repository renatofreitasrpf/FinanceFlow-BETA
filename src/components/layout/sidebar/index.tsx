import { useState } from 'react'
import { pageItems, type Page } from '../../../constants/routes'

const Icon = ({ name }: { name: string }) => {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    wallet: <><path d="M20 7v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a2 2 0 0 1 2 2v1Z" /><path d="M16 12h6v4h-6a2 2 0 0 1 0-4Z" /></>,
    categories: <><path d="M12 2 22 12 12 22 2 12Z" /><path d="M12 2v20M2 12h20" /></>,
    report: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    bank: <><path d="m3 9 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M2 18h20" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

type SidebarProps = {
  activePage: Page
  onNavigate: (page: Page) => void
  isMobileOpen?: boolean
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  profileName: string
  onProfileNameChange: (name: string) => void
}

export function Sidebar({
  activePage,
  onNavigate,
  isMobileOpen = false,
  theme,
  onThemeChange,
  profileName,
  onProfileNameChange,
}: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const initials = profileName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 15.5 9.2 11l3.1 3.1L19 7" />
            <path d="M14 7h5v5" />
          </svg>
        </div>
        <span>FinanceFlow</span>
      </div>

      <nav className="nav-list" aria-label="Menu principal">
        {pageItems.map((item) => (
          <button
            className={`nav-item ${activePage === item.page ? 'active' : ''}`}
            type="button"
            key={item.label}
            onClick={() => onNavigate(item.page)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="profile-button" type="button" onClick={() => setIsProfileOpen((open) => !open)}>
          <div className="profile-avatar">{initials}</div>
          <div className="profile-copy">
            <strong>{profileName}</strong>
            <span>Conta pessoal</span>
          </div>
        </button>
      </div>

      {isProfileOpen && (
        <div className="profile-popover">
          <label>
            Nome do perfil
            <input
              value={profileName}
              onChange={(event) => onProfileNameChange(event.target.value)}
            />
          </label>
          <div className="theme-toggle">
            <span>Tema</span>
            <button type="button" onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? 'Claro' : 'Escuro'}
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}