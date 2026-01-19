import React, { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus, Contact } from './types';
import { INITIAL_JOBS } from './constants';
import { JobCard } from './components/JobCard';
import { AddJobForm } from './components/AddJobForm';
import { Button } from './components/Button';
import { ContactBook } from './components/ContactBook';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('autoapply_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
      const saved = localStorage.getItem('autoapply_contacts');
      return saved ? JSON.parse(saved) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showContactBook, setShowContactBook] = useState(false);

  useEffect(() => {
    localStorage.setItem('autoapply_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
      localStorage.setItem('autoapply_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addJob = (job: JobApplication) => {
    setJobs([job, ...jobs]);
    setShowAddForm(false);
  };

  const updateJob = (updatedJob: JobApplication) => {
    setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const deleteJob = (id: string) => {
    if(window.confirm('Are you sure you want to delete this application?')) {
        setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const addContact = (contact: Contact) => {
      setContacts([...contacts, contact]);
  };

  const deleteContact = (id: string) => {
      if(window.confirm('Delete this contact?')) {
          setContacts(contacts.filter(c => c.id !== id));
      }
  };

  const stats = {
    total: jobs.length,
    sent: jobs.filter(j => j.status === ApplicationStatus.SENT).length,
    draft: jobs.filter(j => j.status === ApplicationStatus.DRAFT).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                AI
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">AutoApply</h1>
                <p className="text-xs text-gray-500">WhatsApp Automation Assistant</p>
             </div>
          </div>
          <div className="flex items-center space-x-4">
              <Button variant="secondary" onClick={() => setShowContactBook(true)}>
                  📒 Contact Book
              </Button>
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 border-l pl-4 border-gray-200">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900">{stats.total}</span>
                    <span className="text-xs">Targets</span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-green-600">{stats.sent}</span>
                    <span className="text-xs">Sent</span>
                </div>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Instructions */}
        <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-start gap-4">
           <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
           <div>
             <h2 className="text-lg font-semibold text-indigo-900">How to automate your applications</h2>
             <p className="text-indigo-700 text-sm mt-1 max-w-3xl">
               This tool helps you scale your job search using AI.
               1. <strong>Add a Target</strong> (manually or from Contact Book).
               2. <strong>Generate Message</strong> using Gemini AI.
               3. <strong>Click Send</strong> to launch WhatsApp.
             </p>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Applications</h2>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Close Form' : '+ New Application'}
          </Button>
        </div>

        {/* Form Modal / Inline */}
        {showAddForm && (
          <div className="mb-8 animate-fade-in-down">
            <AddJobForm 
                onAdd={addJob} 
                onCancel={() => setShowAddForm(false)} 
                contacts={contacts}
            />
          </div>
        )}

        {/* Contact Book Modal */}
        {showContactBook && (
            <ContactBook 
                contacts={contacts}
                onAdd={addContact}
                onDelete={deleteContact}
                onClose={() => setShowContactBook(false)}
            />
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onUpdate={updateJob}
              onDelete={deleteJob}
            />
          ))}
          
          {jobs.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
               <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
               <p className="text-lg font-medium">No active applications</p>
               <p className="text-sm">Click "+ New Application" to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;