import './SolutionPage.css';

export default function Academy() {
  const products = [
    {
      name: 'Health & Safety Training',
      description: 'Comprehensive resources for staff training on health and safety protocols.'
    },
    {
      name: 'Compliance Procedures',
      description: 'Guides and documentation systems for meeting licensing requirements.'
    },
    {
      name: 'Best Practices Library',
      description: 'Evidence-based resources and procedures for quality childcare operations.'
    },
    {
      name: 'Staff Development',
      description: 'Training materials and resources for ongoing professional development.'
    }
  ];

  return (
    <main className="solution-page">
      <section className="solution-hero">
        <div className="container">
          <h1>CareCheck Academy</h1>
          <p>Staff training resources, compliance guides, and professional development materials. Build competence, confidence, and compliance across your entire team.</p>
        </div>
      </section>

      <section className="solution-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2>Professional Training & Development</h2>
              <p>
                Staff competence and consistent procedures are the foundation of quality childcare. CareCheck Academy provides training resources, compliance guides, and professional development materials designed to build strong, knowledgeable teams.
              </p>
              <p>
                From licensing compliance to health and safety protocols to best practices in child development, our academy resources help ensure every staff member understands and implements the procedures that keep children safe and programs successful.
              </p>
            </div>

            <div className="products-showcase">
              <h3>Academy Resources</h3>
              <div className="products-list">
                {products.map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-icon">📚</div>
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
            <h3>Invest in your team's professional development</h3>
            <p>Explore CareCheck Academy resources for training and compliance.</p>
            <a href="/contact" className="btn btn-primary">Access Academy</a>
          </div>
        </div>
      </section>
    </main>
  );
}
