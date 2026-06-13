import './SolutionPage.css';

export default function OfficeSolutions() {
  const products = [
    {
      name: 'Medication Organizer',
      description: 'Centralized medication tracking and administration documentation.'
    },
    {
      name: 'FirstAid Station™',
      description: 'Comprehensive emergency preparedness and first aid management system.'
    },
    {
      name: 'TempCheck™',
      description: 'Health screening and temperature monitoring for all ages.'
    },
    {
      name: 'Emergency Preparedness',
      description: 'Tools for disaster planning, evacuation procedures, and crisis response.'
    }
  ];

  return (
    <main className="solution-page">
      <section className="solution-hero">
        <div className="container">
          <h1>Office Solutions</h1>
          <p>Streamline administrative operations and emergency preparedness. Professional tools designed for childcare directors, owners, and administrators to manage compliance and operations efficiently.</p>
        </div>
      </section>

      <section className="solution-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2>Streamline Operations & Compliance</h2>
              <p>
                Childcare administrators manage complex operations including medication administration, emergency protocols, health screening, and regulatory compliance. CareCheck Office Solutions provide the tools administrators need to ensure safety, maintain documentation, and prepare for any situation.
              </p>
              <p>
                Our office-focused systems reduce administrative burden, minimize errors, and create clear audit trails for licensing inspections and parent confidence.
              </p>
            </div>

            <div className="products-showcase">
              <h3>Our Office Solutions</h3>
              <div className="products-list">
                {products.map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-icon">🏢</div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cta-box">
            <h3>Simplify administrative operations</h3>
            <p>Discover how CareCheck helps administrators manage compliance and operations with confidence.</p>
            <a href="/contact" className="btn btn-primary">Schedule a Demo</a>
          </div>
        </div>
      </section>
    </main>
  );
}
