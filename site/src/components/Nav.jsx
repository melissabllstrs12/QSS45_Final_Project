import { NavLink } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand" end>
          Melissa Ballesteros
        </NavLink>
        <div className="nav__tabs">
          <NavLink
            to="/maternal-morbidity"
            className={({ isActive }) => `nav__tab${isActive ? ' nav__tab--active' : ''}`}
          >
            Maternal Morbidity
          </NavLink>
          <NavLink
            to="/steel-tariffs"
            className={({ isActive }) => `nav__tab${isActive ? ' nav__tab--active' : ''}`}
          >
            Steel Tariffs
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
