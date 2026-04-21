from collections.abc import Sequence

import chromadb
from chromadb.api.models.Collection import Collection

from app.core.config import get_settings


class VectorStoreService:
    def __init__(self) -> None:
        settings = get_settings()
        settings.chroma_path.mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(path=str(settings.chroma_path))
        self.collection_name = settings.chroma_collection

    def _collection(self) -> Collection:
        return self.client.get_or_create_collection(name=self.collection_name, metadata={"hnsw:space": "cosine"})

    def upsert(
        self,
        ids: Sequence[str],
        documents: Sequence[str],
        embeddings: Sequence[Sequence[float]],
        metadatas: Sequence[dict],
    ) -> None:
        self._collection().upsert(ids=list(ids), documents=list(documents), embeddings=list(embeddings), metadatas=list(metadatas))

    def query(self, query_embedding: list[float], top_k: int) -> dict:
        return self._collection().query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

    def delete_by_doc_id(self, doc_id: str) -> None:
        self._collection().delete(where={"doc_id": doc_id})

    def list_documents(self) -> list[dict]:
        data = self._collection().get(include=["metadatas"])
        metadatas = data.get("metadatas", [])
        doc_map: dict[str, str] = {}
        for md in metadatas:
            if not md:
                continue
            did = md.get("doc_id")
            fname = md.get("filename")
            if did and fname:
                doc_map[did] = fname
        return [{"doc_id": k, "filename": v} for k, v in sorted(doc_map.items())]
