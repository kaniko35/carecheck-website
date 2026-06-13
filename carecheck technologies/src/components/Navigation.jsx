import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <span className="logo-text">CareCheck<span className="logo-tm">™</span></span>
            <span className="logo-subtitle">Technologies</span>
          </Link>
        </div>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/infant-care">Infant Care</Link></li>
          <li><Link to="/toddler">Toddler</Link></li>
          <li><Link to="/office">Office</Link></li>
          <li><Link to="/essentials">Essentials</Link></li>
          <li><Link to="/academy">Academy</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
