// services/gemini-service.ts
import { GoogleGenAI } from '@google/genai';
import type { SupabaseChecklistResponse } from '../types/chat';

// Schema definition using the new Google GenAI SDK Type system
const checklistResponseSchema = {
  type: 'object' as const,
  properties: {
    // Maps to user_checklists table
    checklist: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string' as const,
          description: 'Brief checklist title (max 60 chars)'
        },
        description: {
          type: 'string' as const, 
          description: 'Clear explanation of checklist purpose'
        },
        category: {
          type: 'string' as const,
          enum: ['supplies', 'planning', 'skills', 'home', 'personal'],
          description: 'Category matching your existing categories'
        },
        points: {
          type: 'integer' as const,
          description: 'Points to award (based on item count and importance)',
          minimum: 5,
          maximum: 50
        }
      },
      required: ['title', 'description', 'category', 'points']
    },
    // Maps to user_checklist_items table
    items: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          text: {
            type: 'string' as const,
            description: 'Actionable checklist item (max 120 chars)'
          },
          priority: {
            type: 'string' as const,
            enum: ['high', 'medium', 'low'],
            description: 'Item importance level'
          }
        },
        required: ['text', 'priority']
      },
      maxItems: 5, // Keep manageable
      minItems: 1,
      description: 'List of actionable items with priority'
    },
    // For chat display (formatted message)
    display_message: {
      type: 'string' as const,
      description: 'User-friendly formatted message to display in chat'
    }
  },
  required: ['checklist', 'items', 'display_message']
};

export class GeminiChatService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize with the new Google GenAI SDK
    this.ai = new GoogleGenAI({
      apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
    });
  }

  private getSystemInstruction(): string {
    return `You are an emergency preparedness expert. Create practical checklists that save directly to user's preparation lists.

CRITICAL RULES:
- Always respond with JSON matching the exact schema
- checklist.category MUST be one of: "supplies", "planning", "skills", "home", "personal"
- checklist.points should reflect importance: 5-15 (basic), 16-30 (important), 31-50 (critical)
- items.text must be clear, actionable steps under 120 chars
- items.priority helps users understand urgency
- display_message should be friendly and encouraging

EXAMPLES:
User: "How do I prepare for a power outage?"
Response: {
  "checklist": {
    "title": "Power Outage Preparation",
    "description": "Essential steps to prepare for extended power loss",
    "category": "supplies",
    "points": 25
  },
  "items": [
    {"text": "Store 3 days of non-perishable food per person", "priority": "high"},
    {"text": "Keep flashlights and extra batteries accessible", "priority": "high"},
    {"text": "Fill bathtub and containers with water", "priority": "high"},
    {"text": "Charge all electronic devices fully", "priority": "medium"},
    {"text": "Locate manual can opener and cooking alternatives", "priority": "medium"}
  ],
  "display_message": "💡 **Power Outage Preparation Checklist**\\n\\nI've created a practical checklist to help you prepare for power outages. These 5 essential steps will ensure your family stays safe and comfortable during extended power loss.\\n\\n🔴 High Priority Items (Do First)\\n🟡 Medium Priority Items (Important Too)\\n\\nTap 'Add to Prep List' below to save this checklist!"
}`;
  }

  async sendMessage(userMessage: string, userId: string): Promise<SupabaseChecklistResponse> {
    const prompt = `Create an emergency preparedness checklist for: "${userMessage}"`;
    
    try {
      const request = {
        model: 'gemini-2.5-flash', // Latest model with structured output support
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: checklistResponseSchema,
          systemInstruction: this.getSystemInstruction(),
          temperature: 0.3, // More focused responses
          maxOutputTokens: 1024 // Keep responses concise
        }
      };

      const response = await this.ai.models.generateContent(request);

      const responseText = response.text;
      if (!responseText) {
        throw new Error('No response text received from Gemini API');
      }
      
      const parsedResponse = JSON.parse(responseText);
      
      return {
        displayMessage: parsedResponse.display_message,
        checklistData: parsedResponse.checklist,
        itemsData: parsedResponse.items.map((item: any, index: number) => ({
          text: item.text,
          priority: item.priority,
          item_order: index
        })),
        tokensUsed: response.usageMetadata?.totalTokenCount || 0
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Test function to verify API integration
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Gemini API connection...');
      const testResponse = await this.sendMessage('Test: earthquake preparation', 'test-user-id');
      console.log('✅ API test successful!', {
        title: testResponse.checklistData.title,
        itemCount: testResponse.itemsData.length,
        tokensUsed: testResponse.tokensUsed
      });
      return true;
    } catch (error) {
      console.error('❌ API test failed:', error);
      return false;
    }
  }
}
