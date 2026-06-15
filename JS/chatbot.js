// chatbot.js - AI Chatbot for Golden Services
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chatbot
    initializeChatbot();
});

function initializeChatbot() {
    // Create chatbot HTML structure
    const chatbotHTML = `
        <div id="chatbotContainer" class="chatbot-container">
            <div id="chatbotHeader" class="chatbot-header">
                <div class="d-flex align-items-center">
                    <div class="chatbot-avatar me-2">
                        <i class="bi bi-robot"></i>
                    </div>
                    <div>
                        <h6 class="mb-0">Golden Services Assistant</h6>
                        <small class="text-muted">Online</small>
                    </div>
                </div>
                <button id="chatbotMinimize" class="btn btn-sm btn-link text-white">
                    <i class="bi bi-dash-lg"></i>
                </button>
            </div>
            
            <div id="chatbotBody" class="chatbot-body">
                <div class="welcome-message">
                    <div class="message-bubble bot">
                        <p>Hello! 👋 I'm your Golden Services assistant.</p>
                        <p>I can help you with:</p>
                        <ul>
                            <li>Information about our services</li>
                            <li>How to use the website</li>
                            <li>Order and payment questions</li>
                            <li>General business inquiries</li>
                        </ul>
                        <p>What can I help you with today?</p>
                    </div>
                </div>
                <div id="chatMessages" class="chat-messages"></div>
            </div>
            
            <div class="chatbot-footer">
                <div class="quick-questions mb-2">
                    <button class="btn btn-sm btn-outline-primary quick-question" data-question="What services do you offer?">
                        What services?
                    </button>
                    <button class="btn btn-sm btn-outline-primary quick-question" data-question="How do I make a purchase?">
                        How to buy?
                    </button>
                    <button class="btn btn-sm btn-outline-primary quick-question" data-question="Contact support">
                        Contact support
                    </button>
                </div>
                <div class="input-group">
                    <input type="text" 
                           id="chatbotInput" 
                           class="form-control" 
                           placeholder="Type your question here..."
                           aria-label="Chat message">
                    <button id="chatbotSend" class="btn btn-primary" type="button">
                        <i class="bi bi-send"></i>
                    </button>
                </div>
                <small class="text-muted mt-2 d-block">
                    <i class="bi bi-info-circle me-1"></i>
                    I'm an AI assistant. For urgent issues, contact our support team.
                </small>
            </div>
        </div>
        
        <button id="chatbotToggle" class="chatbot-toggle">
            <i class="bi bi-chat-dots"></i>
            <span class="chatbot-notification badge bg-danger">1</span>
        </button>
    `;
    
    // Add chatbot to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Setup event listeners
    setupChatbotEvents();
}

function setupChatbotEvents() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotMinimize = document.getElementById('chatbotMinimize');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotInput = document.getElementById('chatbotInput');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
        this.classList.toggle('active');
        
        // Remove notification when opened
        const notification = this.querySelector('.chatbot-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    });
    
    // Minimize chatbot
    chatbotMinimize.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
        chatbotToggle.classList.remove('active');
    });
    
    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            sendMessage();
        }
    });
    
    // Quick question buttons
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            chatbotInput.value = question;
            sendMessage();
        });
    });
    
    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (!chatbotContainer.contains(e.target) && 
            !chatbotToggle.contains(e.target) && 
            chatbotContainer.classList.contains('active')) {
            chatbotContainer.classList.remove('active');
            chatbotToggle.classList.remove('active');
        }
    });
}

