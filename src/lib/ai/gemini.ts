import { GoogleGenAI } from "@google/genai"

export async function generateTags(code: string, language: string): Promise<string[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const prompt = `You are an expert developer tool. Analyze the following code snippet written in ${language}.
Return an array of 3 to 5 highly relevant string tags (e.g. "react", "hook", "utility", "auth").
Return ONLY a valid JSON array of strings. Do not include markdown formatting like \`\`\`json or any other text.

Code:
${code}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    let text = response.text || "[]"
    // Clean up potential markdown formatting if the model still includes it
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()

    const parsedTags = JSON.parse(text)
    
    if (Array.isArray(parsedTags)) {
      // Return tags as lowercase strings
      return parsedTags.map(tag => String(tag).toLowerCase())
    }
    
    return []
  } catch (error) {
    console.error("AI Tagging Error:", error)
    return []
  }
}
