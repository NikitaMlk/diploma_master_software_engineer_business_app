"use client";

import React, { useState } from 'react';
import { 
  Calendar, BarChart3, CheckCircle
} from 'lucide-react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AIGenerator from './ContentGenerator';
import VoiceTraining from './VoiceTraining';

const XSchedulerDashboard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState('');

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setNotification('Copied to clipboard!');
    setTimeout(() => setNotification(''), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'generate':
        return <AIGenerator onCopy={handleCopy} />;
      case 'voice':
        return <VoiceTraining />;
      case 'analytics':
        return (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Analytics Coming Soon</h2>
            <p className="text-gray-400">Detailed engagement insights will be available soon.</p>
          </div>
        );
      case 'schedule':
        return (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Scheduler Coming Soon</h2>
            <p className="text-gray-400">Full automation features will be available in the next update.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <Sidebar userId={userId} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default XSchedulerDashboard;