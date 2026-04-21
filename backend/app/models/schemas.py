from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    force_reingest: bool = False


class IngestResponse(BaseModel):
    status: str
    files_processed: int
    chunks_added: int


class ChatRequest(BaseModel):
    question: str = Field(min_length=1)
    top_k: int | None = Field(default=None, ge=1, le=20)


class SourceItem(BaseModel):
    filename: str
    chunk_id: str
    score: float
    snippet: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceItem]


class DocumentItem(BaseModel):
    doc_id: str
    filename: str


class DocumentsResponse(BaseModel):
    documents: list[DocumentItem]
