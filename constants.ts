import { JobApplication, ApplicationStatus } from './types';

export const GEMINI_MODEL = 'gemini-3-flash-preview';

export const INITIAL_JOBS: JobApplication[] = [
  {
    id: '1',
    companyName: 'TechFlow Solutions',
    contactName: 'Sarah Jenkins',
    phoneNumber: '15550192834',
    jobDescription: 'Looking for a Senior React Engineer with experience in Tailwind and AI integration.',
    generatedMessage: '',
    status: ApplicationStatus.DRAFT,
    createdAt: Date.now(),
  },
];

export const SYSTEM_INSTRUCTION = `
You are an expert career coach and professional communicator. 
Your task is to draft short, professional, and engaging WhatsApp messages for job applications.
The message should be polite, concise (under 100 words), and end with a call to action (e.g., asking for a call or a meeting).
Do not include subject lines or placeholders like [Your Name] unless absolutely necessary (assume the user will sign off).
Tone: Professional but conversational, suitable for WhatsApp.
`;
