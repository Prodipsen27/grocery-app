
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TOOLS } from './tools.js';
import { executeTool } from './toolHandler.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getSystemPrompt = (userName) => `You are Leafy.ai, an advanced and friendly AI grocery shopping assistant integrated into the LeafCart web application.
You are currently assisting a user named: ${userName}. Address them nicely!

Your job:
1. Understand what the user wants to cook or buy
2. Search for products using search_products (always search before adding)
3. Add ingredients to their cart using add_to_cart
4. Manage their cart (update quantities, remove items, suggest alternatives)

Rules:
- For a recipe, search and add each ingredient one by one. Never skip ingredients.
- Never guess product IDs — always search first.
- If a product is out of stock or unavailable, DO NOT add it. Simply skip it and explicitly notify the user in your response that the item was skipped due to unavailability.
- When adding items, briefly explain why (e.g. "Adding paneer — main ingredient in Palak Paneer").
- After completing a recipe, summarise: what was added + cart total in ₹.
- Keep responses friendly, clean, and conversational. Make use of Markdown formatting (bullet points, bold text, etc) when listing items so it is easy to read.
- Use get_cart before making changes when context is needed.
- Only call clear_cart if the user explicitly asks to empty their cart.`;

/**
 * Convert our flat conversation history to Gemini's format.
 * Our format:  [{ role: "user"|"assistant", content: string }]
 * Gemini wants: [{ role: "user"|"model", parts: [{ text: string }] }]
 */
function toGeminiHistory(history) {
  return history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

/**
 * Run the agentic loop for one user turn.
 *
 * @param {Array}    conversationHistory  - [{role: "user"|"assistant", content: string}]
 * @param {string}   userId               - MongoDB User ID
 * @param {string}   userName             - User's name
 * @param {Function} onToolCall           - Optional callback(logEntry) for real-time streaming
 * @returns {{ reply: string, toolCalls: Array, updatedHistory: Array }}
 */
async function runAgentLoop(conversationHistory, userId, userName = "User", onToolCall = null) {
  // Separate the latest user message from the prior history
  const history  = conversationHistory.slice(0, -1);
  const lastMsg  = conversationHistory[conversationHistory.length - 1];

  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
    systemInstruction: getSystemPrompt(userName),
    tools: TOOLS,
  });

  // Start chat with prior history converted to Gemini format
  const chat = model.startChat({
    history: toGeminiHistory(history),
  });

  const toolCallLog = [];

  // Send the latest user message to kick off the loop
  let result = await chat.sendMessage(lastMsg.content);

  // ── AGENTIC LOOP ────────────────────────────────────────────────────────────
  while (true) {
    const response = result.response;
    const candidate = response.candidates?.[0];

    if (!candidate) {
      throw new Error("Gemini returned no candidates.");
    }

    const parts = candidate.content?.parts ?? [];

    // ── Check if Gemini wants to call any functions ──────────────────────────
    const functionCallParts = parts.filter((p) => p.functionCall);

    if (functionCallParts.length === 0) {
      // No function calls → Gemini is done. Extract the text reply.
      const textPart = parts.find((p) => p.text);
      const reply = textPart?.text ?? "Done!";

      // Rebuild updated history including this turn
      const updatedHistory = [
        ...conversationHistory,
        { role: "assistant", content: reply },
      ];

      return { reply, toolCalls: toolCallLog, updatedHistory };
    }

    // ── Execute all function calls and collect responses ─────────────────────
    const functionResponses = [];

    for (const part of functionCallParts) {
      const { name, args } = part.functionCall;

      // Execute the tool
      const result = await executeTool(name, args, userId);

      // Log it
      const logEntry = { toolName: name, input: args, result };
      toolCallLog.push(logEntry);
      if (typeof onToolCall === 'function') onToolCall(logEntry);

      // Build the functionResponse part Gemini expects
      functionResponses.push({
        functionResponse: {
          name,
          response: result,   // Gemini accepts a plain object here (not JSON string)
        },
      });
    }

    // Send all function results back to Gemini in one turn
    result = await chat.sendMessage(functionResponses);

    // Loop — Gemini will now process the results and either call more tools or reply
  }
}

export { runAgentLoop };