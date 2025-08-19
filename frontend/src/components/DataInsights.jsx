import { Brain, Lightbulb, Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function DataInsights({ data }) {
  const [selectedInsight, setSelectedInsight] = useState('patterns');

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Data Insights</h3>
        <p className="text-gray-500">No data available for insights</p>
      </div>
    );
  }

  // Generate insights
  const generateInsights = () => {
    const values = data.map(d => d.value);
    const anomalies = data.filter(d => d.anomaly === -1);
    const anomalyValues = anomalies.map(a => a.value);
    
    const insights = {
      patterns: [],
      anomalies: [],
      trends: [],
      recommendations: []
    };

    // Pattern analysis
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    // Check for cyclical patterns
    const periods = [7, 14, 30]; // Check for weekly, bi-weekly, monthly patterns
    periods.forEach(period => {
      if (data.length >= period * 2) {
        const correlations = [];
        for (let lag = 1; lag <= period; lag++) {
          const correlation = calculateCorrelation(
            values.slice(0, -lag),
            values.slice(lag)
          );
          correlations.push({ lag, correlation });
        }
        const maxCorr = Math.max(...correlations.map(c => Math.abs(c.correlation)));
        if (maxCorr > 0.3) {
          const bestLag = correlations.find(c => Math.abs(c.correlation) === maxCorr);
          insights.patterns.push({
            type: 'cyclical',
            description: `Potential ${period}-point cyclical pattern detected (correlation: ${(maxCorr * 100).toFixed(1)}%)`,
            confidence: maxCorr > 0.5 ? 'High' : 'Medium',
            lag: bestLag.lag
          });
        }
      }
    });

    // Volatility clustering
    const volatilityWindow = 10;
    let highVolatilityClusters = 0;
    for (let i = volatilityWindow; i < values.length - volatilityWindow; i++) {
      const window = values.slice(i - volatilityWindow, i + volatilityWindow);
      const windowStd = Math.sqrt(window.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / window.length);
      if (windowStd > stdDev * 1.5) {
        highVolatilityClusters++;
      }
    }
    
    if (highVolatilityClusters > 0) {
      insights.patterns.push({
        type: 'volatility',
        description: `${highVolatilityClusters} high-volatility clusters detected`,
        confidence: 'Medium',
        impact: highVolatilityClusters > 5 ? 'High' : 'Low'
      });
    }

    // Anomaly analysis
    if (anomalies.length > 0) {
      const anomalyMean = anomalyValues.reduce((sum, val) => sum + val, 0) / anomalyValues.length;
      const isAnomalyHigh = anomalyMean > mean;
      
      insights.anomalies.push({
        type: 'direction',
        description: `Anomalies tend to be ${isAnomalyHigh ? 'above' : 'below'} normal values`,
        severity: Math.abs(anomalyMean - mean) / stdDev > 2 ? 'High' : 'Medium'
      });

      // Time-based anomaly clustering
      const anomalyIndices = anomalies.map((_, i) => data.findIndex(d => d === anomalies[i]));
      const clusters = findClusters(anomalyIndices, 5);
      if (clusters.length > 1) {
        insights.anomalies.push({
          type: 'clustering',
          description: `Anomalies appear in ${clusters.length} distinct clusters`,
          pattern: 'temporal'
        });
      }
    }

    // Trend analysis
    const recentData = values.slice(-Math.min(50, Math.floor(values.length * 0.3)));
    const recentMean = recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
    const historicalMean = values.slice(0, -recentData.length).reduce((sum, val) => sum + val, 0) / (values.length - recentData.length);
    
    if (recentData.length > 0 && historicalMean) {
      const changePercent = ((recentMean - historicalMean) / historicalMean) * 100;
      if (Math.abs(changePercent) > 5) {
        insights.trends.push({
          type: 'recent_shift',
          description: `Recent values are ${changePercent > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(changePercent).toFixed(1)}%`,
          direction: changePercent > 0 ? 'up' : 'down',
          magnitude: Math.abs(changePercent)
        });
      }
    }

    // Generate recommendations
    const anomalyRate = (anomalies.length / data.length) * 100;
    if (anomalyRate > 10) {
      insights.recommendations.push({
        priority: 'High',
        action: 'Investigate Root Cause',
        description: 'High anomaly rate suggests systematic issues. Review data collection process.'
      });
    }

    if (stdDev / mean > 0.3) {
      insights.recommendations.push({
        priority: 'Medium',
        action: 'Stabilize Process',
        description: 'High variability detected. Consider implementing control measures.'
      });
    }

    if (insights.patterns.some(p => p.type === 'cyclical')) {
      insights.recommendations.push({
        priority: 'Low',
        action: 'Leverage Patterns',
        description: 'Cyclical patterns detected. Consider predictive modeling for forecasting.'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const InsightCard = ({ icon: Icon, title, items, color = "blue" }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-4 rounded-xl border border-${color}-200`}>
      <div className="flex items-center mb-3">
        <Icon className={`w-5 h-5 text-${color}-600 mr-2`} />
        <h4 className={`font-semibold text-${color}-800`}>{title}</h4>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className={`text-sm text-${color}-600`}>No significant {title.toLowerCase()} detected</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className={`p-2 bg-white rounded-lg border border-${color}-200`}>
              <div className="text-sm font-medium text-gray-800">{item.description}</div>
              {item.confidence && (
                <div className={`text-xs text-${color}-600 mt-1`}>
                  Confidence: {item.confidence}
                </div>
              )}
              {item.severity && (
                <div className={`text-xs ${item.severity === 'High' ? 'text-red-600' : 'text-yellow-600'} mt-1`}>
                  Severity: {item.severity}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const RecommendationCard = ({ item }) => (
    <div className={`p-3 rounded-lg border-l-4 ${
      item.priority === 'High' ? 'border-red-500 bg-red-50' :
      item.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
      'border-blue-500 bg-blue-50'
    }`}>
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-medium text-gray-800">{item.action}</h5>
        <span className={`text-xs px-2 py-1 rounded ${
          item.priority === 'High' ? 'bg-red-200 text-red-800' :
          item.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
          'bg-blue-200 text-blue-800'
        }`}>
          {item.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI-Powered Data Insights
        </h3>
        
        <div className="flex space-x-2">
          {[
            { key: 'patterns', label: 'Patterns', icon: Target },
            { key: 'anomalies', label: 'Anomalies', icon: Zap },
            { key: 'trends', label: 'Trends', icon: TrendingUp },
            { key: 'recommendations', label: 'Actions', icon: Lightbulb }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedInsight(key)}
              className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                selectedInsight === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {selectedInsight === 'patterns' && (
        <InsightCard
          icon={Target}
          title="Data Patterns"
          items={insights.patterns}
          color="purple"
        />
      )}

      {selectedInsight === 'anomalies' && (
        <InsightCard
          icon={Zap}
          title="Anomaly Analysis"
          items={insights.anomalies}
          color="red"
        />
      )}

      {selectedInsight === 'trends' && (
        <InsightCard
          icon={TrendingUp}
          title="Trend Analysis"
          items={insights.trends}
          color="green"
        />
      )}

      {selectedInsight === 'recommendations' && (
        <div>
          <div className="flex items-center mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
            <h4 className="font-semibold text-gray-800">Actionable Recommendations</h4>
          </div>
          <div className="space-y-3">
            {insights.recommendations.length === 0 ? (
              <p className="text-sm text-gray-600">No specific recommendations at this time</p>
            ) : (
              insights.recommendations.map((item, index) => (
                <RecommendationCard key={index} item={item} />
              ))
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center mb-2">
          <Clock className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Analysis Summary</span>
        </div>
        <div className="text-sm text-blue-700">
          Analyzed {data.length} data points • {insights.patterns.length} patterns • {insights.anomalies.length} anomaly insights • {insights.trends.length} trends • {insights.recommendations.length} recommendations
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  
  const sumX = x.slice(0, n).reduce((sum, val) => sum + val, 0);
  const sumY = y.slice(0, n).reduce((sum, val) => sum + val, 0);
  const sumXY = x.slice(0, n).reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.slice(0, n).reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function findClusters(indices, maxGap) {
  const clusters = [];
  let currentCluster = [indices[0]];
  
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] - indices[i-1] <= maxGap) {
      currentCluster.push(indices[i]);
    } else {
      clusters.push(currentCluster);
      currentCluster = [indices[i]];
    }
  }
  clusters.push(currentCluster);
  
  return clusters.filter(cluster => cluster.length > 1);
}
