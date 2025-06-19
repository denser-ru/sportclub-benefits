import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        SportClub
      </NavLink>
      <nav>
        <ul className="navbar-links">
          <li>
            <NavLink to="/beneficios">
              Benefits
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;