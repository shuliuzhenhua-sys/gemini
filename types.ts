export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  image?: string; // Base64 string for uploaded images
  generatedImage?: string; // Base64 string for AI generated preview
  isLoading?: boolean;
}

export enum Step {
  SUBJECT = 0,
  DETAILS = 1,
  STYLE = 2,
  COMPOSITION = 3,
  QUALITY = 4,
  NEGATIVE = 5,
  DONE = 6
}

export interface QuickOption {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface StepConfig {
  title: string;
  description: string;
  options: QuickOption[];
}