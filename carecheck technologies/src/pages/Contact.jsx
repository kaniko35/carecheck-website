import { useState } from 'react';
import './AboutContact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll be in touch soon.');
    setFormData({ name: '', email: '', program: '', message: '' });
  };

  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have questions? We're here to help.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Whether you have questions about our products, want to schedule a demo, or need support, our team is ready to help. Fill out the form and we'll respond promptly.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <h4>Email</h4>
                  <p><a href="mailto:info@carecheck.com">info@carecheck.com</a></p>
                </div>
                <div className="contact-method">
                  <h4>Phone</h4>
                  <p><a href="tel:+1-800-555-0123">1-800-555-0123</a></p>
                </div>
                <div className="contact-method">
                  <h4>Hours</h4>
                  <p>Monday - Friday: 9am - 5pm EST</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Contact Form</h3>
              
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="program">Program Name/Type</label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="Your childcare program"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
