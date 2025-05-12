import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import boxen from "boxen";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- Gemini Initialization ----
// Ensure you have your API key set as an environment variable: GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
// -----------------------------

// Configure marked to use terminal renderer
marked.setOptions({
  renderer: new TerminalRenderer(),
});

// Read and parse the commands data
const loadCommandsData = async () => {
  try {
    const markdownPath = path.join(__dirname, "..", "ingress.md");
    const content = await fs.readFile(markdownPath, "utf8");
    const sections = content.split("---").filter((section) => section.trim());

    return sections
      .map((section) => {
        const lines = section.trim().split("\n");
        const titleMatch = lines[0].match(/## \d+\. `([^`]+)`/);
        if (titleMatch) {
          return {
            command: titleMatch[1],
            content: section.trim(),
          };
        }
        return null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error(chalk.red("Error loading commands data:", error.message));
    process.exit(1);
  }
};

// Format and display a command's information
const displayCommand = (commandData) => {
  console.log(
    boxen(marked(commandData.content), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "cyan",
    })
  );
};

// --- Updated Search Functionality using Gemini ---
const searchCommands = async (commands, searchTerm) => {
  // Combine command names into a list for the prompt
  const commandNames = commands.map((cmd) => cmd.command).join(", ");

  // Construct the prompt for Gemini
  const prompt = `
You are an expert system for recommending Unix commands.
Given the user's query and a list of available commands, identify the most relevant command(s) from the list.

User Query: "${searchTerm}"

Available Commands: ${commandNames}

Respond ONLY with a comma-separated list of the relevant command names from the provided list. If no commands seem relevant, respond with "NONE" and also provide a simple human readable explanation of the command info about what flag to use according to the user's query. Also if the user's query is about a specific use case, respond with the complete combination of commands to achieve the user's query.
Example Response 
         >  ls, grep | Explanation: Use the -l flag to list files and the -r flag to search recursively.  
         > Complete Command: ls -l | grep "searchTerm"
Example Response: NONE
`;

  try {
    console.log(chalk.blue("Asking Gemini for relevant commands..."));
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    console.log(chalk.blue("Gemini suggested:"), text);

    if (text === "NONE") {
      return [];
    }

    // Extract command names from Gemini's response
    const relevantCommandNames = text.split(",").map((name) => name.trim());

    // Filter the original commands list based on Gemini's recommendations
    return commands.filter((cmd) => relevantCommandNames.includes(cmd.command));
  } catch (error) {
    console.error(chalk.red("Error calling Gemini API:", error.message));
    // Fallback to simple search or return empty? For now, return empty.
    // You might want to add the old simple search here as a fallback.
    console.log(chalk.yellow("Falling back to simple text search..."));
    return commands.filter((cmd) =>
      cmd.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // return [];
  }
};
// -------------------------------------------------

// --- Updated AI Interaction Function ---
const getAICommandHelp = async (commands, userQuery) => {
  // Combine command names and potentially snippets for context
  const commandContext = commands
    .map((cmd) => `Command: ${cmd.command}\n${cmd.content}\n`)
    .join("---\n"); // Use separator for clarity

  // Construct the prompt for Gemini
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

Respond clearly and directly to the user's query. If the query is unclear or you cannot provide a helpful answer, state that politely.
`;

  try {
    console.log(chalk.blue("Asking Gemini..."));
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    console.log(chalk.green("Gemini says:"));
    // Use marked to render the AI's response which might contain markdown
    console.log(boxen(marked(text), { padding: 1, borderColor: "green" }));

    // We are directly displaying the text, no need to parse command names here for this mode
    // Let's return the raw text for now, although we might not need it
    return text;
  } catch (error) {
    console.error(chalk.red("Error calling Gemini API:", error.message));
    console.log(
      chalk.yellow("Sorry, I couldn't get help from the AI at the moment.")
    );
    return null; // Indicate failure
  }
};
// --------------------------------------

// --- AI Mode ---
const enterAIMode = async (commands) => {
  console.clear();
  console.log(
    boxen(chalk.bold("AI Mode - Ask anything about Unix commands!"), {
      padding: 1,
      margin: 1,
      borderStyle: "double",
      borderColor: "magenta",
    })
  );
  console.log(
    chalk.yellow("Type 'exit' or 'back' to return to the main menu.")
  );

  while (true) {
    const { query } = await inquirer.prompt([
      {
        type: "input",
        name: "query",
        message: chalk.magenta("You:"),
      },
    ]);

    const lowerQuery = query.toLowerCase().trim();
    if (lowerQuery === "exit" || lowerQuery === "back") {
      break; // Exit AI mode
    }

    if (!query.trim()) {
      continue; // Skip empty input
    }

    await getAICommandHelp(commands, query); // Call the refactored function
    console.log("---"); // Separator between interactions
  }
};
// -------------

// Main menu
const showMainMenu = async (commands) => {
  // Use rawlist for numbered shortcuts
  const choices = [
    { name: "List all commands", value: "list" },
    { name: "View command details", value: "view" },
    { name: "AI Mode (Chat with Gemini)", value: "ai" },
    new inquirer.Separator(),
    { name: "Exit", value: "exit" },
  ];

  while (true) {
    console.clear();
    // ASCII art header (keep as is)
    console.log(`
${chalk.cyan("██╗   ██╗")}${chalk.cyan("███╗   ██╗")}${chalk.cyan(
      "██╗"
    )}${chalk.cyan("██╗  ██╗")} ${chalk.cyan("█████╗ ██╗")}
${chalk.cyan("██║   ██║")}${chalk.cyan("████╗  ██║")}${chalk.cyan(
      "██║"
    )}${chalk.cyan("╚██╗██╔╝")} ${chalk.cyan("██╔══██╗██║")}
${chalk.cyan("██║   ██║")}${chalk.cyan("██╔██╗ ██║")}${chalk.cyan(
      "██║"
    )}${chalk.cyan(" ╚███╔╝ ")} ${chalk.cyan("███████║██║")}
${chalk.cyan("██║   ██║")}${chalk.cyan("██║╚██╗██║")}${chalk.cyan(
      "██║"
    )}${chalk.cyan(" ██╔██╗ ")} ${chalk.cyan("██╔══██║██║")}
${chalk.cyan("╚██████╔╝")}${chalk.cyan("██║ ╚████║")}${chalk.cyan(
      "██║"
    )}${chalk.cyan("██╔╝ ██╗")} ${chalk.cyan("██║  ██║██║")}
${chalk.cyan(" ╚═════╝ ")}${chalk.cyan("╚═╝  ╚═══╝")}${chalk.cyan(
      "╚═╝"
    )}${chalk.cyan("╚═╝  ╚═╝")} ${chalk.cyan("╚═╝  ╚═╝╚═╝")}
    `);
    console.log(
      boxen(chalk.bold("Your Interactive Unix Commands Reference"), {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 1, right: 1 },
        borderStyle: "round",
        borderColor: "cyan",
      })
    );

    const { action } = await inquirer.prompt([
      {
        // Use rawlist for numbered shortcuts
        type: "rawlist",
        name: "action",
        message: "What would you like to do?",
        choices: choices,
        // Default choice can be set if needed
        // default: 0,
      },
    ]);

    switch (action) {
      case "list": // Corresponds to value 'list'
        console.clear();
        console.log(chalk.bold.underline("Available Commands:\n"));
        commands.forEach((cmd) => {
          console.log(chalk.cyan(`• ${cmd.command}`));
        });
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "\nPress Enter to return to the main menu...",
          },
        ]);
        break;

      // Removed old search - now part of AI Mode
      // case "Search commands (Natural Language)": ...

      case "view": // Corresponds to value 'view'
        const { command } = await inquirer.prompt([
          {
            type: "list", // Keep list for command selection as it's potentially long
            name: "command",
            message: "Select a command to view details:",
            choices: commands.map((cmd) => cmd.command),
          },
        ]);

        console.clear();
        const selectedCommand = commands.find((cmd) => cmd.command === command);
        if (selectedCommand) {
          displayCommand(selectedCommand);
        } else {
          // Should not happen if selected from list, but good practice
          console.log(chalk.red(`Command "${command}" not found.`));
        }
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "\nPress Enter to return to the main menu...",
          },
        ]);
        break;

      case "ai": // Corresponds to value 'ai'
        await enterAIMode(commands);
        // Loop in enterAIMode handles interaction until user exits
        break;

      case "exit": // Corresponds to value 'exit'
        console.clear();
        console.log(chalk.cyan("Thank you for using UnixDotAI! Goodbye!"));
        process.exit(0);
    }
  }
};

// Initialize the application
const init = async () => {
  // Check for API key before loading commands
  if (!process.env.GEMINI_API_KEY) {
    console.error(
      chalk.red("Error: GEMINI_API_KEY environment variable not set.")
    );
    console.log(
      chalk.yellow("Please get an API key from Google AI Studio and set it.")
    );
    process.exit(1);
  }

  try {
    console.log(chalk.blue("Loading command data..."));
    const commands = await loadCommandsData();
    console.log(chalk.green("Command data loaded successfully."));
    await showMainMenu(commands);
  } catch (error) {
    console.error(chalk.red("Error initializing application:", error.message));
    process.exit(1);
  }
};

// Start the application
init();
