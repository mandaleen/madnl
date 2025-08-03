import { useState, useCallback } from 'react';
import { openAIService } from '@/lib/openai';

export interface UseOpenAIOptions {
  conversationId: string;
  userName?: string;
  streaming?: boolean;
}

export interface UseOpenAIReturn {
  generateResponse: (message: string) => Promise<string>;
  generateStreamResponse: (message: string, onChunk: (chunk: string) => void) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  clearConversation: () => void;
}

export const useOpenAI = ({ 
  conversationId, 
  userName, 
  streaming = false 
}: UseOpenAIOptions): UseOpenAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await openAIService.generateResponse(message, conversationId, userName);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, userName]);

  const generateStreamResponse = useCallback(async (
    message: string, 
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await openAIService.generateStreamResponse(message, conversationId, onChunk, userName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, userName]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearConversation = useCallback(() => {
    openAIService.clearConversation(conversationId);
  }, [conversationId]);

  return {
    generateResponse,
    generateStreamResponse,
    isLoading,
    error,
    clearError,
    clearConversation,
  };
};