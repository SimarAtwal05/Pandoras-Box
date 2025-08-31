document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const carouselSlides = document.querySelectorAll('.slides .slide');
    let conversationState = {};
    let currentSlide = 0;

    // Carousel logic
    if (carouselSlides.length > 0) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % carouselSlides.length;
            document.querySelector('.slides').style.transform = `translateX(-${currentSlide * 100}%)`;
        }, 4000);
    }

    // Function to toggle the chatbot visibility
    window.toggleChatbot = function() {
        const isHidden = chatbotContainer.classList.contains('hidden');
        if (isHidden) {
            chatbotContainer.classList.remove('hidden');
            chatbotToggleBtn.classList.add('hidden');
            sendMessage("start");
        } else {
            chatbotContainer.classList.add('hidden');
            chatbotToggleBtn.classList.remove('hidden');
            conversationState = {}; // Reset conversation on close
        }
    }
    
    // Function to display a message in the chat
    function displayMessage(text, sender, options = []) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
        messageElement.innerText = text;
        chatMessages.appendChild(messageElement);

        if (options.length > 0) {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('message-options');
            options.forEach(option => {
                const button = document.createElement('button');
                button.innerText = option;
                button.addEventListener('click', () => {
                    displayMessage(option, 'user');
                    sendMessage(option);
                });
                optionsContainer.appendChild(button);
            });
            chatMessages.appendChild(optionsContainer);
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to handle sending a message to the backend
    window.sendMessage = async function(message = null) {
        const userText = message || userInput.value.trim();
        if (!userText && message !== "start") return;

        if (message !== "start") {
            displayMessage(userText, 'user');
        }
        userInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userText, state: conversationState }),
            });

            const data = await response.json();
            
            conversationState = data.state;
            displayMessage(data.reply, 'bot', data.options);

            if (data.redirect) {
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1000);
            }

        } catch (error) {
            console.error("Error communicating with chatbot:", error);
            displayMessage("Sorry, I'm having trouble connecting. Please try again later.", 'bot');
        }
    }
    
    chatbotToggleBtn.addEventListener('click', () => {
        toggleChatbot();
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
