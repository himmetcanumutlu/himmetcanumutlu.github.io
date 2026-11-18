import { Component } from '@geajs/core'
import type { Metric } from '../../data/types'
import { prefersReducedMotion, isBrowser } from '../../lib/env'
import { onFirstVisible } from '../../lib/visible'

const DURATION_MS = 1200

const formatNumber = (value: number): string => value.toLocaleString('en-US')

/**
 * A single headline number. Renders the final value up front (so it is
 * correct without JavaScript), then counts up once when scrolled into view.
 */
export default class MetricStat extends Component {
  declare props: { metric: Metric }

  /** Animated text while counting; empty string means "show the final value". */
  animated = ''
  frame = 0
  stopWatching: (() => void) | null = null

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    const { metric } = this.props
    if (!this.el || metric.value === null || metric.value <= 0 || prefersReducedMotion()) return
    this.stopWatching = onFirstVisible(this.el, () => this.countUp(metric))
  }

  countUp(metric: Metric): void {
    const target = metric.value ?? 0
    const prefix = metric.prefix ?? ''
    const suffix = metric.suffix ?? ''
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      const eased = 1 - Math.pow(1 - progress, 3)
      if (progress < 1) {
        this.animated = `${prefix}${formatNumber(Math.round(target * eased))}${suffix}`
        this.frame = requestAnimationFrame(tick)
      } else {
        this.animated = ''
      }
    }

    this.frame = requestAnimationFrame(tick)
  }

  dispose(): void {
    this.stopWatching?.()
    cancelAnimationFrame(this.frame)
    super.dispose()
  }

  template({ metric }: this['props']) {
    return (
      <div class="metric" data-domain={metric.domain ?? ''}>
        <p class="metric__value">
          <span class="sr-only">{metric.display}</span>
          <span aria-hidden="true">{this.animated || metric.display}</span>
        </p>
        <p class="metric__label">{metric.label}</p>
        {metric.detail ? <p class="metric__detail">{metric.detail}</p> : ''}
      </div>
    )
  }
}
