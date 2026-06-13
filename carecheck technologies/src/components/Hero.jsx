import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Childcare safety, compliance, and classroom organization made simpler.</h1>
          <p className="hero-subtitle">
            CareCheck Technologies creates practical tools for infant care, classroom routines, medication organization, safety checks, and licensing readiness.
          </p>
          <div className="hero-buttons">
            <Link to="/infant-care" className="btn btn-primary">Explore Solutions</Link>
            <Link to="/essentials" className="btn btn-secondary">Shop Essentials</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <svg width="100%" height="100%" viewBox="0 0 500 400" fill="none">
              <rect width="500" height="400" fill="#f3f4f6" />
              <circle cx="250" cy="150" r="80" fill="#2d8e5f" opacity="0.2" />
              <rect x="150" y="250" width="200" height="120" rx="8" fill="#2d8e5f" opacity="0.1" />
              <text x="250" y="350" textAnchor="middle" fill="#6c757d" fontSize="18">Classroom Organization Tools</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
