import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { AIChatInput } from "@/components/ui/ai-chat-input";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useOpenAI } from "@/hooks/useOpenAI";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  currentChatId: string;
}

const ChatInterface = ({ currentChatId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state: sidebarState } = useSidebar();
  
  const { 
    generateStreamResponse, 
    isLoading, 
    error, 
    clearError,
    clearConversation 
  } = useOpenAI({ 
    conversationId: currentChatId,
    userName: "User",
    streaming: true 
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingMessage]);

  // Reset messages when chat changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${currentChatId}`,
        text: "Hello! I'm your AI assistant powered by OpenAI. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
    setStreamingMessage("");
    setCurrentStreamingId(null);
    clearError();
  }, [currentChatId, clearError]);

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    setStreamingMessage("");
    const streamingId = Date.now().toString() + "-ai-streaming";
    setCurrentStreamingId(streamingId);
    
    try {
      let fullResponse = "";
      
      await generateStreamResponse(userMessage, (chunk: string) => {
        fullResponse += chunk;
        setStreamingMessage(fullResponse);
      });
      
      // Add the complete message to the messages array
      const aiMessage: Message = {
        id: streamingId,
        text: fullResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessage("");
      setCurrentStreamingId(null);
      setIsTyping(false);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsTyping(false);
      setStreamingMessage("");
      setCurrentStreamingId(null);
    }
  };

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    handleAIResponse(text);
  };

  const handleRetry = () => {
    clearError();
  };

  const handleClearConversation = () => {
    clearConversation();
    setMessages([
      {
        id: `welcome-${currentChatId}-new`,
        text: "Hello! I'm your AI assistant powered by OpenAI. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Error Alert */}
      {error && (
        <div className="px-4 md:px-8 pt-4">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="ml-2"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0 px-4 md:px-8 py-6 pb-32">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
          </AnimatePresence>
          
          {/* Streaming Message */}
          {currentStreamingId && streamingMessage && (
            <ChatBubble
              key={currentStreamingId}
              message={streamingMessage}
              isUser={false}
              timestamp={new Date()}
              isStreaming={true}
            />
          )}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && !streamingMessage && (
              <ChatBubble
                message=""
                isUser={false}
                isTyping={true}
              />
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        className={`fixed bottom-6 z-30 pointer-events-none transition-all duration-200 ease-linear ${
          sidebarState === "expanded" 
            ? "left-80 right-6" 
            : sidebarState === "collapsed" 
            ? "left-16 right-6" 
            : "left-6 right-6"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="pointer-events-auto w-full max-w-4xl mx-auto">
          <AIChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading}
            onClearConversation={handleClearConversation}
          />
        </div>
      </motion.div>
    </div>
  );
};

export { ChatInterface };