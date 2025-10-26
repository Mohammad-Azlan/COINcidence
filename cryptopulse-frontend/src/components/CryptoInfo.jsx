const CryptoInfo = ({ data }) => {
  const isPositive = data.change24h > 0;

  return (
    <div className="crypto-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{data.name}</h2>
          <p className="text-gray-400 text-lg">{data.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">
            ${data.price.toLocaleString()}
          </p>
          <p className={`text-lg font-semibold ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{data.change24h}% (24h)
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
        <div>
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-white font-semibold text-lg">${data.marketCap}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Sentiment</p>
          <p className={`font-semibold text-lg ${
            data.sentiment.overall === 'Positive' ? 'text-green-400' :
            data.sentiment.overall === 'Negative' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {data.sentiment.overall} ({data.sentiment.confidence}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoInfo;
