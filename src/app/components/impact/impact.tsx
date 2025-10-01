import './impact.css'
import '../home.css'
export default function Impact() {

    const impactStats = [
        { number: '200', label: 'Peças transformadas' },
        { number: '4', label: 'Anos de experiência' },
        { number: '5.650', label: 'Clientes satisfeitos' },
        { number: '10.00', label: 'Avaliação média' }
    ]
    return (
        <section className='section-home'>
            <div className="impact-section">
                <div>
                    <div className="impact-container">
                        <div className="impact-header">
                            <h2>Impacto</h2>
                        </div>
                        <div className="impact-grid">
                            {impactStats.map((stat, index) => (
                                <div key={index} className="impact-item">
                                    <div className="impact-number">{stat.number}</div>
                                    <div className="impact-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}