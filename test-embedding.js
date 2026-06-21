const { GoogleGenAI } = require("@google/genai");
require("dotenv").config({ path: ".env.local" });

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const list = await ai.models.list();
    for await (const model of list) {
        if (model.name.includes("embed")) {
            console.log(model.name, "Supports:", model.supportedGenerationMethods);
        }
    }
  } catch (e) {
    console.error(e);
  }
}
test();
