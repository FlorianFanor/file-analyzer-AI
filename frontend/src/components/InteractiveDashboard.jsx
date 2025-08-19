import { useState, useMemo } from 'react';
import { Calendar, Filter, Download, RefreshCw, Eye } from 'lucide-react';
import { format, parseISO, isWithinInterval, subDays, subHours } from 'date-fns';

export default function InteractiveDashboard({ data, onFilterChange, onExport }) {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    valueRange: { min: '', max: '' },
    showAnomalies: true,
    showNormal: true,
    sortBy: 'timestamp',
    sortOrder: 'asc'
  });
  
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Generate date range options based on data
  const dateRangeOptions = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    return [
      { value: 'all', label: 'All Time', count: data.length },
      { value: 'last24h', label: 'Last 24 Hours', count: 0 },
      { value: 'last7d', label: 'Last 7 Days', count: 0 },
      { value: 'last30d', label: 'Last 30 Days', count: 0 },
      { value: 'custom', label: 'Custom Range', count: 0 }
    ];
  }, [data]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let filtered = [...data];
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'last24h':
          startDate = subHours(now, 24);
          break;
        case 'last7d':
          startDate = subDays(now, 7);
          break;
        case 'last30d':
          startDate = subDays(now, 30);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(item => {
          try {
            const itemDate = parseISO(item.timestamp);
            return isWithinInterval(itemDate, { start: startDate, end: now });
          } catch {
            return true; // Keep items with invalid dates
          }
        });
      }
    }
    
    // Value range filter
    if (filters.valueRange.min !== '') {
      filtered = filtered.filter(item => item.value >= parseFloat(filters.valueRange.min));
    }
    if (filters.valueRange.max !== '') {
      filtered = filtered.filter(item => item.value <= parseFloat(filters.valueRange.max));
    }
    
    // Anomaly filter
    if (!filters.showAnomalies) {
      filtered = filtered.filter(item => item.anomaly !== -1);
    }
    if (!filters.showNormal) {
      filtered = filtered.filter(item => item.anomaly === -1);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (filters.sortBy) {
        case 'value':
          aVal = a.value;
          bVal = b.value;
          break;
        case 'deviation':
          aVal = a.deviation || 0;
          bVal = b.deviation || 0;
          break;
        default:
          aVal = a.timestamp;
          bVal = b.timestamp;
      }
      
      if (filters.sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    
    return filtered;
  }, [data, filters]);

  // Statistics for filtered data
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const values = filteredData.map(d => d.value);
    const anomalies = filteredData.filter(d => d.anomaly === -1);
    
    return {
      total: filteredData.length,
      anomalies: anomalies.length,
      anomalyRate: (anomalies.length / filteredData.length * 100).toFixed(1),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      avg: (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2)
    };
  }, [filteredData]);

  // Notify parent component of filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(filteredData);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    handleFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'all',
      valueRange: { min: '', max: '' },
      showAnomalies: true,
      showNormal: true,
      sortBy: 'timestamp',
      sortOrder: 'asc'
    };
    handleFilterChange(defaultFilters);
  };

  const exportData = () => {
    if (onExport) {
      onExport(filteredData);
    } else {
      // Default export to CSV
      const csv = [
        ['Timestamp', 'Value', 'Anomaly', 'Deviation'],
        ...filteredData.map(item => [
          item.timestamp,
          item.value,
          item.anomaly === -1 ? 'Yes' : 'No',
          item.deviation || ''
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-export-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Interactive Data Dashboard
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`px-3 py-1 rounded-lg text-sm flex items-center transition ${
                isFilterPanelOpen ? 'bg-white text-blue-600' : 'bg-blue-500 hover:bg-blue-400'
              }`}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </button>
            <button
              onClick={exportData}
              className="px-3 py-1 bg-green-500 hover:bg-green-400 rounded-lg text-sm flex items-center transition"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{stats.total}</div>
              <div className="text-blue-200">Total Points</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.anomalies}</div>
              <div className="text-blue-200">Anomalies</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.anomalyRate}%</div>
              <div className="text-blue-200">Anomaly Rate</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.avg}</div>
              <div className="text-blue-200">Average</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.min}</div>
              <div className="text-blue-200">Minimum</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.max}</div>
              <div className="text-blue-200">Maximum</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterPanelOpen && (
        <div className="border-b bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilter('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Range Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.valueRange.min}
                  onChange={(e) => updateFilter('valueRange', { ...filters.valueRange, min: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.valueRange.max}
                  onChange={(e) => updateFilter('valueRange', { ...filters.valueRange, max: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Visibility Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Show</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.showNormal}
                    onChange={(e) => updateFilter('showNormal', e.target.checked)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm">Normal Points</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.showAnomalies}
                    onChange={(e) => updateFilter('showAnomalies', e.target.checked)}
                    className="mr-2 text-red-600"
                  />
                  <span className="text-sm">Anomalies</span>
                </label>
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="space-y-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="timestamp">Timestamp</option>
                  <option value="value">Value</option>
                  <option value="deviation">Deviation</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => updateFilter('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset Filters
            </button>
            <div className="text-sm text-gray-600">
              Showing {filteredData.length} of {data?.length || 0} data points
            </div>
          </div>
        </div>
      )}

      {/* Data Preview Table */}
      <div className="p-4">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Timestamp</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Value</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Deviation</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 100).map((item, index) => (
                <tr key={index} className={`border-t hover:bg-gray-50 ${item.anomaly === -1 ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-2 text-gray-900">
                    {format(parseISO(item.timestamp || new Date().toISOString()), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-4 py-2 font-medium">{item.value.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.anomaly === -1 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.anomaly === -1 ? 'Anomaly' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {item.deviation ? item.deviation.toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length > 100 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Showing first 100 rows of {filteredData.length} results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
