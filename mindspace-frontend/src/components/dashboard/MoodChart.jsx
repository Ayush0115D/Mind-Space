import React, { memo, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodChart = memo(({ moodData = [] }) => {
  // ✅ Preprocess data (format dates once)
  const processedData = useMemo(() => {
    return moodData.map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tooltipDate: new Date(item.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    }));
  }, [moodData]);

  // ✅ Optional downsampling for very large datasets
  const finalData = useMemo(() => {
    if (processedData.length > 200) {
      return processedData.filter((_, i) => i % 2 === 0);
    }
    return processedData;
  }, [processedData]);

  // ✅ Chart config (always declared, never conditional)
  const chartConfig = useMemo(() => ({
    gradient: {
      id: "moodGradient",
      x1: "0",
      y1: "0", 
      x2: "0",
      y2: "1"
    },
    tooltipStyle: {
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      borderRadius: '12px',
      color: '#f3f4f6',
      boxShadow: '0 6px 10px -3px rgba(0, 0, 0, 0.25)'
    }
  }), []);

  // ✅ Memoize chart rendering
  const renderChart = useMemo(() => (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={finalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient {...chartConfig.gradient}>
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        
        <XAxis
          dataKey="formattedDate"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={{ stroke: '#4b5563' }}
          tickLine={{ stroke: '#4b5563' }}
        />
        
        <YAxis
          domain={[1, 5]}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={{ stroke: '#4b5563' }}
          tickLine={{ stroke: '#4b5563' }}
        />
        
        <Tooltip
          contentStyle={chartConfig.tooltipStyle}
          labelFormatter={(_, entry) => entry?.payload?.tooltipDate}
          formatter={(value) => [value, 'Mood Level']}
          labelStyle={{ color: '#d1d5db', fontWeight: 'bold' }}
        />
        
        <Area
          type="monotone"
          dataKey="mood"
          stroke="#8b5cf6"
          fill="url(#moodGradient)"
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#a855f7' }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [finalData, chartConfig]);

  // ✅ Conditional return AFTER hooks
  if (moodData.length === 0) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <span>Mood Trend Analysis</span>
        </h3>
        <div className="text-center py-16">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No mood data available</p>
          <p className="text-gray-500 text-sm mt-2">Track your mood for a few days to see trends and patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
        <TrendingUp className="w-6 h-6 text-purple-400" />
        <span>Mood Trend Analysis</span>
        <span className="ml-auto text-sm font-normal text-gray-400">
          Last {moodData.length} days
        </span>
      </h3>
      {renderChart}
    </div>
  );
});

MoodChart.displayName = 'MoodChart';

export default MoodChart;
