from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest
from transformers import pipeline
import pandas as pd


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

qa_pipeline = pipeline("question-answering")

# Global variables to store latest data and context
latest_data = []
latest_anomalies = []
latest_context = ""

class TimePoint(BaseModel):
    timestamp: str
    value: float

class TimeSeriesRequest(BaseModel):
    values: list[TimePoint]

class QuestionRequest(BaseModel):
    question: str


def build_context():
    if not latest_data or not latest_anomalies:
        return "No anomalies detected recently."

    parts = []
    for i in latest_anomalies:
        point = latest_data[i]
        parts.append(f"An anomaly was detected at {point.timestamp} with a value of {point.value:.2f}.")

    return " ".join(parts)


@app.post("/ask")
def ask_question(question: QuestionRequest):
    global latest_context
    if not latest_context:
        return {"answer": "No data has been analyzed yet."}
    
    result = qa_pipeline(question=question.question, context=latest_context)
    return {"answer": result["answer"]}

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    global latest_context, latest_data, latest_anomalies
    
    try:
        # Handle both CSV and Excel files
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
    except Exception as e:
        return {"error": f"Error reading file: {str(e)}"}

    if "timestamp" not in df or "value" not in df:
        return {"error": "File must have 'timestamp' and 'value' columns."}

    # Anomaly detection
    model = IsolationForest(contamination=0.1)
    df["anomaly"] = model.fit_predict(df[["value"]])
    df["rolling_mean"] = df["value"].rolling(window=10).mean()
    df["deviation"] = (df["value"] - df["rolling_mean"]).abs()
    df["deviation"] = df["deviation"].fillna(0)
    
    # Store data for AI chat context
    latest_data = df.to_dict('records')
    latest_anomalies = df[df["anomaly"] == -1].index.tolist()
    latest_context = build_context()
    
    data = df[["timestamp", "value", "anomaly", "deviation"]].copy()
    data["timestamp"] = data["timestamp"].astype(str)

    return {
        "data": data.to_dict(orient="records")
    }