export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function chunkText(text: string, maxTokens: number = 500): string[] {
  // A simple chunker splitting by paragraphs/sentences
  // In a real production app, use LangChain's RecursiveCharacterTextSplitter or similar
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const p of paragraphs) {
    // Very rough estimate: 1 word ~ 1.3 tokens
    const pTokens = p.split(/\s+/).length * 1.3;
    const currentTokens = currentChunk.split(/\s+/).length * 1.3;

    if (currentTokens + pTokens > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += p + "\n\n";
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
