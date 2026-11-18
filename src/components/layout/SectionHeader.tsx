interface SectionHeaderProps {
  /** Section id; the heading gets `${id}-title` for aria-labelledby. */
  id: string
  title: string
  kicker?: string
  lede?: string
}

export default function SectionHeader({ id, title, kicker, lede }: SectionHeaderProps) {
  return (
    <header class="section-header">
      {kicker ? <p class="section-header__kicker">{kicker}</p> : ''}
      <h2 id={`${id}-title`}>{title}</h2>
      {lede ? <p class="section-header__lede">{lede}</p> : ''}
    </header>
  )
}
