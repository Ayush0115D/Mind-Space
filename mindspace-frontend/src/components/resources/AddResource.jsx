import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Save } from 'lucide-react';

const AddResource = ({ isOpen, onClose, onSaveResource, apiBaseUrl = 'https://mind-space-3l96.onrender.com', editingResource = null }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingResource) {
      setFormData({
        title: editingResource.title || '',
        description: editingResource.description || '',
        type: editingResource.type || 'article',
        category: editingResource.category || 'anxiety',
        duration: editingResource.duration || '',
        rating: editingResource.rating || 4.0,
        tags: Array.isArray(editingResource.tags) ? editingResource.tags.join(', ') : '',
        url: editingResource.url || ''
      });
    } else {
      resetForm();
    }
  }, [editingResource, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        category: formData.category,
        duration: formData.duration.trim(),
        rating: parseFloat(formData.rating),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        url: formData.url.trim()
      };

      // Different endpoint for edit vs create
      const resourceId = editingResource?._id || editingResource?.id;
      const url = editingResource 
        ? `${apiBaseUrl}/api/resources/${resourceId}`
        : `${apiBaseUrl}/api/resources`;
      
      const method = editingResource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        onSaveResource(result.data); // Pass backend resource
        resetForm();
        onClose(); // Close modal automatically
      } else {
        alert(result.message || 'Failed to save resource. Try again.');
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Error connecting to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-emerald-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-white">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-emerald-300 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
              placeholder="Enter resource title..."
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
              >
                <option value="anxiety">Anxiety</option>
                <option value="burnout">Burnout</option>
                <option value="loneliness">Loneliness</option>
                <option value="motivation">Motivation</option>
                <option value="relationships">Relationships</option>
              </select>
            </div>
          </div>

          {/* Duration & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
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
                min="0" max="5" step="0.1"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-emerald-300 font-semibold mb-2">URL/Link</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
              placeholder="https://example.com or YouTube link..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-emerald-300 font-semibold mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
              placeholder="mindfulness, stress, wellness (comma separated)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-emerald-300 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-800/70 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 resize-vertical disabled:opacity-50"
              placeholder="Describe what this resource offers..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {editingResource ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  {editingResource ? (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update Resource
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Resource
                    </>
                  )}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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