import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001; // Use environment variable or default

// --- Middleware ---
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// --- Gemini Initialization ---
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY environment variable not set in .env file."
  );
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Choose model based on your needs, consistent with CLI or updated
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
// ------------------------

// --- Command Data Loading (Adapted from CLI) ---
let commands = []; // Cache loaded commands

const loadCommandsData = async () => {
  try {
    // Assuming ingress.md is in the same directory as server.js
    const markdownPath = path.join(__dirname, "ingress.md");
    const content = await fs.readFile(markdownPath, "utf8");
    const sections = content.split("---").filter((section) => section.trim());

    // Store both command name and its markdown content
    return sections
      .map((section) => {
        const lines = section.trim().split("\n");
        const titleMatch = lines[0].match(/## \d+\. `([^`]+)`/);
        if (titleMatch) {
          return {
            name: titleMatch[1], // Changed 'command' to 'name' for clarity
            content: section.trim(),
          };
        }
        return null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error loading commands data:", error.message);
    throw new Error("Failed to load command data.");
  }
};

// --- AI Help Function (Adapted for API Endpoint) ---
const getAICommandHelp = async (userQuery) => {
  if (!commands || commands.length === 0) {
    console.warn("Commands data not loaded yet.");
    // Optionally try loading it here if it failed initially
    // Or return an error indicating the server is not ready
    throw new Error("Command data not available.");
  }

  const commandContext = commands
    .map((cmd) => `Command: ${cmd.name}\n${cmd.content}\n`) // Use cmd.name
    .join("---\n");

  const prompt = `
You are an expert system for explaining and recommending Unix commands based on user queries.
Use the provided command documentation as context when relevant.

User Query: "${userQuery}"

Available Command Context:
---
${commandContext}
---

Based on the user query:
1. Provide a concise explanation of how to achieve the user's goal using Unix commands.
2. Suggest the specific command(s) and flags needed.
3. If appropriate, provide the complete command example.

Respond clearly and directly to the user's query in Markdown format. If the query is unclear or you cannot provide a helpful answer, state that politely.
`; // Added "in Markdown format" hint

  try {
    console.log(`Received query for AI Help: "${userQuery}"`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    console.log("Gemini Response generated.");
    return text; // Return the Markdown text
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    // Throw an error to be caught by the route handler
    throw new Error("Failed to get response from AI service.");
  }
};
// --------------------------------------------

// --- API Routes ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// New endpoint to get the list of command names
app.get("/api/commands", (req, res) => {
  if (!commands || commands.length === 0) {
    return res.status(503).json({ error: "Command data not loaded yet." });
  }
  // Return only the names for the list view
  const commandNames = commands.map((cmd) => cmd.name);
  res.json({ commands: commandNames });
});

// New endpoint to get details (content) of a specific command
app.get("/api/command/:commandName", (req, res) => {
  const { commandName } = req.params;
  if (!commands || commands.length === 0) {
    return res.status(503).json({ error: "Command data not loaded yet." });
  }
  const command = commands.find((cmd) => cmd.name === commandName);
  if (command) {
    res.json({ name: command.name, content: command.content });
  } else {
    res.status(404).json({ error: `Command "${commandName}" not found.` });
  }
});

app.post("/api/ai-help", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const aiResponse = await getAICommandHelp(query);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error in /api/ai-help:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// --- Server Initialization ---
const startServer = async () => {
  try {
    console.log("Loading command data for backend...");
    commands = await loadCommandsData();
    console.log(
      `Command data loaded successfully (${commands.length} commands).`
    );

    app.listen(port, () => {
      console.log(`Backend server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1); // Exit if essential data can't be loaded
  }
};

startServer();
// ------------------------
