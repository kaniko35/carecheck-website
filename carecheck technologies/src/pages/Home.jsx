import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const productCategories = [
    {
      title: 'Infant Care Solutions',
      description: 'Specialized tools for infant safety, health tracking, and daily routines.',
      products: ['CribCheck™', 'BottleCheck™', 'PaciCheck™', 'BibDry™', 'LaundryCheck™', 'TempCheck™'],
      link: '/infant-care',
      icon: '👶'
    },
    {
      title: 'Toddler Solutions',
      description: 'Support toddler transitions and safety with classroom-tested tools.',
      products: ['WalkSafe™', 'TopicalCheck™', 'FloorCheck™', 'Safety Transition Tools'],
      link: '/toddler',
      icon: '🚶'
    },
    {
      title: 'Office Solutions',
      description: 'Streamline operations and emergency preparedness for administrators.',
      products: ['Medication Organizer', 'FirstAid Station™', 'TempCheck™', 'Emergency Preparedness'],
      link: '/office',
      icon: '🏢'
    },
    {
      title: 'CareCheck Essentials',
      description: 'Practical supplies for organization, sanitation, and classroom management.',
      products: ['Labels', 'Checklists', 'Sanitation Signs', 'Classroom Organization'],
      link: '/essentials',
      icon: '📋'
    },
    {
      title: 'CareCheck Academy',
      description: 'Staff training resources for health, safety, compliance, and procedures.',
      products: ['Health Training', 'Safety Protocols', 'Compliance Resources', 'Procedure Guides'],
      link: '/academy',
      icon: '📚'
    }
  ];

  return (
    <main className="home-page">
      <Hero />
      
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>CareCheck Solutions</h2>
            <p>Complete tools for every aspect of childcare operations.</p>
          </div>
          
          <div className="products-grid">
            {productCategories.map((category, index) => (
              <ProductCard
                key={index}
                title={category.title}
                description={category.description}
                products={category.products}
                link={category.link}
                icon={category.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Simplify Childcare Operations?</h2>
            <p>Join childcare professionals using CareCheck Technologies for safety, compliance, and organization.</p>
            <a href="/contact" className="btn btn-primary">Get Started Today</a>
          </div>
        </div>
      </section>
    </main>
  );
}
