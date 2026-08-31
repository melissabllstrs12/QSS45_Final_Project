import './Hero.css'
import { ArrowIcon } from './icons.jsx'

export default function Hero({ eyebrow, title, subtitle, links }) {
  return (
    <header className="hero">
      <div className="hero__blob" aria-hidden="true" />
      <div className="hero__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="hero__title">{title}</h1>
        <p className="hero__subtitle">{subtitle}</p>
        <div className="hero__links">
          {links.map((link) => (
            <a
              key={link.href}
              className={`btn ${link.primary ? 'btn--primary' : 'btn--ghost'}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
              <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
