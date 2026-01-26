import './timeline.css'

export interface TimelineItem {
    id: string | number
    icon?: React.ReactNode
    label: string
    description?: string
    color?: string
    status?: 'completed' | 'current' | 'pending'
}

export interface ZTimelineProps {
    items: TimelineItem[]
    direction?: 'vertical' | 'horizontal'
    activeStep?: number
}

export function ZTimeline({ items, direction = 'vertical', activeStep = 0 }: ZTimelineProps) {
    return (
        <div className={`z-timeline z-timeline--${direction}`}>
            {items.map((item, index) => (
                <div key={item.id} className="z-timeline__item">
                    <div className="z-timeline__content">
                        <div
                            className={`z-timeline__icon z-timeline__icon--${item.status || (index <= activeStep ? 'completed' : 'pending')}`}
                            style={{ backgroundColor: item.color || "var(--primary-color)" }}
                        >
                            {item.icon || (index + 1)}
                        </div>
                        <div className="z-timeline__text">
                            <h3 className="z-timeline__label">{item.label}</h3>
                            {item.description && (
                                <p className="z-timeline__description">{item.description}</p>
                            )}
                        </div>
                    </div>
                    <div
                        className={`z-timeline__connector z-timeline__connector--${index < activeStep ? 'completed' : 'pending'}`}
                        style={{
                            backgroundColor: index < activeStep ? (items[index].color || '#1e40af') : '#e5e7eb'
                        }}
                    />

                </div>
            ))}
        </div>
    )
}