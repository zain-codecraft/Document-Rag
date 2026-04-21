import google.generativeai as genai

from app.core.config import get_settings
from app.models.schemas import SourceItem
from app.services.embedder import EmbeddingService
from app.services.vector_store import VectorStoreService


class RagService:
    def __init__(self) -> None:
        self.settings = get_settings()
        genai.configure(api_key=self.settings.gemini_api_key)
        self.chat_model = genai.GenerativeModel(self.settings.gemini_chat_model)
        self.embedder = EmbeddingService()
        self.store = VectorStoreService()

    def answer(self, question: str, top_k: int | None = None) -> tuple[str, list[SourceItem]]:
        k = top_k or self.settings.top_k
        query_vec = self.embedder.embed_query(question)
        result = self.store.query(query_embedding=query_vec, top_k=k)

        docs = result.get("documents", [[]])[0]
        metadatas = result.get("metadatas", [[]])[0]
        distances = result.get("distances", [[]])[0]

        if not docs:
            return "I do not know based on the current knowledge base.", []

        sources: list[SourceItem] = []
        context_lines: list[str] = []
        for idx, doc_text in enumerate(docs):
            md = metadatas[idx] or {}
            distance = float(distances[idx]) if idx < len(distances) else 0.0
            filename = str(md.get("filename", "unknown"))
            chunk_index = str(md.get("chunk_index", idx))
            chunk_id = f"{filename}::{chunk_index}"
            snippet = doc_text[:240].strip()
            sources.append(SourceItem(filename=filename, chunk_id=chunk_id, score=distance, snippet=snippet))
            context_lines.append(f"[{idx + 1}] ({filename}#{chunk_index}) {doc_text}")

        context = "\n\n".join(context_lines)
        prompt = (
            "You are a retrieval-augmented assistant. "
            "Answer only using the provided context. "
            "If the context does not contain the answer, say you do not know. "
            "Keep the answer concise and factual.\n\n"
            f"Question: {question}\n\n"
            f"Context:\n{context}\n\n"
            "When possible, mention source markers like [1], [2]."
        )

        response = self.chat_model.generate_content(prompt)
        answer = (response.text or "").strip()
        if not answer:
            answer = "I do not know based on the current knowledge base."
        return answer, sources
