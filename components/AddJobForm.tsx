import React, { useState } from 'react';
import { JobApplication, ApplicationStatus, Contact } from '../types';
import { Button } from './Button';

interface AddJobFormProps {
  onAdd: (job: JobApplication) => void;
  onCancel: () => void;
  contacts: Contact[];
}

export const AddJobForm: React.FC<AddJobFormProps> = ({ onAdd, onCancel, contacts }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleContactSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      if (!selectedId) return;
      
      const contact = contacts.find(c => c.id === selectedId);
      if (contact) {
          setContactName(contact.name);
          setPhoneNumber(contact.phoneNumber);
          if (contact.companyName) setCompanyName(contact.companyName);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobApplication = {
      id: Date.now().toString(),
      companyName,
      contactName,
      phoneNumber,
      jobTitle,
      jobDescription,
      generatedMessage: '',
      status: ApplicationStatus.DRAFT,
      createdAt: Date.now(),
    };
    onAdd(newJob);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">New Application</h2>
          {contacts.length > 0 && (
              <select 
                onChange={handleContactSelect}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1.5 border bg-indigo-50 text-indigo-700 font-medium"
              >
                  <option value="">✨ Quick Fill from Book</option>
                  {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.companyName || 'No Company'})</option>
                  ))}
              </select>
          )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              required
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="e.g. Google"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              required
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="e.g. Hiring Manager"
            />
          </div>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Target Position</label>
           <input
             type="text"
             value={jobTitle}
             onChange={(e) => setJobTitle(e.target.value)}
             className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
             placeholder="e.g. Senior Software Engineer"
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <input
            required
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g. 15551234567 (Include Country Code)"
          />
          <p className="text-xs text-gray-500 mt-1">Do not use spaces or dashes. Include country code.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Context (Optional)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            rows={2}
            placeholder="Any specific details you want to add... (AI will search web for the rest)"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Target</Button>
        </div>
      </form>
    </div>
  );
};