import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes - in production, use a backend
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ConversationMemory {
  messages: ChatMessage[];
  context: {
    userName?: string;
    preferences?: Record<string, any>;
    conversationSummary?: string;
  };
}

export class OpenAIService {
  private static instance: OpenAIService;
  private conversations: Map<string, ConversationMemory> = new Map();
  
  private readonly systemInstructions = `You are a helpful, knowledgeable, and friendly AI assistant. Your goal is to provide accurate, helpful, and engaging responses to users.

Key guidelines:
- Be conversational and personable while maintaining professionalism
- Provide detailed, accurate information when requested
- Ask clarifying questions when needed
- Remember context from the conversation
- Be creative and helpful in problem-solving
- If you don't know something, admit it honestly
- Keep responses concise but comprehensive
- Use markdown formatting when appropriate for better readability

Remember previous messages in this conversation to maintain context and provide personalized responses.`;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async generateResponse(
    message: string, 
    conversationId: string,
    userName?: string
  ): Promise<string> {
    try {
      // Get or create conversation memory
      let memory = this.conversations.get(conversationId);
      if (!memory) {
        memory = {
          messages: [{ role: 'system', content: this.systemInstructions }],
          context: { userName }
        };
        this.conversations.set(conversationId, memory);
      }

      // Add user message to memory
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      memory.messages.push(userMessage);

      // Prepare messages for OpenAI (limit to last 20 messages to manage token usage)
      const recentMessages = memory.messages.slice(-20).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
        messages: recentMessages as any,
        max_tokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '2000'),
        temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7'),
        stream: false,
      });

      const assistantResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

      // Add assistant response to memory
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      memory.messages.push(assistantMessage);

      // Update conversation memory
      this.conversations.set(conversationId, memory);

      return assistantResponse;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return 'I apologize, but there seems to be an issue with the API configuration. Please check that the OpenAI API key is properly set.';
        }
        if (error.message.includes('rate limit')) {
          return 'I apologize, but I\'m currently experiencing high demand. Please try again in a moment.';
        }
        if (error.message.includes('quota')) {
          return 'I apologize, but the API quota has been exceeded. Please try again later.';
        }
      }
      
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }

  public async generateStreamResponse(
    message: string,
    conversationId: string,
    onChunk: (chunk: string) => void,
    userName?: string
  ): Promise<void> {
    try {
      // Get or create conversation memory
      let memory = this.conversations.get(conversationId);
      if (!memory) {
        memory = {
          messages: [{ role: 'system', content: this.systemInstructions }],
          context: { userName }
        };
        this.conversations.set(conversationId, memory);
      }

      // Add user message to memory
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      memory.messages.push(userMessage);

      // Prepare messages for OpenAI
      const recentMessages = memory.messages.slice(-20).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call OpenAI API with streaming
      const stream = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
        messages: recentMessages as any,
        max_tokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '2000'),
        temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7'),
        stream: true,
      });

      let fullResponse = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk(content);
        }
      }

      // Add complete assistant response to memory
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date()
      };
      memory.messages.push(assistantMessage);

      // Update conversation memory
      this.conversations.set(conversationId, memory);

    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      onChunk('I apologize, but I encountered an error while processing your request. Please try again.');
    }
  }

  public getConversationHistory(conversationId: string): ChatMessage[] {
    const memory = this.conversations.get(conversationId);
    return memory?.messages.filter(msg => msg.role !== 'system') || [];
  }

  public clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  public updateSystemInstructions(conversationId: string, instructions: string): void {
    const memory = this.conversations.get(conversationId);
    if (memory) {
      memory.messages[0] = { role: 'system', content: instructions };
      this.conversations.set(conversationId, memory);
    }
  }

  public setUserContext(conversationId: string, context: Record<string, any>): void {
    const memory = this.conversations.get(conversationId);
    if (memory) {
      memory.context = { ...memory.context, ...context };
      this.conversations.set(conversationId, memory);
    }
  }
}

export const openAIService = OpenAIService.getInstance();