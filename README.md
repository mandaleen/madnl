# Welcome to your Lovable project

## AI Chat Assistant with OpenAI Integration

A production-ready AI chat application built with React, TypeScript, and OpenAI API integration featuring real-time streaming responses, conversation memory, and a modern glass-morphism UI.

### Features

- 🤖 **OpenAI Integration**: Powered by GPT-4o-mini with streaming responses
- 💬 **Real-time Chat**: Streaming responses with typing indicators
- 🧠 **Memory Management**: Conversation context and history preservation
- 🎨 **Modern UI**: Glass-morphism design with dark/light theme support
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Performance Optimized**: Efficient token usage and error handling
- 🔒 **Error Boundaries**: Robust error handling and recovery
- 🎯 **Production Ready**: Environment configuration and validation

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_MODEL=gpt-4o-mini
   VITE_OPENAI_MAX_TOKENS=2000
   VITE_OPENAI_TEMPERATURE=0.7
   ```

3. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_OPENAI_API_KEY` | - | Your OpenAI API key (required) |
| `VITE_OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `VITE_OPENAI_MAX_TOKENS` | `2000` | Maximum tokens per response |
| `VITE_OPENAI_TEMPERATURE` | `0.7` | Response creativity (0-2) |

### Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: React hooks + Context
- **AI Integration**: OpenAI API with streaming
- **Animations**: Framer Motion
- **Theme**: next-themes for dark/light mode

### Key Components

- `OpenAIService`: Handles API communication and conversation memory
- `ChatInterface`: Main chat UI with streaming support
- `AIChatInput`: Advanced input with placeholder animations
- `ChatBubble`: Message display with typing indicators
- `ErrorBoundary`: Application-wide error handling

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   Ensure all required environment variables are set in your deployment platform

3. **Security Considerations**
   - API keys are exposed in the browser (for demo purposes)
   - For production, implement a backend proxy to secure API keys
   - Consider rate limiting and user authentication

## Project info

**URL**: https://lovable.dev/projects/12660796-ec9d-4b7e-b779-d83f3844aef4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/12660796-ec9d-4b7e-b779-d83f3844aef4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/12660796-ec9d-4b7e-b779-d83f3844aef4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
