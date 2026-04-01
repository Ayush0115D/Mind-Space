import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Zap,
  Heart,
  Star,
  Brain,
  Users,
  Search,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import CrisisSupport from "./CrisisSupport";
import ResourceSidebar from "./ResourceSidebar";
import AddResource from "./AddResource";

const ResourceHub = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mind-space-3l96.onrender.com';

  const categories = [
    { id: "all", label: "All Resources", icon: BookOpen },
    { id: "burnout", label: "Burnout", icon: Zap },
    { id: "loneliness", label: "Loneliness", icon: Heart },
    { id: "motivation", label: "Motivation", icon: Star },
    { id: "anxiety", label: "Anxiety", icon: Brain },
    { id: "relationships", label: "Relationships", icon: Users },
  ];

  const fallbackData = [
    { id: 1, title: "Understanding Burnout: Signs and Solutions", type: "article", category: "burnout", duration: "8 min read", rating: 4.8, description: "Learn to recognize early signs of burnout and discover effective recovery strategies that actually work.", tags: ["workplace", "stress", "recovery"], url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 2, title: "Meditation for Anxiety Relief", type: "video", category: "anxiety", duration: "15 min", rating: 4.9, description: "Guided meditation techniques specifically designed to calm anxious thoughts and restore inner peace.", tags: ["mindfulness", "breathing", "calm"], url: "https://www.youtube.com/watch?v=ZToicYcHIOU" },
    { id: 3, title: "Building Meaningful Connections", type: "podcast", category: "loneliness", duration: "32 min", rating: 4.7, description: "Expert insights on overcoming loneliness and building lasting relationships in our digital age.", tags: ["social", "community", "friendship"], url: "https://www.youtube.com/watch?v=8CrOL-ydFMI" },
    { id: 4, title: "Daily Motivation Practices", type: "article", category: "motivation", duration: "6 min read", rating: 4.6, description: "Simple yet powerful practices to maintain motivation and momentum in your personal growth journey.", tags: ["habits", "goals", "productivity"], url: "https://www.mindtools.com/pages/article/motivation-techniques.htm" },
    { id: 5, title: "The Science of Emotional Resilience", type: "video", category: "motivation", duration: "22 min", rating: 4.9, description: "Research-backed strategies for building mental strength and resilience in challenging times.", tags: ["psychology", "resilience", "growth"], url: "https://www.youtube.com/watch?v=NWH8N-BvhAw" },
    { id: 6, title: "Mindful Communication in Relationships", type: "podcast", category: "relationships", duration: "28 min", rating: 4.8, description: "Transform your relationships through mindful listening and empathetic communication techniques.", tags: ["communication", "empathy", "mindfulness"], url: "https://www.youtube.com/watch?v=eyq2Wo4eUDg" },
  ];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeFilter !== 'all') params.append('category', activeFilter);
        if (searchTerm.trim()) params.append('search', searchTerm.trim());

        const response = await fetch(`${API_BASE_URL}/api/resources?${params}`);
        
        if (!response.ok) {
          console.error('Failed to fetch resources:', response.status);
          setResources([]);
          return;
        }

        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          console.log('Fetched resources:', result.data.length);
          setResources(result.data);
        } else {
          console.error('Invalid response format:', result);
          setResources([]);
        }
      } catch (error) {
        console.error('API Error:', error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResources, 300);
    return () => clearTimeout(timer);
  }, [activeFilter, searchTerm]);

  const handleResourceClick = (resource) => {
    if (resource.url) window.open(resource.url, '_blank');
  };

  const handleSaveResource = (savedResource) => {
    if (editingResource) {
      // Update existing resource
      setResources(prev => prev.map(r => {
        const rId = r._id || r.id;
        const sId = savedResource._id || savedResource.id;
        return rId === sId ? savedResource : r;
      }));
    } else {
      // Add new resource
      setResources(prev => [savedResource, ...prev]);
    }
    setEditingResource(null);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowAddModal(true);
  };

  const handleDeleteResource = async (resource, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    const resourceId = resource._id;
    
    if (!resourceId) {
      alert('Invalid resource ID');
      return;
    }

    console.log('Deleting resource with ID:', resourceId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        setResources(prev => prev.filter(r => r._id !== resourceId));
        console.log('Resource deleted successfully');
      } else {
        const text = await response.text();
        console.error('Delete failed:', text);
        alert(`Failed to delete: ${response.status} - Resource may not exist`);
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Network error. Please try again.');
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesFilter = activeFilter === "all" || resource.category === activeFilter;
    const matchesSearch = !searchTerm.trim() || 
      [resource.title, resource.description, ...(resource.tags || [])]
        .some(text => text.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const ResourceCard = ({ resource }) => (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 hover:transform hover:scale-[1.02] transition-all duration-500 hover:bg-gray-900/80 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={(e) => { e.stopPropagation(); handleEditResource(resource); }} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 hover:border-blue-400/60 rounded-lg transition-all" title="Edit">
          <Edit2 className="w-4 h-4 text-blue-400" />
        </button>
        <button onClick={(e) => handleDeleteResource(resource, e)} className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 hover:border-red-400/60 rounded-lg transition-all" title="Delete">
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>

      <div className="relative cursor-pointer" onClick={() => handleResourceClick(resource)}>
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-emerald-400 capitalize font-semibold px-4 py-2 bg-emerald-500/20 rounded-full text-sm">{resource.type}</span>
          <span className="text-gray-300 font-medium">{resource.duration}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-yellow-300 font-bold">{resource.rating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4 pr-20">
          <h3 className="text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors">{resource.title}</h3>
          {resource.url && <ExternalLink className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />}
        </div>
        <p className="text-gray-200 leading-relaxed text-lg mb-6">{resource.description}</p>
        <div className="flex flex-wrap gap-3">
          {resource.tags?.map((tag, i) => (
            <span key={i} className="px-4 py-2 bg-gradient-to-r from-emerald-500/30 to-green-500/20 text-emerald-200 rounded-full text-sm font-semibold">#{tag}</span>
          ))}
        </div>
        {resource.url && <div className="mt-4 text-sm text-emerald-300/80">Click to open resource →</div>}
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950/40 px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mb-8 shadow-2xl shadow-emerald-500/30 animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-6xl font-black text-transparent bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text mb-6">Resource Hub</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">Discover curated mental health resources, expert guidance, and crisis support designed to empower your wellness journey</p>
        </div>

        <CrisisSupport />

        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input type="text" placeholder="Search resources, topics, or tags..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-16 pr-6 py-6 bg-gray-900/70 border border-emerald-500/30 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl transition-all shadow-xl" />
            </div>
            <button onClick={() => { setEditingResource(null); setShowAddModal(true); }} className="flex items-center px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-2xl transform hover:scale-105">
              <Plus className="w-6 h-6 mr-3" />Add Resource
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button key={category.id} onClick={() => setActiveFilter(category.id)} className={`flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all ${activeFilter === category.id ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl transform scale-105 border-2 border-emerald-400/50" : "bg-gray-900/60 text-gray-300 hover:bg-gray-800/70 border-2 border-emerald-500/30 hover:border-emerald-500/50 hover:text-white"}`}>
                  <Icon className="w-5 h-5 mr-3" />{category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-20">
          <div className="grid gap-6 text-white">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4 animate-spin">
                  <BookOpen className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-gray-400 text-xl">Loading resources...</p>
              </div>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-xl">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        <ResourceSidebar />

        <AddResource 
          isOpen={showAddModal} 
          onClose={() => { 
            setShowAddModal(false); 
            setEditingResource(null); 
          }} 
          onSaveResource={handleSaveResource}
          apiBaseUrl={API_BASE_URL} 
          editingResource={editingResource} 
        />
      </div>
    </section>
  );
};

export default ResourceHub;