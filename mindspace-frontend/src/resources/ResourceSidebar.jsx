const ResourceSidebar = () => {
  const therapyPlatforms = [
    { name: "BetterHelp", description: "Professional therapy online", rating: 4.5, users: "2M+" },
    { name: "Talkspace", description: "Text & video therapy", rating: 4.3, users: "1M+" },
    { name: "Psychology Today", description: "Find local therapists", rating: 4.7, users: "500K+" }
  ];

  return (
    <div className="space-y-8">
      {/* Therapy Platforms */}
      <div className="bg-gray-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl shadow-emerald-900/10">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl mr-4">
            <Brain className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Therapy Platforms</h3>
            <p className="text-emerald-300/80 text-sm">Professional mental health support</p>
          </div>
        </div>
        <div className="space-y-5">
          {therapyPlatforms.map((platform, index) => (
            <div key={index} className="bg-gray-800/50 border border-emerald-500/20 rounded-2xl p-6 hover:bg-gray-800/70 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white text-lg group-hover:text-emerald-200 transition-colors">
                  {platform.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-yellow-300 font-bold">{platform.rating}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-3 leading-relaxed">{platform.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 font-semibold">{platform.users} users</span>
                <ExternalLink className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/40 rounded-3xl p-8 shadow-2xl shadow-emerald-900/20">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl mr-4">
            <Leaf className="w-7 h-7 text-emerald-200" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
            <p className="text-emerald-200/80 text-sm">Personalized for your journey</p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-gray-900/60 border border-emerald-400/30 rounded-2xl p-6 hover:border-emerald-400/50 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 text-emerald-300 mr-3" />
              <h4 className="font-bold text-emerald-200 text-lg">Based on your goals</h4>
            </div>
            <p className="text-gray-200 mb-4 leading-relaxed">Resources about stress management and work-life balance tailored to your recent activity</p>
            <button className="flex items-center text-emerald-300 hover:text-emerald-200 font-semibold transition-colors group-hover:translate-x-1 transition-transform">
              <span>View recommendations</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="bg-gray-900/60 border border-teal-400/30 rounded-2xl p-6 hover:border-teal-400/50 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-teal-500/10 transition-all cursor-pointer group">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 text-teal-300 mr-3" />
              <h4 className="font-bold text-teal-200 text-lg">Trending this week</h4>
            </div>
            <p className="text-gray-200 mb-4 leading-relaxed">Most popular content about building resilience and emotional intelligence</p>
            <button className="flex items-center text-teal-300 hover:text-teal-200 font-semibold transition-colors group-hover:translate-x-1 transition-transform">
              <span>Explore trending</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResourceSidebar;