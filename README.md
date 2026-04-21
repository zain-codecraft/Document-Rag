# KRWORK RAG Chatbot

Simple RAG chatbot project with:

- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **Vector DB:** ChromaDB
- **Embeddings:** Sentence Transformers
- **Answer Generation:** Gemini

The knowledge base documents are stored in the backend under `backend/data/docs`.

## Project Structure

```text
rag chatbot/
  backend/
    app/
    data/docs/
    requirements.txt
  frontend/
    src/
    package.json
  .gitignore
```

## 1) Backend Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Update `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_CHAT_MODEL=gemini-1.5-flash
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
CHROMA_PERSIST_DIR=./chroma_data
CHROMA_COLLECTION=kb_chunks
DOCS_DIR=./data/docs
TOP_K=4
```

Add your documents (`.txt`, `.md`, `.pdf`) into:

`backend/data/docs`

Run backend:

```powershell
uvicorn app.main:app --reload --port 8000
```

Backend API URL:

`http://127.0.0.1:8000`

## 2) Frontend Setup

Open a new terminal:

```powershell
cd frontend
npm install
copy .env.example .env
```

Default `frontend/.env`:

```env
VITE_API_BASE=http://127.0.0.1:8000
```

Run frontend:

```powershell
npm run dev
```

Frontend URL:

`http://127.0.0.1:5173`

## 3) Ingest and Chat

After backend is running and documents are placed in `backend/data/docs`, ingest them:

```powershell
curl -X POST http://127.0.0.1:8000/ingest -H "Content-Type: application/json" -d "{\"force_reingest\": false}"
```

Test chat endpoint:

```powershell
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d "{\"question\":\"What does KRWORK do?\",\"top_k\":4}"
```

Or use the React UI at `http://127.0.0.1:5173`.

## API Endpoints

- `GET /health` - health check
- `POST /ingest` - ingest documents into Chroma
- `GET /documents` - list indexed documents
- `POST /chat` - ask question over indexed knowledge base

## Notes

- `.env` files are ignored by git (root `.gitignore`).
- Keep backend and frontend running in separate terminals.
- Re-run ingestion after updating knowledge base files.
