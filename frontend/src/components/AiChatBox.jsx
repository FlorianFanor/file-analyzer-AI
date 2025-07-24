import { useState } from 'react';

export default function AiChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const ask = async () => {
    if (!input.trim()) return;

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });
    const data = await res.json();
    setMessages([...messages, { user: input, ai: data.answer }]);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">Agent IA</h2>

      <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto space-y-4 border">
        {messages.map((m, i) => (
          <div key={i} className="space-y-1">
            <div>
              <span className="text-blue-600 font-medium">Vous:</span>{" "}
              {m.user}
            </div>
            <div>
              <span className="text-green-600 font-medium">IA:</span>{" "}
              {m.ai}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez une question sur les anomalies..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={ask}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
