import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  className?: string;
}

export function AIAssistant({ className }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI assistant for Mastersolis Infotech. I can help you with information about our services, projects, careers, and more. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Tell me about your services",
        "What job openings do you have?",
        "Show me recent projects",
        "How can I contact you?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    // Simple keyword-based responses
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      response = "Mastersolis Infotech offers cutting-edge technology solutions including AI/ML development, cloud computing, mobile app development, web development, blockchain solutions, and IT consulting. We specialize in transforming businesses through innovative technology.";
      suggestions = ["View our services page", "Tell me about AI solutions", "What about cloud computing?", "Show me your portfolio"];
    } else if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('hiring')) {
      response = "We're always looking for talented individuals to join our team! We have openings in various departments including Engineering, Design, Product Management, and Sales. You can view all current openings on our careers page and apply directly through our application system.";
      suggestions = ["View job openings", "How do I apply?", "What benefits do you offer?", "Tell me about company culture"];
    } else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
      response = "We've successfully delivered 150+ projects for clients worldwide, ranging from AI-powered applications to enterprise cloud solutions. Our portfolio includes work in fintech, healthcare, e-commerce, and emerging technologies. Each project is tailored to meet specific client needs and business objectives.";
      suggestions = ["View our projects", "Tell me about a specific project", "What technologies do you use?", "How do you approach projects?"];
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('talk')) {
      response = "You can reach us through multiple channels: Email us at info@mastersolis.com, call us at +1 (234) 567-890, or visit our contact page to send us a message. Our team typically responds within 24 hours. We're here to help with any questions about our services or potential collaborations.";
      suggestions = ["Send a message", "Schedule a call", "Visit our office", "Get a quote"];
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
      response = "Our pricing varies based on project scope, complexity, and timeline. We offer competitive rates and flexible engagement models including fixed-price projects, time & materials, and dedicated team arrangements. Contact us for a personalized quote based on your specific requirements.";
      suggestions = ["Get a custom quote", "Tell me about your process", "What's included in projects?", "Contact sales team"];
    } else if (lowerMessage.includes('technology') || lowerMessage.includes('tech stack')) {
      response = "We work with cutting-edge technologies including React, Node.js, Python, AWS, Docker, Kubernetes, TensorFlow, MongoDB, PostgreSQL, and more. Our team stays current with the latest industry trends and best practices to deliver robust, scalable solutions.";
      suggestions = ["View our tech stack", "Tell me about AI capabilities", "What about cloud platforms?", "Mobile development technologies"];
    } else if (lowerMessage.includes('about') || lowerMessage.includes('company')) {
      response = "Mastersolis Infotech was founded in 2020 with a mission to empower businesses through innovative technology solutions. We're a team of 25+ experts serving 50+ global clients with a 99% satisfaction rate. Our vision is to become the global leader in transformative technology consulting.";
      suggestions = ["Learn more about us", "Meet our team", "Our company values", "Our mission and vision"];
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "Hello! Great to meet you. I'm here to help you learn more about Mastersolis Infotech and how we can assist with your technology needs. What would you like to know about our company, services, or team?";
      suggestions = ["Tell me about your services", "What makes you different?", "Show me your work", "How can you help my business?"];
    } else if (lowerMessage.includes('help')) {
      response = "I'm here to help! I can provide information about our services, current job openings, recent projects, company information, contact details, and more. What specific information are you looking for?";
      suggestions = ["Services overview", "Job opportunities", "Recent projects", "Contact information"];
    } else {
      response = "I understand you're interested in learning more. While I may not have specific information about that topic, I'd be happy to help you with questions about our services, projects, careers, or company information. You can also contact our team directly for more detailed assistance.";
      suggestions = ["Tell me about your services", "View job openings", "See recent projects", "Contact your team"];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again or contact our support team directly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className={`w-80 md:w-96 border-gridline shadow-xl ${isMinimized ? 'h-16' : 'h-[500px]'} transition-all duration-300`}>
              <CardHeader className="p-4 border-b border-gridline bg-primary text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-heading text-sm font-bold">AI Assistant</CardTitle>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="font-paragraph text-xs text-primary-foreground/80">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-primary-foreground hover:bg-primary-foreground/10 p-1 h-auto"
                    >
                      {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-primary-foreground hover:bg-primary-foreground/10 p-1 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
                  <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === 'user' 
                                ? 'bg-secondary text-secondary-foreground' 
                                : 'bg-primary text-primary-foreground'
                            }`}>
                              {message.type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                            </div>
                            <div className={`rounded-lg p-3 ${
                              message.type === 'user'
                                ? 'bg-secondary text-secondary-foreground'
                                : 'bg-background border border-gridline'
                            }`}>
                              <p className="font-paragraph text-sm leading-relaxed">{message.content}</p>
                              <p className={`font-paragraph text-xs mt-1 ${
                                message.type === 'user' ? 'text-secondary-foreground/70' : 'text-foreground/60'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-2 max-w-[80%]">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-3 h-3" />
                            </div>
                            <div className="bg-background border border-gridline rounded-lg p-3">
                              <div className="flex items-center space-x-1">
                                <Loader2 className="w-4 h-4 animate-spin text-foreground/60" />
                                <span className="font-paragraph text-sm text-foreground/60">Thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {messages.length > 0 && messages[messages.length - 1].type === 'assistant' && messages[messages.length - 1].suggestions && !isTyping && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors font-paragraph text-xs"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-gridline">
                    <div className="flex space-x-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 font-paragraph text-sm"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg relative"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </Button>
      </motion.div>
    </div>
  );
}