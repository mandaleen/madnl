// Configuration validation and defaults
export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '2000'),
    temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7'),
  },
  app: {
    name: 'AI Chat Assistant',
    version: '1.0.0',
  }
};

// Validation functions
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.openai.apiKey) {
    errors.push('VITE_OPENAI_API_KEY is required');
  }
  
  if (config.openai.maxTokens < 1 || config.openai.maxTokens > 4000) {
    errors.push('VITE_OPENAI_MAX_TOKENS must be between 1 and 4000');
  }
  
  if (config.openai.temperature < 0 || config.openai.temperature > 2) {
    errors.push('VITE_OPENAI_TEMPERATURE must be between 0 and 2');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;