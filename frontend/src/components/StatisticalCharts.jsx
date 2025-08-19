import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { useState } from 'react';

export function HistogramChart({ data, title = "Value Distribution" }) {
  // Create histogram bins
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
  const binSize = (max - min) / binCount;
  
  const bins = Array.from({ length: binCount }, (_, i) => ({
    range: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
    count: 0,
    midpoint: min + (i + 0.5) * binSize
  }));
  
  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
    bins[binIndex].count++;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={bins}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="range" 
            angle={-45}
            textAnchor="end"
            height={60}
            fontSize={12}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [value, 'Frequency']}
            labelFormatter={(label) => `Range: ${label}`}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScatterPlotChart({ data, title = "Anomaly Scatter Plot" }) {
  const scatterData = data.map((d, index) => ({
    index,
    value: d.value,
    deviation: d.deviation || 0,
    isAnomaly: d.anomaly === -1,
    timestamp: d.timestamp
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={scatterData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="index" 
            name="Data Point"
            label={{ value: 'Data Point Index', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            dataKey="value" 
            name="Value"
            label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [value, name]}
            labelFormatter={(label) => `Point ${label}`}
          />
          <Scatter dataKey="value" name="Normal Points">
            {scatterData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isAnomaly ? "#ef4444" : "#3b82f6"} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BoxPlotVisualization({ data, title = "Statistical Distribution" }) {
  const values = data.map(d => d.value).sort((a, b) => a - b);
  const q1 = values[Math.floor(values.length * 0.25)];
  const median = values[Math.floor(values.length * 0.5)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const min = values[0];
  const max = values[values.length - 1];
  const iqr = q3 - q1;
  const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
  const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
  
  const outliers = values.filter(v => v < lowerWhisker || v > upperWhisker);

  // Create a simple bar chart representation of the box plot
  const boxPlotData = [
    { name: 'Min', value: min, type: 'whisker' },
    { name: 'Q1', value: q1, type: 'quartile' },
    { name: 'Median', value: median, type: 'median' },
    { name: 'Q3', value: q3, type: 'quartile' },
    { name: 'Max', value: max, type: 'whisker' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-4">
        {/* Visual representation */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={boxPlotData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip formatter={(value, name) => [value.toFixed(2), name]} />
            <Bar dataKey="value">
              {boxPlotData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.type === 'median' ? '#ef4444' : 
                    entry.type === 'quartile' ? '#3b82f6' : 
                    '#9ca3af'
                  } 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Statistical summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{min.toFixed(2)}</div>
            <div className="text-gray-600">Min</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{q1.toFixed(2)}</div>
            <div className="text-gray-600">Q1</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{median.toFixed(2)}</div>
            <div className="text-gray-600">Median</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{q3.toFixed(2)}</div>
            <div className="text-gray-600">Q3</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{max.toFixed(2)}</div>
            <div className="text-gray-600">Max</div>
          </div>
        </div>
        
        {outliers.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Outliers Detected: {outliers.length}</h4>
            <div className="text-sm text-red-700">
              {outliers.slice(0, 10).map((val, i) => (
                <span key={`outlier-${i}`} className="inline-block bg-red-100 px-2 py-1 rounded mr-2 mb-1">
                  {val.toFixed(2)}
                </span>
              ))}
              {outliers.length > 10 && <span className="text-red-600">... and {outliers.length - 10} more</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TrendAnalysis({ data, title = "Trend Analysis" }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  
  // Calculate moving averages
  const periods = [5, 10, 20];
  const analysisData = data.map((item, index) => {
    const result = { ...item, index };
    
    periods.forEach(period => {
      if (index >= period - 1) {
        const slice = data.slice(Math.max(0, index - period + 1), index + 1);
        const avg = slice.reduce((sum, d) => sum + d.value, 0) / slice.length;
        result[`ma${period}`] = avg;
      }
    });
    
    return result;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-1 border rounded-lg text-sm"
        >
          <option value="all">All Data</option>
          <option value="recent">Recent 50 Points</option>
          <option value="latest">Latest 20 Points</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analysisData.slice(
          selectedPeriod === 'recent' ? -50 : 
          selectedPeriod === 'latest' ? -20 : 0
        )}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" name="Value" />
          <Bar dataKey="ma5" fill="#10b981" name="MA5" opacity={0.7} />
          <Bar dataKey="ma10" fill="#f59e0b" name="MA10" opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
