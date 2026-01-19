import React, { useState } from 'react';
import { Contact } from '../types';
import { Button } from './Button';

interface ContactBookProps {
  contacts: Contact[];
  onAdd: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const ContactBook: React.FC<ContactBookProps> = ({ contacts, onAdd, onDelete, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onAdd({
      id: Date.now().toString(),
      name,
      phoneNumber: phone,
      companyName: company
    });
    setName('');
    setPhone('');
    setCompany('');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Contact Book</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Add New Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Contact</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
                required
              />
              <input
                type="text"
                placeholder="Company (Optional)"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
              />
              <input
                type="tel"
                placeholder="Phone (e.g. 1555...)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
                required
              />
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" variant="secondary" className="w-full md:w-auto">
                  + Add to Book
                </Button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-3">
             {contacts.length === 0 ? (
                 <p className="text-center text-gray-400 py-4">No contacts saved yet.</p>
             ) : (
                 contacts.map(contact => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                        <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-500">
                                {contact.companyName ? `${contact.companyName} • ` : ''} {contact.phoneNumber}
                            </p>
                        </div>
                        <button 
                            onClick={() => onDelete(contact.id)}
                            className="text-red-400 hover:text-red-600 p-2"
                            title="Delete Contact"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                 ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
};