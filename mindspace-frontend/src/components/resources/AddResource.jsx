import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const AddResource = ({ isOpen, onClose, onAddResource, apiBaseUrl = 'https://mind-space-3l96.onrender.com' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'article',
    category: 'anxiety',
    duration: '',
    rating: 4.0,
    tags: '',
    url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Sending to backend:', `${apiBaseUrl}/api/resources`);
      
      // Send to backend first
      const response = await fetch(`${apiBaseUrl}/api/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          category: formData.category,
          duration: formData.duration,
          rating: parseFloat(formData.rating),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          url: formData.url
        })
      });

      const result = await response.json();

      if (result.success) {
        // Use backend response data
        onAddResource(result.data);
        console.log('Resource saved to database!');
      } else {
        // Fallback to local addition if backend fails
        const newResource = {
          ...formData,
          id: Date.now(),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          rating: parseFloat(formData.rating)
        };
        onAddResource(newResource);
        console.log('Resource added locally (backend failed)');
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      // Fallback to local addition if API fails
      const newResource = {
        ...formData,
        id: Date.now(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        rating: parseFloat(formData.rating)
      };
      onAddResource(newResource);
      console.log('Resource added locally (API error)');
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'article',
      category: 'anxiety',
      duration: '',
      rating: 4.0,
      tags: '',
      url: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-emerald-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-white">Add New Resource</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-emerald-300 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Enter resource title..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="anxiety">Anxiety</option>
                <option value="burnout">Burnout</option>
                <option value="loneliness">Loneliness</option>
                <option value="motivation">Motivation</option>
                <option value="relationships">Relationships</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., 10 min read, 15 min"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-emerald-300 font-semibold mb-2">URL/Link</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="https://example.com or YouTube link..."
            />
          </div>

          <div>
            <label className="block text-emerald-300 font-semibold mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="mindfulness, stress, wellness (separate with commas)"
            />
          </div>

          <div>
            <label className="block text-emerald-300 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-vertical"
              placeholder="Describe what this resource offers and how it can help..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Resource
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddResource;