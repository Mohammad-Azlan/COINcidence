const PredictionCard = ({ prediction }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'bullish': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'bearish': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '📊';
    }
  };

  return (
    <div className={`crypto-card border-2 ${getTypeColor(prediction.type)}`}>
      <div className="text-center">
        <div className="text-4xl mb-4">{getIcon(prediction.type)}</div>
        
        <h3 className="text-xl font-bold text-white mb-4">AI Prediction</h3>
        
        <p className="text-lg font-semibold mb-4 text-white">
          {prediction.text}
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-gray-400">Confidence:</span>
          <span className="text-2xl font-bold text-white">{prediction.confidence}%</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              prediction.type === 'bullish' ? 'bg-green-500' :
              prediction.type === 'bearish' ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${prediction.confidence}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-400 mt-4">
          * This is an AI prediction based on sentiment analysis and should not be considered financial advice.
        </p>
      </div>
    </div>
  );
};

export default PredictionCard;
