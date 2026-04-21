import hashlib
from pathlib import Path

from pypdf import PdfReader

from app.core.config import get_settings
from app.services.embedder import EmbeddingService
from app.services.vector_store import VectorStoreService


def _read_text_from_file(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in {".txt", ".md"}:
        return path.read_text(encoding="utf-8", errors="ignore")
    if suffix == ".pdf":
        reader = PdfReader(str(path))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages)
    return ""


def _chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> list[str]:
    text = " ".join(text.split())
    if not text:
        return []
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        if end == len(text):
            break
        start = max(0, end - overlap)
    return chunks


def _doc_id_for_file(path: Path) -> str:
    digest = hashlib.sha1(path.read_bytes()).hexdigest()
    return f"{path.name}:{digest[:12]}"


class IngestionService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.embedder = EmbeddingService()
        self.store = VectorStoreService()

    def ingest(self, force_reingest: bool = False) -> tuple[int, int]:
        docs_path = self.settings.docs_path
        docs_path.mkdir(parents=True, exist_ok=True)

        candidates = [p for p in docs_path.rglob("*") if p.is_file() and p.suffix.lower() in {".txt", ".md", ".pdf"}]
        files_processed = 0
        chunks_added = 0

        for file_path in candidates:
            text = _read_text_from_file(file_path)
            chunks = _chunk_text(text)
            if not chunks:
                continue

            files_processed += 1
            doc_id = _doc_id_for_file(file_path)
            if force_reingest:
                self.store.delete_by_doc_id(doc_id)

            ids = [f"{doc_id}::{idx}" for idx, _ in enumerate(chunks)]
            metadatas = [
                {"doc_id": doc_id, "filename": file_path.name, "chunk_index": idx}
                for idx, _ in enumerate(chunks)
            ]
            embeddings = self.embedder.embed_texts(chunks)

            self.store.upsert(ids=ids, documents=chunks, embeddings=embeddings, metadatas=metadatas)
            chunks_added += len(chunks)

        return files_processed, chunks_added
