document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('.submit-button');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value,
            customService: document.getElementById('customService')?.value || ''
        };

        try {
            const response = await fetch('/api/send-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                contactForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank you for your message!</h3>
                        <p>We'll get back to you as soon as possible.</p>
                    </div>
                `;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again or contact us directly.');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });

    // Handle custom service field visibility
    const serviceSelect = document.getElementById('service');
    const customServiceField = document.getElementById('customServiceField');

    serviceSelect?.addEventListener('change', function() {
        if (customServiceField) {
            customServiceField.style.display = 
                this.value === 'other' ? 'block' : 'none';
        }
    });
}); 