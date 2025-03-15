# LearnPath - AI Learning Assistant

An AI-powered learning assistant that creates personalized educational experiences. LearnPath (also known as Findor) processes various types of inputs including courses, examinations, job descriptions, business plans, and queries to generate structured learning paths with curated resources and interactive elements.

## Features

- **Personalized Learning Paths**: Generate detailed course plans based on your specific learning goals and pace
- **Concept Explainer**: Transform complex concepts into engaging visual explanations with customizable detail levels
- **1:1 Mentorship**: Get personalized guidance and answers to specific questions as you progress through your learning journey
- **Test Simulator**: Create custom tests with detailed explanations and performance reports to track your understanding
- **Learning Schedule**: Integrate learning plans into your daily life with accountability features and adaptive scheduling

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI**: Groq API (llama-3.3-70b-versatile)
- **Deployment**: Vercel

## Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher) or yarn (v1.22.x or higher)
- Groq API key (sign up at https://console.groq.com to obtain one)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourorganization/learnpath.git
   cd learnpath
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```
   GROQ_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```

6. **Start the production server:**
   ```bash
   npm start
   # or
   yarn start
   ```

## Usage

### Creating a Learning Path

1. Navigate to the dashboard and click on "Create New Learning Path"
2. Enter your learning goal or upload a relevant document (job description, course syllabus, etc.)
3. Adjust the parameters for depth, time commitment, and focus areas
4. Click "Generate" to create your personalized learning path

### Interactive Features

- **Progress Tracking**: Mark lessons as complete and track your overall progress
- **Resource Library**: Access recommended readings, videos, and exercises
- **Community Forum**: Connect with other learners studying similar topics
- **AI Tutor**: Ask questions and receive detailed explanations on any concept

## API Documentation

### Authentication

All API requests require an authentication token in the header:

```
Authorization: Bearer YOUR_API_TOKEN
```

### Endpoints

#### Generate Learning Path

```
POST /api/learning-path
```

Request body:
```json
{
  "goal": "Learn JavaScript for web development",
  "timeframe": "3 months",
  "priorKnowledge": "Basic HTML and CSS",
  "focusAreas": ["Frontend", "React"]
}
```

#### Get User Progress

```
GET /api/users/:userId/progress
```

Response:
```json
{
  "userId": "user123",
  "completedModules": 12,
  "totalModules": 30,
  "lastActivity": "2025-03-12T15:30:00Z",
  "nextMilestone": "Complete React Fundamentals"
}
```

## Contributing

We welcome contributions to LearnPath! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Groq](https://groq.com) for providing the AI infrastructure
- [OpenAI](https://openai.com) for research inspiration
- All contributors and early adopters who have provided valuable feedback

## Contact

For support or inquiries, please contact us at support@learnpath.ai
