import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SentimentChart = ({ data }) => {
  if (!data) return null;

  // Use the raw average sentiment score
  const combinedScore = data.average_sentiment || 0;
  
  // Simplified logic to create a 3-part distribution from a single score (-1 to 1)
  let positive = 0;
  let negative = 0;
  let neutral = 100;
  
  const MAGNIFICATION_FACTOR = 1.5; // Make sentiment more visually pronounced
  
  if (combinedScore > 0.05) {
    // If positive, assign more to positive (max 100)
    positive = Math.min(100, Math.round(combinedScore * 100 * MAGNIFICATION_FACTOR)); 
    neutral = Math.max(0, 100 - positive);
    negative = 0; // Explicitly set negative to 0
  } else if (combinedScore < -0.05) {
    // If negative, assign more to negative (max 100)
    negative = Math.min(100, Math.round(Math.abs(combinedScore) * 100 * MAGNIFICATION_FACTOR));
    neutral = Math.max(0, 100 - negative);
    positive = 0; // Explicitly set positive to 0
  } else {
    // Mostly neutral
    neutral = 100;
  }
  
  // Ensure the total is exactly 100 (for safety)
  if (positive + negative + neutral !== 100) {
      neutral = 100 - positive - negative;
  }
  
  
  const chartData = [
    { name: 'Positive', value: positive, color: '#10B981' },
    { name: 'Negative', value: negative, color: '#EF4444' },
    { name: 'Neutral', value: neutral, color: '#6B7280' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{entry.name}</p>
          <p className="text-blue-400">{entry.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="crypto-card">
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        Sentiment Distribution
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{color: '#fff'}}
              formatter={(value, entry) => (
                <span style={{color: entry.color}}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Overall Confidence:{' '}
          <span className="text-white font-semibold">
            {(data.confidence * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default SentimentChart;