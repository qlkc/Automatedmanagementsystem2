import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';
import { Book, Package, ArrowRightLeft, FileText, UserCircle, FileQuestion, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface HelpModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function HelpModule({ onToast }: HelpModuleProps) {
  const [selectedTopic, setSelectedTopic] = useState('getting-started');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  
  const helpTopics = [
    { id: 'faqs', label: 'FAQs', icon: FileQuestion },
    { id: 'getting-started', label: 'Getting Started', icon: Book },
    { id: 'system-manual', label: 'System Manual', icon: Settings },
    { id: 'inventory', label: 'Inventory Management', icon: Package },
    { id: 'borrowing', label: 'Borrowing & Return', icon: ArrowRightLeft },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'account', label: 'Account Settings', icon: UserCircle },
  ];
  
  const faqItems = [
    {
      question: 'How do I reset my password?',
      answer: 'Navigate to your Profile page and click "Change Password". You\'ll be prompted to enter your current password and your new password.'
    },
    {
      question: 'What happens when I archive a record?',
      answer: 'Archived records are preserved in the system but no longer available for active use. They can be viewed in reports but cannot be borrowed or modified.'
    },
    {
      question: 'Can I delete records from the system?',
      answer: 'No, the system does not allow deletion of records. Instead, use the Archive function to preserve data integrity and maintain audit trails.'
    },
    {
      question: 'How do I assign a QR tag to a tool?',
      answer: 'Go to the Tagging module, select a product, scan or enter a tag ID, and click "Assign Tag". The tag can then be used for borrowing.'
    },
    {
      question: 'What if a tool is returned damaged?',
      answer: 'During the return process, set the Condition field to "Needs Repair". This will flag the tool for maintenance before it can be borrowed again.'
    }
  ];
  
  const helpContent: { [key: string]: any } = {
    'faqs': {
      title: 'Frequently Asked Questions',
      type: 'faq'
    },
    'getting-started': {
      title: 'Getting Started',
      steps: [
        'Log in using your credentials provided by the administrator',
        'Navigate through modules using the left sidebar',
        'Use the Dashboard for a quick overview of system status',
        'Access your profile in the top-right corner',
        'All changes are automatically saved to the database'
      ]
    },
    'system-manual': {
      title: 'System Manual & Requirements',
      content: {
        'Operating System': 'Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)',
        'Python Version': 'Python 3.8 or higher required',
        'Database': 'SQLite 3 (included) or MySQL 8.0+',
        'Dependencies': 'tkinter, Pillow, qrcode, reportlab, pandas',
        'Network': 'LAN connection required for multi-user access',
        'Screen Resolution': '1280×720 minimum (1920×1080 recommended)',
        'User Roles': 'Administrator (full access), Staff (limited access)',
        'Tagging Protocol': 'QR codes generated with TAG-XXX format',
        'Backup Schedule': 'Daily automatic backups at 11:00 PM',
        'Data Retention': 'All records archived, never deleted'
      }
    },
    'inventory': {
      title: 'How to Register a Tool',
      steps: [
        'Navigate to "Products / Inventory" from the sidebar',
        'Fill in the product details form on the left panel',
        'Select category from the dropdown menu',
        'Enter product name, price, and quantity',
        'Set the initial status (Active/Inactive)',
        'Click "Save" to add the product to inventory',
        'The new product will appear in the table on the right',
        'Double-click any row to edit existing products'
      ]
    },
    'borrowing': {
      title: 'How to Borrow a Tool',
      steps: [
        'Navigate to "Borrowing & Return" from the sidebar',
        'Enter or scan the Employee ID in Borrower Information',
        'Employee name and department will auto-fill',
        'Scan or manually enter the Tool Tag ID',
        'Tool name will auto-fill after scanning',
        'Select current condition (Good / Needs Repair)',
        'Set expected return date using the date picker',
        'Click "Borrow" and confirm in the modal',
        'Transaction will be recorded in the history table'
      ]
    },
    'reports': {
      title: 'Generating Reports',
      steps: [
        'Navigate to "Reports" from the sidebar',
        'Set your desired filters (date range, category, status)',
        'Review the summary KPIs at the top',
        'Click "Generate PDF" to create a formatted report',
        'Choose export options (orientation, paper size, logo)',
        'Alternatively, click "Export CSV" for spreadsheet data',
        'Report files will be downloaded to your computer',
        'Archived records can be included in historical reports'
      ]
    },
    'account': {
      title: 'Managing Your Account',
      steps: [
        'Click on your profile picture in the top-right header',
        'Navigate to "Profile" from the sidebar',
        'Edit your contact information and email address',
        'Click "Save Profile" to update your changes',
        'Use "Change Password" to update your credentials',
        'View your borrowing history in the table below',
        'Contact your administrator to change your role'
      ]
    }
  };
  
  const currentContent = helpContent[selectedTopic];
  
  const handleSendMessage = () => {
    if (!contactForm.subject || !contactForm.message) {
      onToast('error', 'Please fill in all fields.');
      return;
    }
    onToast('success', 'Message sent to administrator.');
    setContactForm({ subject: '', message: '' });
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">HELP</h1>
        <p className="text-help mt-1">Home / Help</p>
      </div>
      
      <div className="grid grid-cols-[280px_1fr] gap-6">
        {/* Topics Menu */}
        <div className="bg-white rounded-[10px] p-4 shadow-sm border border-[#E5E7EB] h-fit">
          <h3 className="label-section text-[#2C5E2E] mb-3 px-2">Help Topics</h3>
          <nav className="space-y-1">
            {helpTopics.map(topic => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left
                    ${selectedTopic === topic.id 
                      ? 'bg-[#2C5E2E] text-white' 
                      : 'text-[#1B1B1B] hover:bg-[#F8F9FA]'
                    }`}
                >
                  <Icon size={18} />
                  <span className="text-body">{topic.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="space-y-6">
          <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
            <h2 className="heading-module text-[#2C5E2E] mb-4" style={{ fontSize: '16px' }}>
              {currentContent.title}
            </h2>
            
            {/* FAQ Content */}
            {currentContent.type === 'faq' && (
              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger className="w-full text-left p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="label-section text-[#2C5E2E]">{item.question}</span>
                        <span className="text-[#6B7280]">▼</span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 text-body">
                      {item.answer}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
            
            {/* System Manual Content */}
            {selectedTopic === 'system-manual' && (
              <div className="space-y-4">
                {Object.entries(currentContent.content).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-[#F5D000] pl-4">
                    <h4 className="label-section text-[#2C5E2E] mb-1">{key}</h4>
                    <p className="text-body text-[#6B7280]">{value}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Step-by-Step Guides */}
            {currentContent.steps && (
              <div className="space-y-3">
                {currentContent.steps.map((step: string, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2C5E2E] text-white flex items-center justify-center text-body">
                      {index + 1}
                    </div>
                    <p className="text-body flex-1 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-[#F5D000]/10 rounded-lg border border-[#F5D000]/30">
              <p className="text-body">
                <strong>Tip:</strong> Double-click any table row to quickly edit that entry. Use keyboard shortcuts: Enter to confirm, Escape to cancel.
              </p>
            </div>
          </div>
          
          {/* Contact Admin Form */}
          <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
            <h3 className="label-section text-[#2C5E2E] mb-4">Contact Administrator</h3>
            
            <div className="space-y-3">
              <CustomInput
                label="Subject"
                placeholder="Brief description of your issue"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
              
              <div className="flex flex-col gap-1">
                <label className="label-section text-[#1B1B1B]">Message</label>
                <textarea
                  className="min-h-[120px] border border-[#E5E7EB] rounded-md px-2.5 py-2 text-body
                    focus:border-[#2C5E2E] focus:ring-2 focus:ring-[#2C5E2E]/12 outline-none resize-none"
                  placeholder="Describe your issue or question in detail..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>
              
              <CustomButton variant="primary" onClick={handleSendMessage}>
                Send Message
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
