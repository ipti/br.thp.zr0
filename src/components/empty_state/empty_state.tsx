import { ReactNode } from 'react'
import './empty_state.css'

export function ZEmptyState({
  icon = 'pi pi-info-circle',
  title,
  description,
  action,
}: {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="z-empty-state">
      <i className={`${icon} z-empty-state-icon`} />
      <h3 className="z-empty-state-title">{title}</h3>
      {description && <p className="z-empty-state-description">{description}</p>}
      {action && <div className="z-empty-state-action">{action}</div>}
    </div>
  )
}
