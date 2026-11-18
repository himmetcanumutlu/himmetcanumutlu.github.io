import { proofMetrics } from '../../data/profile'
import MetricStat from '../ui/MetricStat'

export default function ProofStrip() {
  return (
    <section class="proof" aria-label="Highlights">
      <div class="container">
        <ul class="proof__list" role="list">
          {proofMetrics.map(metric => (
            <li key={metric.id} class="proof__item">
              <MetricStat metric={metric} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
