import './AboutContact.css';

export default function About() {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <h1>About CareCheck Technologies</h1>
          <p>Building tools that make childcare safer, more organized, and compliant.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-sections">
            <section className="content-block">
              <h2>Our Mission</h2>
              <p>
                CareCheck Technologies is dedicated to creating practical, thoughtful tools that help childcare professionals do what they do best: care for children safely and provide families with peace of mind.
              </p>
              <p>
                We understand the complexity of modern childcare operations. From licensing compliance to health documentation, from classroom safety to staff communication, childcare leaders manage countless details every day. Our mission is to simplify that complexity through smart, practical tools designed specifically for the childcare industry.
              </p>
            </section>

            <section className="content-block">
              <h2>Why We Exist</h2>
              <p>
                Too many childcare professionals spend their time managing paperwork and compliance instead of focusing on children. Too many parents worry about safety and communication in their child's care environment. Too many directors struggle to find tools built for their actual needs.
              </p>
              <p>
                CareCheck Technologies exists to change that. We create tools that:
              </p>
              <ul className="values-list">
                <li><strong>Reduce administrative burden</strong> so teachers can focus on children</li>
                <li><strong>Ensure compliance</strong> with licensing requirements and best practices</li>
                <li><strong>Improve communication</strong> between caregivers, families, and administrators</li>
                <li><strong>Enhance safety</strong> through better documentation and procedures</li>
                <li><strong>Build professionalism</strong> in childcare operations</li>
              </ul>
            </section>

            <section className="content-block">
              <h2>Our Approach</h2>
              <p>
                CareCheck products are designed with input from experienced childcare directors, teachers, and administrators. We listen to real challenges and create practical solutions—not technology for technology's sake, but thoughtful tools that solve actual problems.
              </p>
              <p>
                Every product in the CareCheck line reflects our commitment to quality, safety, and the professionalism that childcare deserves.
              </p>
            </section>

            <section className="content-block">
              <h2>Contact Us</h2>
              <p>
                Have questions about CareCheck? Want to learn more about how our tools can support your program? We'd love to hear from you.
              </p>
              <a href="/contact" className="btn btn-primary">Get in Touch</a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
