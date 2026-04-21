# RAG Chatbot Backend

FastAPI backend for a simple RAG chatbot using:

- Gemini API for answer generation
- Sentence Transformers for embeddings
- ChromaDB for vector storage and retrieval

## 1) Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create env file:

```powershell
copy .env.example .env
```

Edit `backend/.env` and set your `GEMINI_API_KEY`.

## 2) Add documents

Put source files in `backend/data/docs`.

Supported formats:

- `.txt`
- `.md`
- `.pdf`

## 3) Run API

```powershell
uvicorn app.main:app --reload --port 8000
```

API base URL: `http://127.0.0.1:8000`

## 4) Endpoints

### `GET /health`

Health check.

### `POST /ingest`

Ingests files from `data/docs` into Chroma.

Request body:

```json
{
  "force_reingest": false
}
```

Response example:

```json
{
  "status": "ok",
  "files_processed": 2,
  "chunks_added": 53
}
```

### `GET /documents`

Lists indexed document IDs and filenames.

### `POST /chat`

Asks a question over ingested documents.

Request body:

```json
{
  "question": "What is this document about?",
  "top_k": 4
}
```

Response example:

```json
{
  "answer": "...",
  "sources": [
    {
      "filename": "sample.pdf",
      "chunk_id": "sample.pdf::0",
      "score": 0.23,
      "snippet": "..."
    }
  ]
}
```

## 5) Quick test commands

```powershell
curl http://127.0.0.1:8000/health
curl -X POST http://127.0.0.1:8000/ingest -H "Content-Type: application/json" -d "{\"force_reingest\": false}"
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d "{\"question\":\"Summarize the knowledge base\",\"top_k\":4}"
```
