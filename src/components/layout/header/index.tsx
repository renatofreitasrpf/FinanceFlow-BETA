export function Header({
  onNewTransaction,
  onMenuToggle,
}: {
  onNewTransaction: () => void
  onMenuToggle: () => void
}) {
  return (
    <header className="topbar">
      <button className="mobile-menu" type="button" aria-label="Abrir menu" onClick={onMenuToggle}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Pesquisar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
          </svg>
        </button>
        <button className="icon-button notification-button" type="button" aria-label="Notificacoes">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
            <path d="M10 21h4" />
          </svg>
          <span className="notification-dot" />
        </button>
        <button className="add-button" type="button" onClick={onNewTransaction}>
          <span>+</span>
          Nova transacao
        </button>
      </div>
    </header>
  )
}