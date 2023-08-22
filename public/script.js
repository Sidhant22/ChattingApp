// Emoji mapping
const emojis = {
    smile: '😄',
    heart: '❤️',
    thumbs_up: '👍',
    hey: '👋',
    please: '🙏'
    
};

const socket = io();

const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');



// New:

const suggestionContainer = document.getElementById('suggestion-container');
const suggestion = document.getElementById('suggestion');
const acceptSuggestionButton = document.getElementById('accept-suggestion');

// Listen for input events on the message input field
messageInput.addEventListener('input', () => {
    const message = messageInput.value;
    const emojiSuggestion = suggestEmoji(message);

    if (emojiSuggestion) {
        suggestion.textContent = `Did you mean: ${emojis[emojiSuggestion]} ?`;
        suggestionContainer.style.display = 'block';
    } else {
        suggestionContainer.style.display = 'none';
    }
});

// Handle "Use Emoji" button click
acceptSuggestionButton.addEventListener('click', () => {
    const emojiSuggestion = suggestEmoji(messageInput.value);
    if (emojiSuggestion) {
        const emoji = emojis[emojiSuggestion];
        messageInput.value += emoji;
        suggestionContainer.style.display = 'none';
    }
});

// Function to suggest an emoji based on keyword
function suggestEmoji(message) {
    const emojiKeywords = Object.keys(emojis);
    const words = message.split(' ');
    
    for (const word of words) {
        if (emojiKeywords.includes(word)) {
            return word;
        }
    }
    return null;
}


// Listen for "keydown" event on the message input field
messageInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent Enter from creating a new line
        sendMessage();
    }
});

// Handle sending messages including slash commands
sendButton.addEventListener('click', sendMessage);

// Function to send a message
function sendMessage() {
    const message = messageInput.value.trim();

    if (message.startsWith('/clear')) {
        chatMessages.innerHTML = ''; // Clear chat window
    } else if (message.startsWith('/random')) {
        if (message === '/random') {
            const randomNumber = Math.floor(Math.random() * 100); // Generate a random number
            const randomMessage = `The random number generated is '${randomNumber}' for this window.`;
            const messageElement = createMessageElement(randomMessage);
            chatMessages.appendChild(messageElement);
        }
    } else if (message !== '') {
        socket.emit('message', message);
    }

    messageInput.value = ''; // Clear the input field
}




//Old
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.emit('message', message);
        messageInput.value = '';
    }
});

socket.on('message', message => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    // Check for emoji keywords
    const emojiRegex = /:([a-z_]+):/g;
    const emojiMessage = message.replace(emojiRegex, (_, emojiName) => {
        // Replace with actual emoji if exists, or return the original text
        return emojiName in emojis ? emojis[emojiName] : `:${emojiName}:`;
    });

    // Create a new span element for the message (including emojis)
    const messageSpan = document.createElement('span');
    messageSpan.innerHTML = emojiMessage;

    // Append the message span to the message element
    messageElement.appendChild(messageSpan);
    
    chatMessages.appendChild(messageElement);
    
    scrollToBottom(); // Scroll chat messages to bottom
});







// Scroll chat messages to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    return messageElement;
}
