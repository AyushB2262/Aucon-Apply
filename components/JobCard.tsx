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
  // State for Message Editing
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editedMessage, setEditedMessage] = useState(job.generatedMessage);

  // State for Target Details Editing
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [editValues, setEditValues] = useState({
    companyName: job.companyName,
    contactName: job.contactName,
    phoneNumber: job.phoneNumber,
    jobTitle: job.jobTitle || '',
    jobDescription: job.jobDescription
  });

  const handleGenerate = async () => {
    onUpdate({ ...job, status: ApplicationStatus.GENERATING });
    try {
      const response = await generateApplicationMessage({
        companyName: job.companyName,
        contactName: job.contactName,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
      });
      onUpdate({ 
        ...job, 
        generatedMessage: response.message,
        groundingUrls: response.groundingUrls,
        status: ApplicationStatus.READY 
      });
      setEditedMessage(response.message);
    } catch (error) {
      alert("Failed to generate message. Check API Key.");
      onUpdate({ ...job, status: ApplicationStatus.DRAFT });
    }
  };

  const getWhatsAppLink = () => {
    const phone = cleanPhoneNumber(job.phoneNumber);
    if (!phone) return '#';
    const text = encodeURIComponent(editedMessage);
    return `https://wa.me/${phone}?text=${text}`;
  };

  const handleSendClick = () => {
     onUpdate({ ...job, status: ApplicationStatus.SENT });
  };

  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onDelete(job.id);
  };

  const handleStartEdit = () => {
    setEditValues({
      companyName: job.companyName,
      contactName: job.contactName,
      phoneNumber: job.phoneNumber,
      jobTitle: job.jobTitle || '',
      jobDescription: job.jobDescription
    });
    setIsEditingTarget(true);
    setIsEditingMessage(false); // Close message edit if open
  };

  const handleSaveTarget = () => {
    onUpdate({
      ...job,
      ...editValues
    });
    setIsEditingTarget(false);
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          {isEditingTarget ? (
             <div className="w-full space-y-3">
                 <input 
                    value={editValues.companyName} 
                    onChange={e => setEditValues({...editValues, companyName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm font-bold focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Company Name"
                 />
                 <input 
                    value={editValues.jobTitle} 
                    onChange={e => setEditValues({...editValues, jobTitle: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Job Title (e.g. Software Engineer)"
                 />
                 <div className="grid grid-cols-2 gap-2">
                    <input 
                        value={editValues.contactName} 
                        onChange={e => setEditValues({...editValues, contactName: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Contact Name"
                    />
                    <input 
                        value={editValues.phoneNumber} 
                        onChange={e => setEditValues({...editValues, phoneNumber: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Phone"
                    />
                 </div>
             </div>
          ) : (
             <div className="max-w-[80%]">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{job.companyName}</h3>
                {job.jobTitle && (
                    <p className="text-indigo-600 font-medium text-sm mt-0.5">{job.jobTitle}</p>
                )}
                <p className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-1 mt-1">
                  <span>{job.contactName}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-gray-400 text-xs sm:text-sm pt-0.5 sm:pt-0">{job.phoneNumber}</span>
                </p>
             </div>
          )}
          
          {!isEditingTarget && (
             <span className={`ml-2 flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status}
             </span>
          )}
        </div>

        {/* Job Description Section */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Job Context</p>
          {isEditingTarget ? (
             <textarea
                value={editValues.jobDescription}
                onChange={e => setEditValues({...editValues, jobDescription: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Optional description"
             />
          ) : (
             <p className="text-sm text-gray-600 line-clamp-2">
                 {job.jobDescription || "No specific description. AI uses web search."}
             </p>
          )}
        </div>

        {/* Action Buttons for Edit Mode */}
        {isEditingTarget ? (
            <div className="flex justify-end gap-2 mt-auto">
                <Button variant="secondary" onClick={() => setIsEditingTarget(false)} className="text-xs px-3 py-1">Cancel</Button>
                <Button onClick={handleSaveTarget} className="text-xs px-3 py-1">Save Changes</Button>
            </div>
        ) : (
          <>
            {/* Message Preview Section (Only visible when not editing target details) */}
            {job.status !== ApplicationStatus.DRAFT && job.status !== ApplicationStatus.GENERATING && (
              <div className="mb-4 bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message Preview</p>
                   <button 
                    onClick={() => setIsEditingMessage(!isEditingMessage)}
                    className="text-indigo-600 text-xs hover:underline"
                   >
                     {isEditingMessage ? 'Save' : 'Edit'}
                   </button>
                </div>
                
                {isEditingMessage ? (
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

                {/* Grounding Sources */}
                {job.groundingUrls && job.groundingUrls.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Information sourced from:</p>
                        <ul className="list-disc pl-4">
                            {job.groundingUrls.slice(0, 3).map((url, idx) => (
                                <li key={idx} className="text-xs truncate max-w-full">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {new URL(url).hostname}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-auto">
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  {job.status === ApplicationStatus.DRAFT || (job.status === ApplicationStatus.GENERATING && !job.generatedMessage) ? (
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
                        href={getWhatsAppLink()}
                        onClick={handleSendClick}
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
                <div className="mt-3 flex justify-between items-center px-1">
                     <button 
                        onClick={handleStartEdit} 
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center"
                     >
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Details
                     </button>
                     <button 
                        type="button" 
                        onClick={handleDelete} 
                        className="text-xs text-red-400 hover:text-red-600 hover:underline"
                     >
                         Delete
                     </button>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};