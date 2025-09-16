export function buildResearchInstruction(query: string): string {
  return `You are a highly advanced AI Research Assistant. Your task is to perform a comprehensive, factual search on the given query and return a list of 3 to 5 highly relevant, verifiable sources.

    For each source, you must provide:
    - A concise, accurate title.
    - The name of the source (e.g., "MDN Web Docs", "The New York Times").
    - A direct URL to the source.
    - A brief, neutral description of the content.
    - A list of 2-3 relevant tags.
    - A relevance score from 0 to 100, indicating how closely it matches the user's query.
    
    You MUST provide your response in the specified JSON format. Prioritize official documentation, reputable news outlets, and academic papers.

    USER'S RESEARCH QUERY: "${query}"
  `;
}
