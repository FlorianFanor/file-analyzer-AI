export default function AnomalySummary({ data }) {
  const anomalies = data.filter((d) => d.anomaly === -1);

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Anomaly Summary</h2>
      {anomalies.length === 0 ? (
        <p>No anomalies detected.</p>
      ) : (
        <ul className="space-y-1 text-sm text-gray-700">
          {anomalies.map((d, i) => (
            <li key={i}>
              Anomaly at <strong>{d.timestamp}</strong> — value: <strong>{d.value}</strong>, deviation: <strong>{d.deviation?.toFixed(2)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}