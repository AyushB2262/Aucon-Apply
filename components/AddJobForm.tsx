import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { Button } from './Button';

interface AddJobFormProps {
  onAdd: (job: JobApplication) => void;
  onCancel: () => void;
}

export const AddJobForm: React.FC<AddJobFormProps> = ({ onAdd, onCancel }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobApplication = {
      id: Date.now().toString(),
      companyName,
      contactName,
      phoneNumber,
      jobDescription,
      generatedMessage: '',
      status: ApplicationStatus.DRAFT,
      createdAt: Date.now(),
    };
    onAdd(newJob);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900">New Application</h2>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description / Context</label>
          <textarea
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            rows={3}
            placeholder="Paste the job requirements or key points you want to mention..."
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