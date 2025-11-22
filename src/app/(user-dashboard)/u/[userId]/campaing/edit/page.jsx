// CampaignEditor.js - Edit existing campaign
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, Settings } from 'lucide-react';

const CampaignEditor = ({ campaign, userId, onBack, onCampaignUpdated }) => {
  const [campaignData, setCampaignData] = useState(campaign);
  const [activeTab, setActiveTab] = useState('settings');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/campaigns/${campaign._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });

      if (response.ok) {
        onCampaignUpdated();
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRegeneratePosts = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaign._id}/generate`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setCampaignData(prev => ({ ...prev, posts: data.posts }));
      }
    } catch (error) {
      console.error('Error regenerating posts:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{campaignData.name}</h1>
            <p className="text-gray-400">{campaignData.companyName}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-700">
        {[
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'posts', label: `Posts (${campaignData.posts?.length || 0})`, icon: Calendar }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={campaignData.companyName}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Posts per Day
                </label>
                <input
                  type="number"
                  value={campaignData.settings?.postsPerDay || 1}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, postsPerDay: parseInt(e.target.value) }
                  }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={campaignData.settings?.duration || 30}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, duration: parseInt(e.target.value) }
                  }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={campaignData.status}
                onChange={(e) => setCampaignData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Generated Posts</h3>
              <button
                onClick={handleRegeneratePosts}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Regenerate Posts
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {campaignData.posts?.map((post, index) => (
                <div key={post._id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Day {post.day}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">{post.time}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {post.theme}
                      </span>
                    </div>
                  </div>
                  <p className="text-white text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignEditor;