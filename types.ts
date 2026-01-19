export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  READY = 'READY',
  SENT = 'SENT',
}

export interface JobApplication {
  id: string;
  companyName: string;
  contactName: string;
  phoneNumber: string; // Should be international format without + ideally
  jobDescription: string;
  generatedMessage: string;
  status: ApplicationStatus;
  createdAt: number;
}

export interface GenerateMessageParams {
  contactName: string;
  companyName: string;
  jobDescription: string;
  userContext?: string; // Optional user resume summary or tone preference
}

export interface GeneratedResponse {
  message: string;
}