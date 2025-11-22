"use client";
import React, { useState } from 'react';
import CampaignsList from './CampaignsList';
import AIGenerator from './ContentGenerator'; // Your existing component
import CampaignEditor from './CampaignEditor';

const CampaignManager = ({ userId }) => {
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleCreateNew = () => {
    setView('create');
    setSelectedCampaign(null);
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setView('edit');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedCampaign(null);
  };

  const renderView = () => {
    switch (view) {
      case 'create':
        return (
          <AIGenerator 
            userId={userId}
            onBack={handleBackToList}
            onCampaignCreated={handleBackToList}
          />
        );
      case 'edit':
        return (
          <CampaignEditor 
            campaign={selectedCampaign}
            userId={userId}
            onBack={handleBackToList}
            onCampaignUpdated={handleBackToList}
          />
        );
      case 'list':
      default:
        return (
          <CampaignsList 
            userId={userId}
            onCreateNew={handleCreateNew}
            onEditCampaign={handleEditCampaign}
          />
        );
    }
  };

  return <div className="w-full">{renderView()}</div>;
};

export { CampaignManager };