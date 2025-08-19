# 🚀 Advanced Data Analytics Dashboard

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116.0-green)
![Python](https://img.shields.io/badge/Python-3.13+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **A professional-grade, AI-powered data analytics platform for time series analysis, anomaly detection, and statistical insights - completely free and open source!**

## ✨ Features

### 🎯 **Multi-Tab Dashboard Interface**
- **Overview**: Main time series visualization and anomaly summary
- **Analytics**: Advanced statistical charts (histogram, scatter plot, box plot, trend analysis)
- **AI Insights**: Intelligent pattern detection and actionable recommendations
- **Interactive**: Data filtering, sorting, and exploration tools
- **AI Assistant**: Natural language chat about your data
- **Data Source**: File upload and sample data generation

### 📊 **Advanced Visualizations**
- **Time Series Charts**: Interactive line charts with anomaly highlighting
- **Histogram Analysis**: Data distribution patterns and skewness detection
- **Scatter Plots**: 2D anomaly visualization with color coding
- **Box Plots**: Statistical distribution with outlier identification
- **Trend Analysis**: Moving averages and pattern recognition

### 🧠 **AI-Powered Insights**
- **Pattern Detection**: Cyclical, seasonal, and volatility patterns
- **Anomaly Analysis**: Direction, clustering, and severity assessment
- **Smart Recommendations**: Prioritized, actionable insights
- **Natural Language Chat**: Ask questions about your data in plain English

### 🎛️ **Interactive Features**
- **Advanced Filtering**: Date ranges, value constraints, anomaly types
- **Real-time Statistics**: Live metrics as you filter
- **Data Export**: CSV download with filtered datasets
- **Sample Data Generator**: 4+ realistic templates with customization

### 🔬 **Statistical Analysis**
- **Core Statistics**: Mean, median, standard deviation, skewness, kurtosis
- **Advanced Metrics**: Trend analysis, volatility measurement, correlation
- **Distribution Analysis**: Quartiles, outliers, normality testing
- **Performance Indicators**: Data quality and anomaly rates

## 🖥️ **Screenshots**

### Dashboard Overview
![Overview Tab](./docs/screenshots/overview.png)

### Advanced Analytics
![Analytics Tab](./docs/screenshots/analytics.png)

### AI Insights
![AI Insights Tab](./docs/screenshots/insights.png)

## 🚀 **Quick Start**

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/advanced-analytics-dashboard.git
cd advanced-analytics-dashboard
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start the Application

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 5. Access the Dashboard
Open your browser and navigate to: `http://localhost:5173`

## 📁 **Project Structure**

```
advanced-analytics-dashboard/
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Dashboard components
│   │   │   ├── AiChatBox.jsx
│   │   │   ├── StatisticalCharts.jsx
│   │   │   ├── DataInsights.jsx
│   │   │   ├── InteractiveDashboard.jsx
│   │   │   └── ...
│   │   ├── App.jsx           # Main application
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                   # FastAPI backend
│   ├── main.py               # API endpoints
│   ├── requirements.txt      # Python dependencies
│   └── venv/                 # Virtual environment
├── sample_data_ecommerce.csv # Sample dataset
├── COMPLETE_DASHBOARD_GUIDE.md
└── README.md
```

## 🛠️ **Technology Stack**

### Frontend
- **React 19**: Latest stable version with hooks
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Modern, responsive styling
- **Recharts**: Advanced charting library
- **Chart.js**: Additional visualization capabilities
- **Lucide React**: Beautiful, consistent icons
- **Date-fns**: Powerful date manipulation

### Backend
- **FastAPI**: High-performance async API framework
- **Scikit-learn**: Machine learning for anomaly detection
- **Pandas**: Data manipulation and analysis
- **HuggingFace Transformers**: AI-powered question answering
- **Uvicorn**: ASGI server for production

### AI & ML
- **Isolation Forest**: Unsupervised anomaly detection
- **DistilBERT**: Question-answering model
- **Statistical Analysis**: Advanced metrics and pattern detection

## 📊 **Sample Data**

The repository includes `sample_data_ecommerce.csv` with:
- **744 data points** (31 days of hourly e-commerce data)
- **Realistic patterns** with daily cycles and weekend spikes
- **Natural anomalies** representing promotional events
- **Perfect for testing** all dashboard features

### Data Format
Your CSV/Excel files should have these columns:
```csv
timestamp,value
2024-01-01T00:00:00Z,125.50
2024-01-01T01:00:00Z,118.23
...
```

## 🎯 **Use Cases**

### Business Intelligence
- **Sales Analysis**: Revenue trends, seasonal patterns
- **KPI Monitoring**: Performance metrics, goal tracking
- **Customer Behavior**: Usage patterns, engagement analysis

### Operations Monitoring
- **Server Metrics**: CPU, memory, response times
- **Application Performance**: Error rates, throughput
- **Infrastructure Health**: System reliability, uptime

### Quality Control
- **Manufacturing**: Process monitoring, defect detection
- **Supply Chain**: Inventory levels, delivery performance
- **Compliance**: Regulatory monitoring, threshold alerts

### Financial Analysis
- **Trading**: Price movements, volatility analysis
- **Risk Assessment**: Portfolio monitoring, anomaly detection
- **Forecasting**: Trend analysis, predictive insights

## 🔧 **Configuration**

### Environment Variables
Create a `.env` file in the backend directory:
```env
# Optional: Customize AI model
HUGGINGFACE_MODEL=distilbert-base-cased-distilled-squad

# Optional: Adjust anomaly detection sensitivity
ANOMALY_CONTAMINATION=0.1

# Optional: API configuration
API_HOST=0.0.0.0
API_PORT=8000
```

### Customization
- **Add new chart types**: Create components in `/frontend/src/components/`
- **Modify AI insights**: Edit pattern detection algorithms
- **Custom styling**: Update Tailwind CSS classes
- **New data sources**: Extend API endpoints

## 🚀 **Deployment**

### Development
```bash
# Frontend dev server
npm run dev

# Backend dev server
uvicorn main:app --reload
```

### Production

#### Frontend (Static Build)
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

#### Backend (Production Server)
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Support
```dockerfile
# Coming soon: Docker configuration for easy deployment
```

## 📈 **Performance**

- **Frontend**: Optimized React components with memo and useMemo
- **Backend**: Async FastAPI with efficient data processing
- **Charts**: Smooth rendering with responsive design
- **AI**: Local processing with HuggingFace models

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

### Documentation
- [Complete Dashboard Guide](COMPLETE_DASHBOARD_GUIDE.md)
- [API Documentation](http://localhost:8000/docs) (when backend is running)

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and community support
- **Wiki**: Additional documentation and tutorials

## 🏆 **Acknowledgments**

- **HuggingFace**: AI models and transformers
- **Scikit-learn**: Machine learning algorithms
- **React Team**: Frontend framework
- **FastAPI**: Backend framework
- **Recharts**: Visualization library

## 🎉 **What's Next?**

- [ ] Docker containerization
- [ ] Real-time data streaming
- [ ] Additional ML models
- [ ] Mobile responsive improvements
- [ ] Export to PDF/PNG
- [ ] User authentication
- [ ] Cloud deployment guides

---

**⭐ If you find this project useful, please give it a star on GitHub!**

**Built with ❤️ by the open source community**