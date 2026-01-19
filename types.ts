export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  READY = 'READY',
  SENT = 'SENT',
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  companyName?: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  contactName: string;
  phoneNumber: string; // Should be international format without + ideally
  jobTitle?: string; // New field for the specific position
  jobDescription: string;
  generatedMessage: string;
  groundingUrls?: string[]; // New field to store search sources
  status: ApplicationStatus;
  createdAt: number;
}

export interface GenerateMessageParams {
  contactName: string;
  companyName: string;
  jobTitle?: string;
  jobDescription: string;
  userContext?: string; // Optional user resume summary or tone preference
}

export interface GeneratedResponse {
  message: string;
  groundingUrls?: string[];
}