function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get bot response after delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getBotResponse(message);
        addMessage(response, 'bot');
        scrollToBottom();
    }, 1000);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble ${sender}`;
    
    // Format the message (handle newlines and lists)
    let formattedText = text;
    
    // Convert * items to list items
    if (text.includes('* ')) {
        const lines = text.split('\n');
        formattedText = lines.map(line => {
            if (line.startsWith('* ')) {
                return `<li>${line.substring(2)}</li>`;
            }
            return line;
        }).join('\n');
        
        if (formattedText.includes('<li>')) {
            formattedText = formattedText.replace(/(.*)(<li>.*)/s, '$1<ul>$2</ul>');
        }
    }
    
    messageDiv.innerHTML = formattedText;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message-bubble bot typing';
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    const chatbotBody = document.getElementById('chatbotBody');
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Business & Services Questions
    if (message.includes('service') || message.includes('offer') || message.includes('provide')) {
        return "We offer a variety of digital services including:\n* Logo Design - Professional branding\n* Website Development - Custom websites\n* Graphic Design - Illustrations & marketing materials\n* Digital Marketing - Social media campaigns\n* Content Writing - SEO optimized articles\n\nYou can browse all services in our store!";
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
        return "Our prices vary by service complexity:\n* Basic services start at 50 DT\n* Standard services: 150-500 DT\n* Premium packages: 500-2000 DT\n\nYou can see detailed pricing on each product page. We offer competitive rates and quality guarantees!";
    }
    
    if (message.includes('logo') || message.includes('design')) {
        return "Our logo design service includes:\n* 3 unique concepts\n* Unlimited revisions\n* Multiple file formats (PNG, JPG, SVG, PDF)\n* Color variations\n* Delivery within 5-7 business days\n* Price: 150 DT\n\nYou can purchase this service from our store or contact us for custom requirements.";
    }
    
    if (message.includes('website') || message.includes('web')) {
        return "Our website services include:\n* Responsive design (mobile-friendly)\n* 5-10 pages\n* SEO optimization\n* Contact forms\n* Social media integration\n* Basic hosting setup\n* Price: Starting from 500 DT\n\nWe also offer e-commerce solutions and maintenance packages.";
    }
    
    // Website Usage Questions
    if (message.includes('buy') || message.includes('purchase') || message.includes('order') || message.includes('cart')) {
        return "To make a purchase:\n1. Browse our store and click 'Add to Cart'\n2. Review your cart by clicking the cart icon\n3. Proceed to payment page\n4. Enter your payment information\n5. Confirm order\n\nYour order will be processed immediately and you'll receive confirmation.";
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('card')) {
        return "We accept secure payments via:\n* Credit/Debit Cards (Visa, MasterCard)\n* Bank Transfers\n* Mobile Payment (if available in your region)\n\nAll payments are encrypted and secure. We don't store your card details.";
    }
    
    if (message.includes('account') || message.includes('profile') || message.includes('dashboard')) {
        return "Your account dashboard allows you to:\n* View and edit profile information\n* See order history\n* Track current orders\n* Manage favorite products\n* Update payment methods\n\nAccess it by clicking 'Profile' in the navigation menu.";
    }
    
    if (message.includes('favorite') || message.includes('save') || message.includes('wishlist')) {
        return "To save products to favorites:\n1. Click the heart icon on any product\n2. View all favorites in your profile\n3. Add favorite items directly to cart\n\nYour favorites are saved across sessions.";
    }
    
    // Business Information
    if (message.includes('contact') || message.includes('support') || message.includes('help')) {
        return "Contact our support team:\n📧 Email: support@goldenservices.com\n📞 Phone: +216 12 345 678\n⏰ Hours: Mon-Fri, 9AM-6PM\n📍 Location: Tunis, Tunisia\n\nFor urgent issues, please call us directly.";
    }
    
    if (message.includes('about') || message.includes('business') || message.includes('company')) {
        return "Golden Services is a digital marketplace connecting talented creators with clients since 2025.\n\nOur mission: Transform ideas into reality by providing a platform for quality digital services.\n\nWe specialize in graphic design, web development, digital marketing, and content creation.";
    }
    
    if (message.includes('freelancer') || message.includes('sell') || message.includes('creator')) {
        return "Want to sell your services?\n1. Create a freelancer account\n2. Complete your profile\n3. Submit your portfolio\n4. Get verified\n5. Start accepting orders\n\nWe take 10% commission on completed projects. Contact us for partnership details.";
    }
    
    if (message.includes('delivery') || message.includes('time') || message.includes('duration')) {
        return "Delivery times vary by service:\n* Logo Design: 5-7 business days\n* Website: 10-15 business days\n* Graphics: 3-5 business days\n* Writing: 2-4 business days\n\nYou'll receive regular updates and can request revisions upon delivery.";
    }
    
    if (message.includes('refund') || message.includes('cancel') || message.includes('return')) {
        return "Our refund policy:\n* Full refund within 24 hours if work hasn't started\n* 50% refund if work is in progress\n* No refund after final delivery\n* Revisions are included in all packages\n\nContact support for cancellation requests.";
    }
    
    if (message.includes('security') || message.includes('safe') || message.includes('privacy')) {
        return "We prioritize your security:\n* SSL encrypted website\n* Secure payment processing\n* GDPR compliant data handling\n* No sharing of personal information\n* Secure file transfers\n\nYour data is protected with industry-standard security measures.";
    }
    
    // General questions
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! 👋 How can I help you today? Feel free to ask about our services, how to use the website, or any business inquiries.";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
        return "You're welcome! 😊 If you have any more questions, I'm here to help. Have a great day!";
    }
    
    if (message.includes('hour') || message.includes('open')) {
        return "Our support hours:\n* Monday-Friday: 9:00 AM - 6:00 PM\n* Saturday: 10:00 AM - 2:00 PM\n* Sunday: Closed\n\nOrders can be placed 24/7 through our website.";
    }
    
    // Default response
    return "I'm not sure about that specific question. Here are some things I can help with:\n* Information about our services\n* How to make a purchase\n* Account and profile questions\n* Delivery and pricing information\n* Contacting support\n\nCould you rephrase your question or ask about one of these topics?";
}