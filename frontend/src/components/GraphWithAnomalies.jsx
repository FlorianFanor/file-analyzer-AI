import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

export default function GraphWithAnomalies({ data }) {
  const labels = data.map(d =>
    new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const allValues = data.map(d => d.value);
  const anomalyValues = data.map(d => (d.anomaly === -1 ? d.value : null));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Values",
        data: allValues,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
        pointRadius: 2,
      },
      {
        label: "Anomalies",
        data: anomalyValues,
        backgroundColor: "#ef4444",
        pointRadius: 6,
        pointStyle: "rectRounded",
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 20 },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
