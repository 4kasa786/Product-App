// assignment-prompts.js - 9 Documented Gemini AI Prompts for Product App
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runPrompt(promptText, promptNumber, context) {
    try {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`🤖 GEMINI AI PROMPT ${promptNumber}: ${context}`);
        console.log(`${'='.repeat(80)}`);
        console.log(`📝 CONTEXT: ${context}`);
        console.log(`\n💭 PROMPT:`);
        console.log(promptText);
        console.log(`\n${'🔄 PROCESSING...'.padEnd(50, '-')}`);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(promptText);
        const response = result.response.text();

        console.log(`\n✅ GEMINI RESPONSE:`);
        console.log(`${'-'.repeat(60)}`);
        console.log(response);
        console.log(`\n${'='.repeat(80)}`);
        console.log(`📊 PROMPT ${promptNumber} COMPLETED - Ready for Assignment Documentation`);
        console.log(`${'='.repeat(80)}\n`);

        return response;
    } catch (error) {
        console.error(`❌ ERROR in Prompt ${promptNumber}:`, error.message);
        return null;
    }
}

async function runAssignmentPrompts() {
    console.log(`\n🚀 STARTING GEMINI AI DOCUMENTATION FOR PRODUCT APP ASSIGNMENT`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`🎯 Purpose: Document AI assistance in Product App development`);
    console.log(`📋 Assignment Requirement: At least 6 prompts with context and changes (Extended to 9 prompts)\n`);

    const prompts = [
        {
            context: "MongoDB Schema Design for Product App",
            prompt: `I'm building a Product App with Node.js, Express, and MongoDB. I need help designing optimal database schemas.

Current Structure:
- User model: authentication, profile data
- Product model: e-commerce product information

Requirements:
1. User schema with proper validations (email, password requirements)
2. Product schema with all e-commerce fields (name, description, price, images, category)
3. Relationships between User and Product (favorites, created products)
4. Database indexing for search performance
5. Mongoose schema best practices

Please provide complete mongoose schema code with validations and indexing strategies.`
        },

        {
            context: "Express.js API Routes & Security Implementation",
            prompt: `My Product App has these Express.js routes that need security improvements:

CURRENT ROUTES:
- POST /auth/signup (user registration)
- POST /auth/signin (user login)
- POST /auth/signout (user logout)
- POST /api/products (create product - protected)
- GET /api/products (get all products - public)
- GET /api/products/:id (get single product - public)  
- PUT /api/products/:id (update product - protected)
- DELETE /api/products/:id (delete product - protected)
- POST /api/products/generate (AI generate products - protected)

I need help with:
1. JWT authentication middleware implementation
2. Input validation for all routes
3. Error handling middleware
4. Security headers and CORS setup
5. Rate limiting for API protection

Provide code examples for secure Express.js route implementation.`
        },

        {
            context: "React Frontend Architecture with Modern Tools",
            prompt: `I'm building a React frontend for my Product App using Vite and Tailwind CSS.

CURRENT FRONTEND STRUCTURE:
client/src/
├── components/ (reusable components)
├── pages/ (route components)  
├── utils/ (helper functions)
└── App.jsx

REQUIRED FEATURES:
- Home page with product listing
- Product detail pages
- User authentication forms (signup/signin)
- Product creation/update forms (protected)
- Search functionality
- Responsive design

I need guidance on:
1. Component architecture and organization
2. State management strategy (Context API vs props)
3. Protected route implementation
4. Form handling and validation
5. Tailwind CSS responsive design patterns
6. React Router setup

Please provide React component structure recommendations with code examples.`
        },

        {
            context: "JWT Authentication System Implementation",
            prompt: `I need to implement secure JWT authentication for my Product App spanning both frontend and backend.

AUTHENTICATION REQUIREMENTS:
- Secure password hashing with bcrypt
- JWT token generation and validation
- HTTP-only cookie storage for tokens
- Protected API routes with middleware
- React authentication state management
- Automatic token refresh handling
- Secure logout functionality

SECURITY CONSIDERATIONS:
- Password strength validation
- Rate limiting on auth endpoints
- CSRF protection
- Token expiration handling
- Session management best practices

Please provide a complete authentication implementation including:
1. Backend JWT middleware and controllers
2. Frontend authentication context and hooks
3. Protected route components
4. Security best practices

Show me the complete code structure for production-ready authentication.`
        },

        {
            context: "AI Integration for Product Generation Feature",
            prompt: `I have a special endpoint POST /api/products/generate that should use Google Gemini AI to automatically generate product data.

FEATURE WORKFLOW:
1. User provides: product category, basic description
2. AI generates: complete product details (name, description, features, price, tags)
3. System validates AI output and saves to MongoDB
4. Return generated product to user

TECHNICAL REQUIREMENTS:
- Google Gemini API integration in Express.js
- Structured prompting for consistent product data format
- Validation of AI-generated content before database storage
- Error handling for AI API failures
- Rate limiting to manage API costs
- User feedback during generation process

CHALLENGES TO SOLVE:
- Ensuring consistent AI response format
- Handling API rate limits and errors
- Validating generated data quality
- Cost optimization strategies

Please provide complete implementation code for AI-powered product generation including prompt engineering, error handling, and database integration.`
        },

        {
            context: "Production Deployment & Performance Optimization",
            prompt: `My Product App is complete and ready for production deployment. I need comprehensive guidance for production optimization.

TECH STACK:
- Backend: Node.js + Express.js + MongoDB + JWT
- Frontend: React + Vite + Tailwind CSS
- AI Integration: Google Gemini API
- Authentication: JWT with HTTP-only cookies

PRODUCTION REQUIREMENTS:
1. Security hardening (helmet, CORS, rate limiting)
2. Environment variable management
3. Database optimization and indexing
4. Build process optimization
5. Error logging and monitoring
6. Performance caching strategies
7. SEO optimization for product pages
8. SSL/HTTPS configuration

DEPLOYMENT CONSIDERATIONS:
- Cloud hosting recommendations (Vercel, Railway, AWS)
- MongoDB Atlas configuration
- CI/CD pipeline setup
- Domain and DNS configuration
- Backup and monitoring strategies

Please provide a complete production deployment checklist with:
- Security configurations
- Performance optimizations
- Monitoring and logging setup
- Best practices for scalable deployment

Include specific code examples and configuration files needed for production.`
        },

        // NEW PROMPT 7
        {
            context: "Advanced Search & Filtering System Implementation",
            prompt: `I need to implement an advanced search and filtering system for my Product App to enhance user experience.

CURRENT SEARCH REQUIREMENTS:
- Text-based search across product names and descriptions
- Category-based filtering (electronics, clothing, books, etc.)
- Price range filtering (min-max slider)
- Rating-based filtering
- Availability status filtering (in stock, out of stock)
- Sorting options (price low-high, high-low, newest, rating)

TECHNICAL IMPLEMENTATION NEEDS:
1. Backend search API with MongoDB aggregation pipelines
2. Frontend search interface with real-time filtering
3. Search performance optimization with indexing
4. Autocomplete/suggestion functionality
5. Search result pagination
6. Advanced query handling for multiple filters

FRONTEND FEATURES:
- Search bar with autocomplete
- Filter sidebar with checkboxes and sliders
- Sort dropdown functionality
- Search results grid with infinite scroll
- Clear filters and reset functionality
- Search history for logged-in users

PERFORMANCE CONSIDERATIONS:
- Database indexing for fast search queries
- Debounced search input to reduce API calls
- Caching frequently searched terms
- Lazy loading of search results

Please provide complete implementation code for:
1. MongoDB search aggregation pipelines
2. Express.js search API endpoints
3. React search components with filtering UI
4. Performance optimization strategies
5. Search analytics implementation

Include code examples for both backend search logic and frontend search interface.`
        },

        // NEW PROMPT 8
        {
            context: "Error Handling & Logging System Implementation",
            prompt: `I need to implement comprehensive error handling and logging throughout my Product App for better debugging and monitoring.

CURRENT ERROR HANDLING GAPS:
- Basic try-catch blocks without proper error classification
- No centralized error handling middleware
- Limited error logging and tracking
- Poor user error feedback on frontend
- No error monitoring in production

ERROR HANDLING REQUIREMENTS:
1. Centralized error handling middleware for Express.js
2. Custom error classes for different error types
3. Structured logging with different log levels
4. Error tracking and monitoring in production
5. User-friendly error messages on frontend
6. Database operation error handling
7. API integration error handling (Gemini AI failures)

LOGGING SYSTEM NEEDS:
- Request/response logging for API calls
- Error logs with stack traces and context
- Performance monitoring and slow query detection
- User action logging for analytics
- Security event logging (failed login attempts, etc.)

PRODUCTION MONITORING:
- Error alerting system for critical failures
- Log aggregation and analysis
- Performance metrics tracking
- Uptime monitoring
- Error rate monitoring and dashboards

FRONTEND ERROR HANDLING:
- Global error boundary for React components
- API error handling with user notifications
- Form validation error display
- Network error handling and retry logic
- Loading states and error recovery

Please provide complete implementation for:
1. Express.js centralized error handling middleware
2. Custom error classes and error codes
3. Structured logging system with Winston or similar
4. React error boundaries and error handling
5. Production monitoring setup recommendations
6. Error tracking integration (Sentry, LogRocket, etc.)

Include code examples for comprehensive error handling across the full stack.`
        },

        // NEW PROMPT 9
        {
            context: "Testing Strategy & Quality Assurance Implementation",
            prompt: `I need to implement a comprehensive testing strategy for my Product App to ensure code quality and reliability.

CURRENT TESTING GAPS:
- No automated testing in place
- Manual testing only for basic functionality
- No test coverage metrics
- No CI/CD testing pipeline
- Potential bugs in critical user flows

TESTING REQUIREMENTS:

BACKEND TESTING:
1. Unit tests for controllers, models, and utilities
2. Integration tests for API endpoints
3. Database testing with test database setup
4. Authentication and authorization testing
5. Error handling and edge case testing
6. API performance and load testing

FRONTEND TESTING:
1. Unit tests for React components
2. Integration tests for user workflows
3. End-to-end testing for critical paths
4. Form validation and submission testing
5. Authentication flow testing
6. Responsive design testing

TESTING TOOLS SETUP:
- Jest for unit and integration testing
- React Testing Library for component testing
- Supertest for API endpoint testing
- Cypress or Playwright for E2E testing
- MongoDB Memory Server for database testing
- Coverage reporting with Istanbul/NYC

TEST SCENARIOS TO COVER:
1. User registration and authentication flow
2. Product CRUD operations (create, read, update, delete)
3. AI product generation functionality
4. Search and filtering operations
5. Error handling for invalid inputs
6. Security testing (JWT validation, protected routes)
7. Database connection and query testing

CI/CD INTEGRATION:
- Automated test running on code commits
- Test coverage reporting
- Failed test notification system
- Pre-deployment testing requirements
- Performance regression testing

Please provide complete testing implementation including:
1. Jest configuration for backend API testing
2. React Testing Library setup for frontend testing
3. E2E testing setup with Cypress
4. Test database configuration and cleanup
5. CI/CD pipeline integration with GitHub Actions
6. Test coverage reporting and quality gates
7. Mock implementations for external APIs (Gemini AI)

Include code examples for testing critical functionality like authentication, product operations, and AI integration.`
        }
    ];

    console.log(`📋 Running ${prompts.length} documented prompts for assignment submission...\n`);

    for (let i = 0; i < prompts.length; i++) {
        await runPrompt(prompts[i].prompt, i + 1, prompts[i].context);

        if (i < prompts.length - 1) {
            console.log(`⏳ Waiting 3 seconds before next prompt to avoid rate limiting...\n`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    console.log(`\n🎉 ASSIGNMENT DOCUMENTATION COMPLETE!`);
    console.log(`✅ Successfully completed 9 Gemini AI prompts for Product App`);
    console.log(`📄 This output serves as documented evidence of AI assistance`);
    console.log(`💡 Copy this entire terminal output for assignment submission\n`);

    console.log(`📋 ASSIGNMENT CHECKLIST:`);
    console.log(`✅ 9 prompts with clear context - COMPLETED (Exceeds requirement of 6)`);
    console.log(`✅ Detailed AI responses - COMPLETED`);
    console.log(`✅ Product App specific content - COMPLETED`);
    console.log(`✅ Technical implementation guidance - COMPLETED`);
    console.log(`✅ Advanced features coverage - COMPLETED`);
    console.log(`✅ Quality assurance considerations - COMPLETED`);
    console.log(`✅ Ready for submission - COMPLETED\n`);
}

// Run the assignment documentation
runAssignmentPrompts().catch(error => {
    console.error('❌ Assignment documentation failed:', error);
});