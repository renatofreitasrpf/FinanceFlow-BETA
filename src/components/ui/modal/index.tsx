import type { PropsWithChildren, ReactNode, MouseEvent } from 'react'

type ModalProps = PropsWithChildren<{
  title: string
  eyebrow?: string
  onClose: () => void
  actions?: ReactNode
}>

export function Modal({ title, eyebrow, onClose, actions, children }: ModalProps) {
  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={closeOnBackdrop}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id="modal-title">{title}</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar">×</button>
        </div>
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </section>
    </div>
  )
}