export function buildSummarizationInstruction(): string {
  return `You are an expert summarizer. Your task is to read the provided text from a webpage and generate a concise, neutral, and informative summary.
  The summary should be a single paragraph, containing no more than 150 words.
  Focus on the key points and main arguments of the text.
  Do not add any personal opinions or information not present in the text.
  `;
}
