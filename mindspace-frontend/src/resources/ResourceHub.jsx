const ResourceHub = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'burnout', label: 'Burnout', icon: Zap },
    { id: 'loneliness', label: 'Loneliness', icon: Heart },
    { id: 'motivation', label: 'Motivation', icon: Star },
    { id: 'anxiety', label: 'Anxiety', icon: Brain },
    { id: 'relationships', label: 'Relationships', icon: Users }
  ];

  const resources = [
    {
      id: 1,
      title: "Understanding Burnout: Signs and Solutions",
      type: "article",
      category: "burnout",
      duration: "8 min read",
      rating: 4.8,
      description: "Learn to recognize early signs of burnout and discover effective recovery strategies that actually work.",
      tags: ["workplace", "stress", "recovery"]
    },
    {
      id: 2,
      title: "Meditation for Anxiety Relief",
      type: "video",
      category: "anxiety",
      duration: "15 min",
      rating: 4.9,
      description: "Guided meditation techniques specifically designed to calm anxious thoughts and restore inner peace.",
      tags: ["mindfulness", "breathing", "calm"]
    },
    {
      id: 3,
      title: "Building Meaningful Connections",
      type: "podcast",
      category: "loneliness",
      duration: "32 min",
      rating: 4.7,
      description: "Expert insights on overcoming loneliness and building lasting relationships in our digital age.",
      tags: ["social", "community", "friendship"]
    },
    {
      id: 4,
      title: "Daily Motivation Practices",
      type: "article",
      category: "motivation",
      duration: "6 min read",
      rating: 4.6,
      description: "Simple yet powerful practices to maintain motivation and momentum in your personal growth journey.",
      tags: ["habits", "goals", "productivity"]
    },
    {
      id: 5,
      title: "The Science of Emotional Resilience",
      type: "video",
      category: "motivation",
      duration: "22 min",
      rating: 4.9,
      description: "Research-backed strategies for building mental strength and resilience in challenging times.",
      tags: ["psychology", "resilience", "growth"]
    },
    {
      id: 6,
      title: "Mindful Communication in Relationships",
      type: "podcast",
      category: "relationships",
      duration: "28 min",
      rating: 4.8,
      description: "Transform your relationships through mindful listening and empathetic communication techniques.",
      tags: ["communication", "empathy", "mindfulness"]
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === 'all' || resource.category === activeFilter;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950/40 px-6 py-20 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mb-8 shadow-2xl shadow-emerald-500/30 animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-6xl font-black text-transparent bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text mb-6 leading-tight">
            Resource Hub
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover curated mental health resources, expert guidance, and crisis support designed to empower your wellness journey
          </p>
        </div>

        {/* Crisis Support */}
        <CrisisSupport />

        {/* Search and Filter */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search resources, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-6 bg-gray-900/70 border border-emerald-500/30 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400/60 focus:bg-gray-900/90 backdrop-blur-xl transition-all shadow-xl"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    activeFilter === category.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/30 transform scale-105 border-2 border-emerald-400/50'
                      : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800/70 border-2 border-emerald-500/30 hover:border-emerald-500/50 hover:text-white backdrop-blur-xl'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid lg:grid-cols-3 gap-10 mb-20">
          {/* Main Resources */}
          <div className="lg:col-span-2">
            <div className="grid gap-8">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <ResourceSidebar />
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-500/20 via-green-500/15 to-teal-500/20 backdrop-blur-xl border border-emerald-400/40 rounded-3xl p-12 shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl mb-6">
                <Leaf className="w-8 h-8 text-emerald-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-200 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
                Our AI-powered recommendation engine analyzes your mood patterns, wellness goals, and preferences to suggest personalized resources that match your unique journey.
              </p>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 border border-emerald-400/20">
                Get Personalized Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ResourceHub;
