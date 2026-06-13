import './SolutionPage.css';

export default function Essentials() {
  const products = [
    {
      name: 'Labels & Tags',
      description: 'Durable, washable labels for clothing, bottles, and belongings.'
    },
    {
      name: 'Daily Checklists',
      description: 'Printed and digital checklists for classroom routines and compliance.'
    },
    {
      name: 'Sanitation Signs',
      description: 'Professional signage for cleaning schedules and sanitation reminders.'
    },
    {
      name: 'Classroom Organization',
      description: 'Storage systems, bins, and organization solutions for childcare environments.'
    }
  ];

  return (
    <main className="solution-page">
      <section className="solution-hero">
        <div className="container">
          <h1>CareCheck Essentials</h1>
          <p>Practical supplies and materials for classroom organization, sanitation, and daily management. The building blocks for an organized, compliant, professional childcare environment.</p>
        </div>
      </section>

      <section className="solution-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2>Organization & Operational Supplies</h2>
              <p>
                Professional childcare operations depend on having the right tools and supplies on hand. CareCheck Essentials provides a curated selection of items designed specifically for childcare environments—from organizational supplies to compliance signage.
              </p>
              <p>
                These practical products help create an organized, professional environment that communicates competence and care to parents and licensing inspectors alike.
              </p>
            </div>

            <div className="products-showcase">
              <h3>Our Essential Products</h3>
              <div className="products-list">
                {products.map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-icon">📋</div>
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
            <h3>Shop supplies built for childcare</h3>
            <p>Browse our selection of organization and operational essentials.</p>
            <a href="/contact" className="btn btn-primary">Browse Products</a>
          </div>
        </div>
      </section>
    </main>
  );
}
