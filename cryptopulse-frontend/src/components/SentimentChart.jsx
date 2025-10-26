import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SentimentChart = ({ data }) => {
  const chartData = [
    { name: 'Positive', value: data.distribution.positive, color: '#10B981' },
    { name: 'Negative', value: data.distribution.negative, color: '#EF4444' },
    { name: 'Neutral', value: data.distribution.neutral, color: '#6B7280' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{payload.name}</p>
          <p className="text-blue-400">{payload.value}%</p>
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
          Overall Confidence: <span className="text-white font-semibold">{data.confidence}%</span>
        </p>
      </div>
    </div>
  );
};

export default SentimentChart;
