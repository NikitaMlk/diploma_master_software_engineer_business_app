// CampaignsList.js - View all campaigns
"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, BarChart3, Edit, Trash2, Play, Pause } from 'lucide-react';

const CampaignsList = ({ userId, onCreateNew, onEditCampaign }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCampaigns();
  }, [userId, filter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('userId', userId);
      if (filter !== 'all') params.set('status', filter);

      const response = await fetch(`/api/campaigns?${params}`);
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const handleDelete = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Campaigns</h1>
          <p className="text-gray-400 mt-1">Manage your content campaigns</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'active', 'draft', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No campaigns found</h3>
          <p className="text-gray-400 mb-6">Create your first campaign to get started</p>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                  <p className="text-gray-400 text-sm">{campaign.companyName}</p>
                </div>
                {getStatusBadge(campaign.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{campaign.posts?.length || 0} posts generated</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>
                    {campaign.settings?.postsPerDay || 0} posts/day × {campaign.settings?.duration || 0} days
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditCampaign(campaign)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Edit campaign"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  {campaign.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange(campaign._id, 'draft')}
                      className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Pause campaign"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(campaign._id, 'active')}
                      className="p-2 text-green-400 hover:text-green-300 transition-colors"
                      title="Start campaign"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(campaign._id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsList;