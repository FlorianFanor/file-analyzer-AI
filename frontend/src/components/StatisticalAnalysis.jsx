import { TrendingUp, TrendingDown, AlertTriangle, BarChart3, Activity } from 'lucide-react';

export default function StatisticalAnalysis({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Statistical Analysis</h3>
        <p className="text-gray-500">No data available for analysis</p>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const anomalies = data.filter(d => d.anomaly === -1);
  
  // Basic statistics
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(sortedValues.length / 2)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Standard deviation
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of variation
  const cv = (stdDev / mean) * 100;
  
  // Skewness (measure of asymmetry)
  const skewness = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / values.length;
  
  // Kurtosis (measure of tail heaviness)
  const kurtosis = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / values.length - 3;
  
  // Quartiles
  const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
  const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
  const iqr = q3 - q1;
  
  // Anomaly rate
  const anomalyRate = (anomalies.length / data.length) * 100;
  
  // Trend analysis (simple linear regression slope)
  const n = values.length;
  const sumX = (n * (n - 1)) / 2; // Sum of indices 0, 1, 2, ..., n-1
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, index) => sum + index * val, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const isIncreasing = slope > 0;
  const trendStrength = Math.abs(slope) / stdDev; // Normalized trend strength
  
  // Recent volatility (last 20% of data)
  const recentCount = Math.max(10, Math.floor(values.length * 0.2));
  const recentValues = values.slice(-recentCount);
  const recentMean = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
  const recentVariance = recentValues.reduce((sum, val) => sum + Math.pow(val - recentMean, 2), 0) / recentValues.length;
  const recentStdDev = Math.sqrt(recentVariance);
  const volatilityChange = ((recentStdDev - stdDev) / stdDev) * 100;

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend = null }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-4 rounded-xl border border-${color}-200`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`text-sm font-medium text-${color}-800`}>{title}</h4>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div className={`text-2xl font-bold text-${color}-900 mb-1`}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </div>
      {subtitle && (
        <div className={`text-xs text-${color}-700 flex items-center`}>
          {trend && (
            <span className={`mr-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : ''}`}>
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
            </span>
          )}
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Statistical Analysis
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Mean Value"
          value={mean}
          subtitle={`Median: ${median.toFixed(2)}`}
          icon={Activity}
          color="blue"
        />
        
        <StatCard
          title="Standard Deviation"
          value={stdDev}
          subtitle={`CV: ${cv.toFixed(1)}%`}
          icon={BarChart3}
          color="purple"
        />
        
        <StatCard
          title="Data Range"
          value={range}
          subtitle={`${min.toFixed(2)} to ${max.toFixed(2)}`}
          icon={TrendingUp}
          color="green"
        />
        
        <StatCard
          title="Anomaly Rate"
          value={`${anomalyRate.toFixed(1)}%`}
          subtitle={`${anomalies.length} of ${data.length} points`}
          icon={AlertTriangle}
          color={anomalyRate > 10 ? "red" : anomalyRate > 5 ? "yellow" : "green"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">Distribution Metrics</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Quartile 1 (Q1):</span>
              <div className="font-semibold text-blue-600">{q1.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-600">Quartile 3 (Q3):</span>
              <div className="font-semibold text-blue-600">{q3.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-600">Interquartile Range:</span>
              <div className="font-semibold text-blue-600">{iqr.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-600">Sample Size:</span>
              <div className="font-semibold text-blue-600">{data.length}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Skewness:</span>
              <span className={`font-semibold ${Math.abs(skewness) > 1 ? 'text-orange-600' : 'text-green-600'}`}>
                {skewness.toFixed(3)} {Math.abs(skewness) > 1 ? '(High)' : '(Normal)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kurtosis:</span>
              <span className={`font-semibold ${Math.abs(kurtosis) > 1 ? 'text-orange-600' : 'text-green-600'}`}>
                {kurtosis.toFixed(3)} {Math.abs(kurtosis) > 1 ? '(High)' : '(Normal)'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">Trend Analysis</h4>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              {isIncreasing ? (
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className={`font-semibold ${isIncreasing ? 'text-green-700' : 'text-red-700'}`}>
                {isIncreasing ? 'Upward' : 'Downward'} Trend
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Slope: {slope.toFixed(4)} | Strength: {trendStrength.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Recent Volatility:</span>
              <span className={`font-semibold ${volatilityChange > 20 ? 'text-red-600' : volatilityChange < -20 ? 'text-green-600' : 'text-yellow-600'}`}>
                {volatilityChange > 0 ? '+' : ''}{volatilityChange.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Based on last {recentCount} data points
            </div>
          </div>

          {anomalies.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg">
              <h5 className="font-medium text-red-800 mb-1">Anomaly Insights</h5>
              <div className="text-sm text-red-700">
                <div>Severity: {anomalyRate > 15 ? 'High' : anomalyRate > 8 ? 'Medium' : 'Low'}</div>
                <div>Pattern: {anomalies.length > data.length * 0.1 ? 'Clustered' : 'Scattered'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
