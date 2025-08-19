import { useState } from "react";
import { BarChart3, TrendingUp, Brain, Database, FileText, Settings } from 'lucide-react';
import GraphWithAnomalies from "./components/GraphWithAnomalies";
import AnomalySummary from "./components/AnomalySummary";
import AiChatBox from "./components/AiChatBox";
import { HistogramChart, ScatterPlotChart, BoxPlotVisualization, TrendAnalysis } from "./components/StatisticalCharts";
import StatisticalAnalysis from "./components/StatisticalAnalysis";
import DataInsights from "./components/DataInsights";
import InteractiveDashboard from "./components/InteractiveDashboard";
import SampleDataGenerator from "./components/SampleDataGenerator";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading file...");
    try {
      const res = await fetch("http://localhost:8000/upload-excel", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.error) {
        setStatus("Error: " + result.error);
      } else {
        setData(result.data);
        setFilteredData(result.data);
        setStatus(`${result.data.length} data points loaded.`);
        setActiveTab("overview");
      }
    } catch {
      setStatus("Connection error.");
    }
  };

  const handleSampleDataGenerated = (sampleData) => {
    setData(sampleData);
    setFilteredData(sampleData);
    setStatus(`${sampleData.length} sample data points generated.`);
    setActiveTab("overview");
  };

  const handleFilterChange = (newFilteredData) => {
    setFilteredData(newFilteredData);
  };

  const currentData = filteredData.length > 0 ? filteredData : data;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "dashboard", label: "Interactive", icon: Database },
    { id: "chat", label: "AI Assistant", icon: FileText },
    { id: "settings", label: "Data Source", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Data Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">AI-powered anomaly detection and statistical analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {data.length > 0 && `${currentData.length} / ${data.length} data points`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Data Source Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Your Data</h2>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Upload and Analyze
                </button>

                {status && (
                  <div className={`p-3 rounded-lg ${
                    status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {status}
                  </div>
                )}
              </div>
            </div>

            <SampleDataGenerator onDataGenerated={handleSampleDataGenerated} />
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && data.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Time Series Overview</h3>
                <GraphWithAnomalies data={currentData} />
              </div>
              
              <div className="space-y-6">
                <AnomalySummary data={currentData} />
                <StatisticalAnalysis data={currentData} />
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && data.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HistogramChart data={currentData} />
              <ScatterPlotChart data={currentData} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BoxPlotVisualization data={currentData} />
              <TrendAnalysis data={currentData} />
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === "insights" && data.length > 0 && (
          <div className="space-y-6">
            <DataInsights data={currentData} />
          </div>
        )}

        {/* Interactive Dashboard Tab */}
        {activeTab === "dashboard" && data.length > 0 && (
          <div className="space-y-6">
            <InteractiveDashboard 
              data={data} 
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === "chat" && data.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <AiChatBox />
          </div>
        )}

        {/* Empty State */}
        {data.length === 0 && activeTab !== "settings" && (
          <div className="text-center py-16">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-6">Upload your data or generate sample data to get started</p>
            <button
              onClick={() => setActiveTab("settings")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Go to Data Source
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
