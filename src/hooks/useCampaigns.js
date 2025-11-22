// src/hooks/useCampaigns.js
import { useState, useEffect } from 'react';

export const useCampaigns = (userId) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchCampaigns();
    }
  }, [userId]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData) => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campaignData, userId })
      });
      
      if (!response.ok) throw new Error('Failed to create campaign');
      
      const data = await response.json();
      setCampaigns(prev => [data.campaign, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCampaign = async (campaignId, updates) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update campaign');
      
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign._id === campaignId 
            ? { ...campaign, ...updates, updatedAt: new Date() }
            : campaign
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete campaign');
      
      setCampaigns(prev => prev.filter(campaign => campaign._id !== campaignId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refetch: fetchCampaigns
  };
};