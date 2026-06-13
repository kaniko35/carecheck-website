import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ 
  title, 
  description, 
  products, 
  link, 
  icon = '📦' 
}) {
  return (
    <div className="product-card">
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="products-list">
        {products.map((product, index) => (
          <span key={index} className="product-badge">{product}</span>
        ))}
      </div>
      <Link to={link} className="card-link">Learn More →</Link>
    </div>
  );
}
