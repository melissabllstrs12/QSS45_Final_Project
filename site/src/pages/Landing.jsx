import { GitHubIcon, LinkedInIcon } from '../components/icons.jsx'
import './Landing.css'

export default function Landing() {
  return (
    <main className="landing">
      <div className="landing__blob" aria-hidden="true" />
      <div className="landing__inner">
        <h1 className="landing__name">Melissa Ballesteros</h1>
        <p className="landing__title">Dartmouth College</p>

        <div className="landing__links">
          <a
            className="icon-link"
            href="https://github.com/melissabllstrs12"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
          <a
            className="icon-link"
            href="https://www.linkedin.com/in/melissa-ballesteros-37883a28b"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </main>
  )
}
