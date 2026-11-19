import type { Metric } from '../../data/types'

interface MetricStatProps {
  metric: Metric
}

/** A single headline figure, set plainly: value, what it measures, a footnote. */
export default function MetricStat({ metric }: MetricStatProps) {
  return (
    <div class="metric">
      <p class="metric__value">{metric.display}</p>
      <p class="metric__label">{metric.label}</p>
      {metric.detail ? <p class="metric__detail">{metric.detail}</p> : ''}
    </div>
  )
}
