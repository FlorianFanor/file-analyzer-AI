import { useState } from "react";
import GraphWithAnomalies from "./components/GraphWithAnomalies";
import AnomalySummary from "./components/AnomalySummary";


function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Envoi du fichier...");
    try {
      const res = await fetch("http://localhost:8000/upload-excel", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.error) {
        setStatus("Erreur: " + result.error);
      } else {
        setData(result.data);
        setStatus(`${result.data.length} points chargés.`);
      }
    } catch (err) {
      setStatus("Erreur de connexion.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Détection d'anomalies</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          className="block w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Envoyer et analyser
        </button>

        <p className="text-sm text-gray-600">{status}</p>
      </div>

      {data.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <GraphWithAnomalies data={data} />
        </div>
      )}

      <AnomalySummary data={data} />

    </div>
  );
}

export default App;
