import './SolutionPage.css';

export default function InfantCare() {
  const products = [
    {
      name: 'CribCheck™',
      description: 'Safe sleep environment monitoring and documentation tool.'
    },
    {
      name: 'BottleCheck™',
      description: 'Feeding schedule tracking and bottle inventory management.'
    },
    {
      name: 'PaciCheck™',
      description: 'Pacifier hygiene and distribution tracking system.'
    },
    {
      name: 'BibDry™',
      description: 'Clothing and fabric care management for daily changes.'
    },
    {
      name: 'LaundryCheck™',
      description: 'Infant laundry sanitation and schedule management.'
    },
    {
      name: 'TempCheck™',
      description: 'Temperature monitoring and health tracking for infants.'
    }
  ];

  return (
    <main className="solution-page">
      <section className="solution-hero">
        <div className="container">
          <h1>Infant Care Solutions</h1>
          <p>Specialized tools designed for infant safety, health tracking, and daily routines. Ensure every infant receives consistent, documented care with CareCheck's infant-focused systems.</p>
        </div>
      </section>

      <section className="solution-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2>Complete Infant Care Management</h2>
              <p>
                Infants require specialized attention to safety, health, and daily routines. CareCheck Infant Care Solutions provide practical tools that help childcare professionals maintain the highest standards of care while managing documentation requirements for compliance and parent communication.
              </p>
              <p>
                Each tool in our infant care line is designed with input from experienced childcare directors and infant care specialists, ensuring they address real operational challenges in modern childcare settings.
              </p>
            </div>

            <div className="products-showcase">
              <h3>Our Infant Care Products</h3>
              <div className="products-list">
                {products.map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-icon">👶</div>
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
            <h3>Ready to streamline infant care operations?</h3>
            <p>Contact our team to learn how CareCheck can support your infant care program.</p>
            <a href="/contact" className="btn btn-primary">Get in Touch</a>
          </div>
        </div>
      </section>
    </main>
  );
}
