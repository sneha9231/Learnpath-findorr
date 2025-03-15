document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const currentModeSpan = document.getElementById('current-mode');
    const specialFeatures = document.querySelectorAll('.feature-item');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');
    const scheduleBtn = document.getElementById('schedule-btn');
    
    // State variables
    let currentMode = 'course';
    let featuresUsage = {
        'explainer-feature': 5,
        'mentor-feature': 3,
        'evaluation-feature': 5
    };
    let learningPlan = null;
    
    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        // Handle markdown formatting
        if (!isUser) {
            const formattedMessage = formatMessage(message);
            contentDiv.innerHTML = formattedMessage;
        } else {
            const p = document.createElement('p');
            p.textContent = message;
            contentDiv.appendChild(p);
        }
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Simple markdown formatter (handles basic formatting)
    function formatMessage(text) {
        // Handle bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italics
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle links
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Handle line breaks
        text = text.replace(/\n/g, '<br>');
        
        // Handle headers
        text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
        
        // Handle lists
        text = text.replace(/^- (.*?)$/gm, '<li>$1</li>');
        
        // Wrap adjacent list items in ul
        text = text.replace(/(<li>.*?<\/li>)([\s]*)?(?=<li>)/g, '$1');
        text = text.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
        
        return text;
    }
    
    // Function to send user message and get AI response
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input
        userInput.value = '';
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot');
        const typingContent = document.createElement('div');
        typingContent.classList.add('message-content');
        typingContent.innerHTML = '<p>Typing<span class="typing-dots">...</span></p>';
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        
        try {
            // Make API request
            const response = await fetchAIResponse(message, currentMode);
            
            // Remove typing indicator
            chatMessages.removeChild(typingDiv);
            
            // Add AI response to chat
            addMessage(response);
            
            // Enable schedule button if learning plan was created
            if (currentMode === 'course' && response.includes('Module') || response.includes('Week')) {
                scheduleBtn.disabled = false;
                learningPlan = response;
            }
        } catch (error) {
            // Remove typing indicator
            chatMessages.removeChild(typingDiv);
            
            // Show error message
            addMessage("Sorry, I encountered an error. Please try again later.");
            console.error("Error:", error);
        }
    }
    
    // Function to make API request
    async function fetchAIResponse(message, mode) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    mode: mode
                })
            });
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
    
    // Handle special features
    function handleSpecialFeature(featureId) {
        if (featuresUsage[featureId] <= 0) {
            alert("You've used all your credits for this feature. Please upgrade your plan for more.");
            return;
        }
        
        modalTitle.textContent = getFeatureTitle(featureId);
        modalBody.innerHTML = getFeatureContent(featureId);
        modal.style.display = 'block';
        
        // Setup form submission for the feature
        const form = modal.querySelector('form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Decrease usage count
                featuresUsage[featureId]--;
                document.querySelector(`#${featureId} .usage-counter`).textContent = `${featuresUsage[featureId]} uses left`;
                
                // Process form based on feature type
                if (featureId === 'explainer-feature') {
                    const concept = document.getElementById('concept').value;
                    processConceptExplainer(concept);
                } else if (featureId === 'mentor-feature') {
                    const question = document.getElementById('mentor-question').value;
                    processMentorQuestion(question);
                } else if (featureId === 'evaluation-feature') {
                    const topic = document.getElementById('evaluation-topic').value;
                    processEvaluation(topic);
                }
                
                // Close modal
                modal.style.display = 'none';
            });
        }
    }
    
    // Get feature title
    function getFeatureTitle(featureId) {
        switch (featureId) {
            case 'explainer-feature':
                return 'Concept Explainer';
            case 'mentor-feature':
                return '1:1 Mentorship Session';
            case 'evaluation-feature':
                return 'Test Simulator';
            default:
                return 'Feature';
        }
    }
    
    // Get feature content
    function getFeatureContent(featureId) {
        switch (featureId) {
            case 'explainer-feature':
                return `
                    <p>Transform a complex concept into an engaging explainer.</p>
                    <form class="explainer-form">
                        <div class="form-group">
                            <label for="concept">Enter the concept you want explained:</label>
                            <textarea id="concept" required placeholder="e.g., Blockchain technology, Machine Learning algorithms, etc."></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Create Explainer</button>
                    </form>
                `;
            case 'mentor-feature':
                return `
                    <p>Get personalized guidance from an AI mentor.</p>
                    <form class="mentor-form">
                        <div class="form-group">
                            <label for="mentor-question">What would you like help with?</label>
                            <textarea id="mentor-question" required placeholder="Describe your problem or question in detail..."></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Ask Mentor</button>
                    </form>
                `;
            case 'evaluation-feature':
                return `
                    <p>Test your knowledge with an automated evaluation.</p>
                    <form class="evaluation-form">
                        <div class="form-group">
                            <label for="evaluation-topic">What topic would you like to be tested on?</label>
                            <input type="text" id="evaluation-topic" required placeholder="e.g., JavaScript Fundamentals, Data Structures, etc.">
                        </div>
                        <div class="form-group">
                            <label for="difficulty">Difficulty Level:</label>
                            <select id="difficulty">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <button type="submit" class="submit-btn">Start Test</button>
                    </form>
                `;
            default:
                return '<p>Feature content not available.</p>';
        }
    }
    
    // Process concept explainer
    async function processConceptExplainer(concept) {
        addMessage(`I'm creating an engaging explainer for: ${concept}`);
        
        try {
            const response = await fetch('/api/explainer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ concept })
            });
            
            const data = await response.json();
            addMessage(data.response);
        } catch (error) {
            addMessage("Sorry, I couldn't create an explainer at this time. Please try again later.");
            console.error("Error:", error);
        }
    }
    
    // Process mentor question
    async function processMentorQuestion(question) {
        addMessage(`I'm connecting you with an AI mentor for your question about: ${question}`);
        
        try {
            const response = await fetch('/api/mentor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });
            
            const data = await response.json();
            addMessage(data.response);
        } catch (error) {
            addMessage("Sorry, I couldn't connect with a mentor at this time. Please try again later.");
            console.error("Error:", error);
        }
    }
    
    // Process evaluation
    async function processEvaluation(topic) {
        const difficulty = document.getElementById('difficulty').value;
        addMessage(`I'm creating a ${difficulty} level test for: ${topic}`);
        
        try {
            const response = await fetch('/api/evaluation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    topic,
                    difficulty
                })
            });
            
            const data = await response.json();
            addMessage(data.response);
        } catch (error) {
            addMessage("Sorry, I couldn't create a test at this time. Please try again later.");
            console.error("Error:", error);
        }
    }
    
    // Handle learning schedule
    function handleSchedule() {
        if (!learningPlan) return;
        
        modalTitle.textContent = 'Set Learning Schedule';
        modalBody.innerHTML = `
            <p>Create a personalized schedule for your learning plan.</p>
            <form id="schedule-form">
                <div class="form-group">
                    <label for="hours-per-week">How many hours can you dedicate per week?</label>
                    <input type="number" id="hours-per-week" min="1" max="40" value="10" required>
                </div>
                <div class="form-group">
                    <label for="start-date">When do you want to start?</label>
                    <input type="date" id="start-date" required>
                </div>
                <div class="form-group">
                    <label for="preferred-days">Preferred days for learning:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="day" value="Monday"> Monday</label>
                        <label><input type="checkbox" name="day" value="Tuesday"> Tuesday</label>
                        <label><input type="checkbox" name="day" value="Wednesday"> Wednesday</label>
                        <label><input type="checkbox" name="day" value="Thursday"> Thursday</label>
                        <label><input type="checkbox" name="day" value="Friday"> Friday</label>
                        <label><input type="checkbox" name="day" value="Saturday"> Saturday</label>
                        <label><input type="checkbox" name="day" value="Sunday"> Sunday</label>
                    </div>
                </div>
                <button type="submit" class="submit-btn">Create Schedule</button>
            </form>
        `;
        
        // Set default date to today
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        document.getElementById('start-date').value = dateString;
        
        // Handle schedule form submission
        const scheduleForm = document.getElementById('schedule-form');
        scheduleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const hoursPerWeek = document.getElementById('hours-per-week').value;
            const startDate = document.getElementById('start-date').value;
            const preferredDays = [];
            document.querySelectorAll('input[name="day"]:checked').forEach(function(checkbox) {
                preferredDays.push(checkbox.value);
            });
            
            if (preferredDays.length === 0) {
                alert("Please select at least one preferred day for learning.");
                return;
            }
            
            // Process schedule
            try {
                const response = await fetch('/api/schedule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        learningPlan,
                        hoursPerWeek,
                        startDate,
                        preferredDays
                    })
                });
                
                const data = await response.json();
                
                // Update schedule display
                const scheduleContent = document.querySelector('.schedule-content');
                scheduleContent.innerHTML = data.schedule;
                
                // Add message about schedule
                addMessage("I've created a personalized learning schedule for you. You can view it in the Schedule panel below the chat.");
                
                // Close modal
                modal.style.display = 'none';
            } catch (error) {
                alert("Sorry, I couldn't create a schedule at this time. Please try again later.");
                console.error("Error:", error);
            }
        });
        
        modal.style.display = 'block';
    }
    
    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Limit max height
        if (this.scrollHeight > 120) {
            this.style.height = '120px';
            this.style.overflowY = 'auto';
        } else {
            this.style.overflowY = 'hidden';
        }
    });
    
    // Mode selection
    modeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            modeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current mode
            currentMode = this.dataset.mode;
            currentModeSpan.textContent = this.textContent.trim();
            
            // Clear schedule if mode changes
            if (currentMode !== 'course') {
                document.querySelector('.schedule-content').innerHTML = '<p class="no-schedule">Your learning schedule will appear here once you\'ve started a course.</p>';
                scheduleBtn.disabled = true;
            }
        });
    });
    
    // Special features
    specialFeatures.forEach(function(feature) {
        feature.addEventListener('click', function() {
            handleSpecialFeature(this.id);
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Schedule button
    scheduleBtn.addEventListener('click', handleSchedule);
    
    // Initialize with today's date for the schedule form
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    if (document.getElementById('start-date')) {
        document.getElementById('start-date').value = dateString;
    }
});
