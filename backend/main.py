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


class TimePoint(BaseModel):
    timestamp: str
    value: float

class TimeSeriesRequest(BaseModel):
    values: list[TimePoint]

class QuestionRequest(BaseModel):
    question: str


def build_context():
    if not latest_data or not latest_anomalies:
        return "Aucune anomalie détectée récemment."

    parts = []
    for i in latest_anomalies:
        point = latest_data[i]
        parts.append(f"Une anomalie a été détectée à {point.timestamp} avec une valeur de {point.value:.2f}.")

    return " ".join(parts)


@app.post("/ask")
def ask_question(question: QuestionRequest):
    global latest_context
    if not latest_context:
        return {"answer": "Aucune donnée n'a été analysée."}
    
    result = qa_pipeline(question=question.question, context=latest_context)
    return {"answer": result["answer"]}

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    global latest_context
    df = pd.read_excel(file.file)

    if "timestamp" not in df or "value" not in df:
        return {"error": "File must have 'timestamp' and 'value' columns."}

    model = IsolationForest(contamination=0.1)
    df["anomaly"] = model.fit_predict(df[["value"]])
    df["rolling_mean"] = df["value"].rolling(window=10).mean()
    df["deviation"] = (df["value"] - df["rolling_mean"]).abs()
    df["deviation"] = df["deviation"].fillna(0)
    
    data = df[["timestamp", "value", "anomaly", "deviation"]].copy()
    data["timestamp"] = data["timestamp"].astype(str)

    return {
        "data": data.to_dict(orient="records")
    }