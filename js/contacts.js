document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      alert(`Thank you, ${name}! Your message has been received.`);
      contactForm.reset();
    });
  });