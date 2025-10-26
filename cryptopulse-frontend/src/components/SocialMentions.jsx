const SocialMentions = ({ mentions }) => {
  const getPlatformIcon = (platform) => {
    const icons = {
      Twitter: '🐦',
      Reddit: '🤖', 
      Instagram: '📸',
      TikTok: '🎵',
      YouTube: '📹'
    };
    return icons[platform] || '💬';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Negative': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  return (
    <div className="crypto-card">
      <h3 className="text-xl font-bold text-white mb-6">Social Media Insights</h3>
      
      <div className="space-y-4">
        {mentions.map((mention, index) => (
          <div 
            key={index}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getPlatformIcon(mention.platform)}</span>
                <span className="text-blue-400 font-semibold">{mention.platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs border ${getSentimentColor(mention.sentiment)}`}>
                  {mention.sentiment}
                </span>
                <span className="text-gray-400 text-sm">{mention.time}</span>
              </div>
            </div>
            
            <p className="text-gray-300 italic">"{mention.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMentions;
