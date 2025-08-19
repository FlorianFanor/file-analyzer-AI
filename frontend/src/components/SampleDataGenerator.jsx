import { useState } from 'react';
import { Play, Download, Shuffle, Database, Wand2 } from 'lucide-react';

export default function SampleDataGenerator({ onDataGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState({
    dataPoints: 200,
    pattern: 'mixed',
    noiseLevel: 0.1,
    anomalyRate: 0.08,
    trend: 'stable'
  });

  const generateSampleData = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const data = createSampleDataset(config);
      onDataGenerated(data);
      setIsGenerating(false);
    }, 1000);
  };

  const downloadSampleCSV = () => {
    const data = createSampleDataset(config);
    const csv = [
      ['timestamp', 'value'],
      ...data.map(item => [item.timestamp, item.value])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample-data-${config.pattern}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presets = [
    {
      name: 'E-commerce Sales',
      icon: '🛒',
      config: { dataPoints: 180, pattern: 'seasonal', noiseLevel: 0.15, anomalyRate: 0.05, trend: 'growing' },
      description: 'Daily sales data with seasonal patterns and growth trend'
    },
    {
      name: 'Server Metrics',
      icon: '💻',
      config: { dataPoints: 300, pattern: 'cyclical', noiseLevel: 0.08, anomalyRate: 0.12, trend: 'stable' },
      description: 'CPU usage with daily cycles and occasional spikes'
    },
    {
      name: 'Stock Market',
      icon: '📈',
      config: { dataPoints: 250, pattern: 'volatile', noiseLevel: 0.25, anomalyRate: 0.15, trend: 'volatile' },
      description: 'Stock price movements with high volatility'
    },
    {
      name: 'IoT Sensors',
      icon: '🌡️',
      config: { dataPoints: 400, pattern: 'smooth', noiseLevel: 0.05, anomalyRate: 0.03, trend: 'declining' },
      description: 'Temperature readings with minimal noise'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <Database className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Sample Data Generator</h3>
      </div>

      {/* Preset Templates */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Quick Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => setConfig(preset.config)}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition text-left"
            >
              <div className="flex items-center mb-1">
                <span className="text-lg mr-2">{preset.icon}</span>
                <span className="font-medium text-gray-800">{preset.name}</span>
              </div>
              <p className="text-sm text-gray-600">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Configuration */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-700 mb-4">Custom Configuration</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Points: {config.dataPoints}
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              value={config.dataPoints}
              onChange={(e) => setConfig({...config, dataPoints: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">50 - 1000 points</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pattern Type</label>
            <select
              value={config.pattern}
              onChange={(e) => setConfig({...config, pattern: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="linear">Linear</option>
              <option value="sinusoidal">Sinusoidal</option>
              <option value="seasonal">Seasonal</option>
              <option value="cyclical">Cyclical</option>
              <option value="volatile">Volatile</option>
              <option value="smooth">Smooth</option>
              <option value="mixed">Mixed Patterns</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Noise Level: {(config.noiseLevel * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={config.noiseLevel}
              onChange={(e) => setConfig({...config, noiseLevel: parseFloat(e.target.value)})}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">1% - 50% noise</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anomaly Rate: {(config.anomalyRate * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.01"
              max="0.3"
              step="0.01"
              value={config.anomalyRate}
              onChange={(e) => setConfig({...config, anomalyRate: parseFloat(e.target.value)})}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">1% - 30% anomalies</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trend</label>
            <select
              value={config.trend}
              onChange={(e) => setConfig({...config, trend: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="stable">Stable</option>
              <option value="growing">Growing</option>
              <option value="declining">Declining</option>
              <option value="volatile">Volatile</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setConfig({
                dataPoints: Math.floor(Math.random() * 450) + 100,
                pattern: ['linear', 'sinusoidal', 'seasonal', 'cyclical', 'volatile', 'smooth', 'mixed'][Math.floor(Math.random() * 7)],
                noiseLevel: Math.random() * 0.3 + 0.05,
                anomalyRate: Math.random() * 0.15 + 0.02,
                trend: ['stable', 'growing', 'declining', 'volatile'][Math.floor(Math.random() * 4)]
              })}
              className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center justify-center transition"
            >
              <Shuffle className="w-4 h-4 mr-1" />
              Randomize
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={generateSampleData}
            disabled={isGenerating}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium flex items-center justify-center transition"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Generate & Analyze
              </>
            )}
          </button>
          
          <button
            onClick={downloadSampleCSV}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Download CSV
          </button>
        </div>

        {/* Preview */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>Preview:</strong> Will generate {config.dataPoints} data points with {config.pattern} pattern, 
            {(config.noiseLevel * 100).toFixed(0)}% noise, {(config.anomalyRate * 100).toFixed(0)}% anomalies, 
            and {config.trend} trend.
          </div>
        </div>
      </div>
    </div>
  );
}

// Data generation functions
function createSampleDataset(config) {
  const { dataPoints, pattern, noiseLevel, anomalyRate, trend } = config;
  const data = [];
  const baseValue = 100;
  const now = new Date();
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(now.getTime() - (dataPoints - i) * 3600000); // Hourly data going back
    let value = baseValue;
    
    // Apply pattern
    switch (pattern) {
      case 'linear':
        value += i * 0.5;
        break;
      case 'sinusoidal':
        value += Math.sin(i * 0.2) * 20;
        break;
      case 'seasonal':
        value += Math.sin(i * 0.1) * 30 + Math.sin(i * 0.02) * 50;
        break;
      case 'cyclical':
        value += Math.sin(i * 0.3) * 15 + Math.cos(i * 0.1) * 25;
        break;
      case 'volatile':
        value += (Math.random() - 0.5) * 80;
        break;
      case 'smooth':
        value += Math.sin(i * 0.05) * 10;
        break;
      case 'mixed':
        value += Math.sin(i * 0.1) * 20 + Math.sin(i * 0.3) * 10 + (Math.random() - 0.5) * 15;
        break;
    }
    
    // Apply trend
    switch (trend) {
      case 'growing':
        value += i * 0.3;
        break;
      case 'declining':
        value -= i * 0.2;
        break;
      case 'volatile':
        value += (Math.random() - 0.5) * i * 0.1;
        break;
    }
    
    // Add noise
    value += (Math.random() - 0.5) * value * noiseLevel;
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value) // Ensure non-negative values
    });
  }
  
  // Add anomalies
  const anomalyCount = Math.floor(dataPoints * anomalyRate);
  const anomalyIndices = new Set();
  
  while (anomalyIndices.size < anomalyCount) {
    anomalyIndices.add(Math.floor(Math.random() * dataPoints));
  }
  
  anomalyIndices.forEach(index => {
    const multiplier = Math.random() > 0.5 ? 2 + Math.random() : 0.3 + Math.random() * 0.4;
    data[index].value *= multiplier;
  });
  
  // Calculate deviations and anomaly flags (simulate backend processing)
  const values = data.map(d => d.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  
  return data.map((item, index) => {
    const rollingWindow = 10;
    const start = Math.max(0, index - rollingWindow + 1);
    const windowValues = values.slice(start, index + 1);
    const rollingMean = windowValues.reduce((sum, val) => sum + val, 0) / windowValues.length;
    const deviation = Math.abs(item.value - rollingMean);
    
    // Simple anomaly detection based on deviation
    const isAnomaly = deviation > stdDev * 1.5;
    
    return {
      ...item,
      anomaly: isAnomaly ? -1 : 1,
      deviation: deviation
    };
  });
}
