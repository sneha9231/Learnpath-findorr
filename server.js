require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Groq } = require('groq-sdk');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq client using your GROQ_API_KEY
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, mode } = req.body;
    // Generate system prompt based on mode
    const systemPrompt = getSystemPrompt(mode);
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// /api/explainer endpoint
app.post('/api/explainer', async (req, res) => {
  try {
    const { concept } = req.body;
    
    const systemPrompt = `You are an expert educational explainer. Create an engaging, visual, and interactive explanation of the given concept.
Break it down into intuitive parts. Use analogies, examples, and step-by-step explanations. Format your response using markdown.
Make it feel like an interactive Khan Academy style lesson.`;
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create an engaging explainer for: ${concept}` }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('Error in explainer API:', error);
    res.status(500).json({ error: 'Failed to create explainer' });
  }
});

// /api/mentor endpoint
app.post('/api/mentor', async (req, res) => {
  try {
    const { question } = req.body;
    
    const systemPrompt = `You are an expert mentor in all subjects. Provide personalized, detailed, and actionable guidance.
Be supportive but also challenging. Ask thoughtful questions to deepen understanding. Provide specific resources and next steps.
Format your response in a conversational, supportive tone.`;
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('Error in mentor API:', error);
    res.status(500).json({ error: 'Failed to connect with mentor' });
  }
});

// /api/evaluation endpoint
app.post('/api/evaluation', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    const systemPrompt = `You are an expert test creator. Create a comprehensive test on the given topic at the ${difficulty} level.
Include a mix of multiple-choice, short answer, and problem-solving questions. Provide detailed explanations for each correct answer.
Format the test with clear question numbering, difficulty indicators, and scoring guidance.`;
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a ${difficulty} level test for: ${topic}` }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('Error in evaluation API:', error);
    res.status(500).json({ error: 'Failed to create evaluation' });
  }
});

// /api/schedule endpoint
app.post('/api/schedule', async (req, res) => {
  try {
    const { learningPlan, hoursPerWeek, startDate, preferredDays } = req.body;
    
    const systemPrompt = `You are an expert learning planner. Create a detailed schedule based on the following learning plan:
"${learningPlan}"

The user can dedicate ${hoursPerWeek} hours per week, starting from ${startDate}, and prefers to learn on these days: ${preferredDays.join(', ')}.

Create a week-by-week schedule with specific topics, estimated time commitments, and milestone goals. Format your response as HTML with appropriate classes for styling.`;
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Create a personalized learning schedule." }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    const schedule = completion.choices[0].message.content;
    res.json({ schedule });
  } catch (error) {
    console.error('Error in schedule API:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Helper function to generate system prompts based on mode
function getSystemPrompt(mode) {
  switch (mode) {
    case 'course':
      return `You are LearnPath, an expert AI learning assistant specializing in creating personalized course plans.
      
When given a topic or learning goal:
1. Create a detailed and structured learning path
2. Break the course into logical modules with clear learning objectives
3. For each module, provide specific sub-topics, recommended resources (books, courses, videos, websites), and exercises
4. Include a mix of theoretical knowledge and practical application
5. Add estimated time commitments for each module
6. Format your response in markdown for readability
7. Include a comparison table of popular resources when relevant

Your goal is to create a comprehensive, actionable learning plan that guides the user from their current knowledge level to mastery.`;
      
    case 'examination':
      return `You are LearnPath, an expert AI learning assistant specializing in examination preparation.
      
When given an exam or certification to prepare for:
1. Create a detailed study plan with clear milestones
2. Break down the exam syllabus into manageable topics
3. Provide specific study strategies, resources, and practice methods for each topic
4. Include tips for time management and test-taking strategies
5. Suggest practice tests and self-assessment methods
6. Format your response in markdown for readability

Your goal is to create a comprehensive, time-efficient study plan that maximizes the user's chances of success.`;
      
    case 'jd':
      return `You are LearnPath, an expert AI learning assistant specializing in career skill development.
      
When given a job description or career goal:
1. Analyze the key skills and competencies required
2. Create a detailed skill development plan
3. Break down each skill into learning objectives with recommended resources
4. Suggest projects and activities to demonstrate these skills
5. Include tips for networking and interview preparation
6. Format your response in markdown for readability

Your goal is to create a comprehensive plan that helps the user develop the skills needed for their target job or career.`;
      
    case 'business':
      return `You are LearnPath, an expert AI learning assistant specializing in business education.
      
When given a business concept or entrepreneurial goal:
1. Create a comprehensive learning framework covering all aspects of the business
2. Include key business concepts, models, and strategies
3. Provide market analysis and competitive landscape insights
4. Suggest relevant case studies and examples
5. Include resource recommendations for deeper learning
6. Format your response in markdown for readability

Your goal is to provide a comprehensive business education plan that helps the user understand and apply business principles effectively.`;
      
    case 'query':
    default:
      return `You are LearnPath, a helpful AI learning assistant with expertise across various fields.
      
When answering queries:
1. Provide clear, accurate, and comprehensive information
2. Include relevant background context when helpful
3. Cite sources or recommend further reading when appropriate
4. Use examples to illustrate complex concepts
5. Format your response in markdown for readability

Your goal is to provide helpful, educational responses that expand the user's understanding.`;
  }
}

// Test endpoint (GET)
app.get('/api/test', (req, res) => {
  const key = process.env.GROQ_API_KEY;
  res.json({
    keyPresent: !!key,
    keyLength: key ? key.length : 0,
    message: 'API test endpoint is working'
  });
});

// Serve the main HTML file for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// For local development: start the server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel serverless functions
module.exports = app;
