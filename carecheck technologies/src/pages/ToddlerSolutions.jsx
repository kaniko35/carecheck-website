import './SolutionPage.css';

export default function ToddlerSolutions() {
  const products = [
    {
      name: 'WalkSafe™',
      description: 'Mobility safety and supervision tracking for active toddlers.'
    },
    {
      name: 'TopicalCheck™',
      description: 'Sunscreen and topical care application documentation.'
    },
    {
      name: 'FloorCheck™',
      description: 'Play area safety assessment and hazard identification tool.'
    },
    {
      name: 'Safety Transition Tools',
      description: 'Support for transitions between developmental milestones.'
    }
  ];

  return (
    <main className="solution-page">
      <section className="solution-hero">
        <div className="container">
          <h1>Toddler Solutions</h1>
          <p>Comprehensive tools for supporting toddler safety, transitions, and developmental milestones. Designed for classroom professionals managing active, growing learners.</p>
        </div>
      </section>

      <section className="solution-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2>Toddler Safety & Classroom Management</h2>
              <p>
                Toddlers are at a unique developmental stage—increasingly mobile, curious, and independent, yet still requiring close supervision and support. CareCheck Toddler Solutions provide the tools childcare professionals need to ensure safety while encouraging exploration and learning.
              </p>
              <p>
                From managing active play environments to documenting health and safety protocols, our toddler-focused systems help teachers maintain compliance while focusing on what matters most: child development and safety.
              </p>
            </div>

            <div className="products-showcase">
              <h3>Our Toddler Products</h3>
              <div className="products-list">
                {products.map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-icon">🚶</div>
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
            <h3>Support your toddler program with proven tools</h3>
            <p>Explore how CareCheck can enhance safety and compliance in your toddler classroom.</p>
            <a href="/contact" className="btn btn-primary">Learn More</a>
          </div>
        </div>
      </section>
    </main>
  );
}
