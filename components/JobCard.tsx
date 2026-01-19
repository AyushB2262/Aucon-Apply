import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { Button } from './Button';
import { generateApplicationMessage } from '../services/geminiService';

interface JobCardProps {
  job: JobApplication;
  onUpdate: (updatedJob: JobApplication) => void;
  onDelete: (id: string) => void;
}

// Helper to clean phone numbers for WA API
const cleanPhoneNumber = (phone: string) => {
  return phone.replace(/\D/g, '');
};

export const JobCard: React.FC<JobCardProps> = ({ job, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(job.generatedMessage);

  const handleGenerate = async () => {
    onUpdate({ ...job, status: ApplicationStatus.GENERATING });
    try {
      const message = await generateApplicationMessage({
        companyName: job.companyName,
        contactName: job.contactName,
        jobDescription: job.jobDescription,
      });
      onUpdate({ 
        ...job, 
        generatedMessage: message, 
        status: ApplicationStatus.READY 
      });
      setEditedMessage(message);
    } catch (error) {
      alert("Failed to generate message. Check API Key.");
      onUpdate({ ...job, status: ApplicationStatus.DRAFT });
    }
  };

  const handleSendWhatsApp = () => {
    const phone = cleanPhoneNumber(job.phoneNumber);
    if (!phone) {
      alert("Please enter a valid phone number with country code.");
      return;
    }
    const text = encodeURIComponent(editedMessage);
    const url = `https://wa.me/${phone}?text=${text}`;
    
    // Open in new tab (triggers WhatsApp Web or App)
    window.open(url, '_blank');
    
    onUpdate({ ...job, status: ApplicationStatus.SENT });
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.DRAFT: return 'bg-gray-100 text-gray-800';
      case ApplicationStatus.GENERATING: return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.READY: return 'bg-yellow-100 text-yellow-800';
      case ApplicationStatus.SENT: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{job.companyName}</h3>
            <p className="text-sm text-gray-500">Contact: {job.contactName}</p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Job Context</p>
          <p className="text-sm text-gray-600 line-clamp-2">{job.jobDescription}</p>
        </div>

        {job.status !== ApplicationStatus.DRAFT && job.status !== ApplicationStatus.GENERATING && (
          <div className="mb-4 bg-gray-50 p-3 rounded-md border border-gray-100">
            <div className="flex justify-between items-center mb-2">
               <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message Preview</p>
               <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-indigo-600 text-xs hover:underline"
               >
                 {isEditing ? 'Save' : 'Edit'}
               </button>
            </div>
            
            {isEditing ? (
              <textarea 
                className="w-full text-sm p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                onBlur={() => onUpdate({...job, generatedMessage: editedMessage})}
              />
            ) : (
              <p className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{job.generatedMessage}</p>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          {job.status === ApplicationStatus.DRAFT ? (
             <Button 
                onClick={handleGenerate} 
                isLoading={job.status === ApplicationStatus.GENERATING}
                className="w-full"
             >
                <span className="mr-2">✨</span> Generate Message
             </Button>
          ) : (
            <>
               <Button 
                variant="secondary"
                onClick={handleGenerate}
                isLoading={job.status === ApplicationStatus.GENERATING}
                className="flex-1"
               >
                 Regenerate
               </Button>
               <Button 
                variant="whatsapp"
                onClick={handleSendWhatsApp}
                className="flex-1"
               >
                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.698c.991.54 2.112.835 3.197.835l.001-.001c3.181 0 5.769-2.586 5.769-5.766 0-3.181-2.586-5.767-5.768-5.767zm0 10.158c-.975 0-1.926-.263-2.766-.757l-.198-.117-2.032.534.542-1.979-.129-.204c-.571-.908-.873-1.956-.874-3.033 0-2.38 1.936-4.317 4.316-4.317 2.379 0 4.315 1.936 4.315 4.317 0 2.38-1.936 4.317-4.316 4.317z"/>
                 </svg>
                 Send
               </Button>
            </>
          )}
        </div>
        <div className="mt-2 text-right">
             <button onClick={() => onDelete(job.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
};