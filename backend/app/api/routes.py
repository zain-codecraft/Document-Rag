from fastapi import APIRouter

from app.models.schemas import ChatRequest, ChatResponse, DocumentsResponse, IngestRequest, IngestResponse
from app.services.ingestion import IngestionService
from app.services.rag import RagService
from app.services.vector_store import VectorStoreService

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/ingest", response_model=IngestResponse)
def ingest(payload: IngestRequest) -> IngestResponse:
    ingestion = IngestionService()
    files_processed, chunks_added = ingestion.ingest(force_reingest=payload.force_reingest)
    return IngestResponse(status="ok", files_processed=files_processed, chunks_added=chunks_added)


@router.get("/documents", response_model=DocumentsResponse)
def documents() -> DocumentsResponse:
    store = VectorStoreService()
    docs = store.list_documents()
    return DocumentsResponse(documents=docs)


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    rag = RagService()
    answer, sources = rag.answer(payload.question, payload.top_k)
    return ChatResponse(answer=answer, sources=sources)
