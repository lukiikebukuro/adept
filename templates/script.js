// Universal Soldier E-commerce Bot - JavaScript Frontend
class EcommerceBotUI {
    constructor() {
        this.cartCount = 0;
        this.chatInterface = document.getElementById('chat-interface');
        this.messagesContainer = document.getElementById('messages-container');
        this.buttonContainer = document.getElementById('button-container');
        this.textInputContainer = document.getElementById('text-input-container');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.cartCounter = document.getElementById('cart-counter');
        
        this.initializeEventListeners();
        this.startBot();
    }
    
    initializeEventListeners() {
        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', () => {
            this.resetSession();
        });
        
        // Send button
        this.sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.sendTextMessage();
        });
        
        // Enter key in input
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendTextMessage();
            }
        });
        
        // Modal close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
    }
    
    async startBot() {
        console.log('[DEBUG] Starting bot session');
        this.showLoading(true);
        
        try {
            const response = await fetch('/bot/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.reply) {
                this.displayBotMessage(data.reply);
            }
            
        } catch (error) {
            console.error('[ERROR] Failed to start bot:', error);
            this.showError('Nie udało się uruchomić bota. Odśwież stronę.');
        } finally {
            this.showLoading(false);
        }
    }
    
    displayBotMessage(reply) {
        if (!reply) return;
        
        this.removeTypingIndicator();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        
        let messageContent = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
        `;
        
        // Format message with bold support
        if (reply.text_message) {
            let formattedMessage = reply.text_message
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            messageContent += `<div class="message-text">${formattedMessage}</div>`;
        }
        
        // Add product card if present
        if (reply.product_image) {
            messageContent += `
                <div class="product-card">
                    <div class="product-image">${reply.product_image}</div>
                </div>
            `;
        }
        
        // Check if order was confirmed
        if (reply.order_confirmed) {
            this.cartCount = 0;
            this.updateCartCounter();
        }
        
        messageContent += '</div>';
        messageElement.innerHTML = messageContent;
        this.messagesContainer.appendChild(messageElement);
        
        // Display buttons
        if (reply.buttons && reply.buttons.length > 0) {
            this.displayButtons(reply.buttons);
        }
        
        // Handle input expectation
        if (reply.input_expected) {
            this.textInputContainer.style.display = 'block';
            this.buttonContainer.innerHTML = '';
            this.userInput.focus();} 
            } // Zamknięcie dla if (reply.input_expected)
} // Zamknięcie dla głównej funkcji obsługującej odpowiedź bota