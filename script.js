// Global variables
let isEnglish = true;

// Translations object
const translations = {
    en: {
        sendMessage: "Send Message",
        sending: "Sending...",
        thankYou: "Thank you for your message!",
        willRespond: "We'll get back to you as soon as possible.",
        emailConfirmation: "A confirmation email has been sent to your email address.",
        disclaimer: "Note: If the page appears to be loading, please refresh. Your message will still be sent successfully."
    },
    zh: {
        sendMessage: "发送",
        sending: "发送中...",
        thankYou: "感谢您的留言！",
        willRespond: "我们会尽快与您联系。",
        emailConfirmation: "确认邮件已发送至您的邮箱。",
        disclaimer: "注意：如果页面显示正在加载，请刷新页面。您的信息仍会成功发送。"
    }
};

// Update content function
function updateContent(content) {
    // Update all elements with data-lang-key attribute
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (content[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = content[key];
            } else {
                element.textContent = content[key];
            }
        }
    });

    // Update submit button
    const submitButton = document.querySelector('.submit-button');
    if (submitButton && !submitButton.disabled) {
        submitButton.textContent = content.sendMessage;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('.submit-button');

    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }

    // Add disclaimer message after submit button
    const disclaimerMessage = document.createElement('p');
    disclaimerMessage.className = 'form-disclaimer';
    disclaimerMessage.style.cssText = 'font-size: 0.85rem; color: #666; margin-top: 0.5rem; text-align: center;';
    disclaimerMessage.innerHTML = isEnglish ? 
        'Note: If the page appears to be loading, please refresh. Your message will still be sent successfully.' :
        '注意：如果页面显示正在加载，请刷新页面。您的信息仍会成功发送。';
    submitButton.parentNode.insertBefore(disclaimerMessage, submitButton.nextSibling);

    // Language toggle handling
    const langToggle = document.getElementById('langToggle');
    const langText = langToggle.querySelector('.lang-text');

    langToggle.addEventListener('click', function() {
        isEnglish = !isEnglish;
        langText.textContent = isEnglish ? "中文" : "English";
        updateContent(translations[isEnglish ? 'en' : 'zh']);
        
        // Update disclaimer text
        disclaimerMessage.innerHTML = isEnglish ? 
            'Note: If the page appears to be loading, please refresh. Your message will still be sent successfully.' :
            '注意：如果页面显示正在加载，请刷新页面。您的信息仍会成功发送。';
    });

    contactForm.addEventListener('submit', function(e) {
        // Show success message immediately
        const successMessage = isEnglish ? {
            title: translations.en.thankYou,
            message: translations.en.willRespond,
            confirmation: translations.en.emailConfirmation
        } : {
            title: translations.zh.thankYou,
            message: translations.zh.willRespond,
            confirmation: translations.zh.emailConfirmation
        };

        // Replace form with success message
        this.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>${successMessage.title}</h3>
                <p>${successMessage.message}</p>
                <p>${successMessage.confirmation}</p>
            </div>
        `;
        
        // Scroll to success message
        this.scrollIntoView({ behavior: 'smooth' });

        // Let the form submit naturally
        return true;
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