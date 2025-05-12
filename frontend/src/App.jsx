import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (tables, etc.)
import "./App.css"; // We'll create/modify this later

// Configuration for the backend API URLs
const API_BASE_URL = "http://localhost:3001/api";

// Constants for view states
const VIEW_MAIN_MENU = "main_menu";
const VIEW_LIST_COMMANDS = "list_commands";
const VIEW_COMMAND_DETAILS = "view_command_details";
const VIEW_AI_MODE = "ai_mode";

// Component to mimic boxen styling
const Boxen = ({ children, title, borderColor = "cyan", padding = 1 }) => {
  const style = {
    border: `2px solid ${borderColor}`,
    padding: `${padding}rem`,
    margin: "1rem 0",
    borderRadius: "5px", // Rounded corners mimic boxen somewhat
    backgroundColor:
      borderColor === "green"
        ? "#e8f6f3"
        : borderColor === "magenta"
        ? "#fde7f9"
        : "#e0f7fa", // Light background based on border
  };
  return (
    <div style={style}>
      {title && (
        <h2
          style={{
            marginTop: 0,
            color: borderColor,
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState(VIEW_MAIN_MENU);
  const [commands, setCommands] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(null); // For view details
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch command list on mount
  useEffect(() => {
    const fetchCommands = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/commands`);
        setCommands(response.data.commands || []);
      } catch (err) {
        console.error("Error fetching commands:", err);
        setError("Failed to load command list from the server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommands();
  }, []); // Empty dependency array means run once on mount

  // Fetch details for a selected command
  const handleViewCommand = useCallback(async (commandName) => {
    setIsLoading(true);
    setError(null);
    setSelectedCommand(null); // Clear previous
    try {
      const response = await axios.get(
        `${API_BASE_URL}/command/${encodeURIComponent(commandName)}`
      );
      setSelectedCommand(response.data); // { name, content }
      setCurrentView(VIEW_COMMAND_DETAILS);
    } catch (err) {
      console.error(`Error fetching command ${commandName}:`, err);
      setError(`Failed to load details for command "${commandName}".`);
      // Stay on the current view or go back to list? Go back for now.
      setCurrentView(VIEW_LIST_COMMANDS);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed if API_BASE_URL is constant

  // Handle submitting query in AI mode
  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setAiResponse("");

    try {
      const response = await axios.post(`${API_BASE_URL}/ai-help`, {
        query: aiQuery,
      });
      setAiResponse(response.data.response);
      setAiQuery(""); // Clear input after successful submission
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setError(
        err.response?.data?.error ||
          "Failed to get response from the AI server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to navigate back to main menu
  const goBackToMainMenu = () => {
    setCurrentView(VIEW_MAIN_MENU);
    setError(null); // Clear errors when navigating
    setAiResponse(""); // Clear AI response
    setSelectedCommand(null); // Clear selected command
  };

  // Render different views based on state
  const renderView = () => {
    switch (currentView) {
      case VIEW_LIST_COMMANDS:
        return (
          <div>
            <h2>Available Commands:</h2>
            {isLoading && <p>Loading commands...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            <ul className="command-list">
              {commands.map((cmdName) => (
                <li key={cmdName}>
                  <button
                    onClick={() => handleViewCommand(cmdName)}
                    className="link-button"
                  >
                    {cmdName}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={goBackToMainMenu}>Back to Menu</button>
          </div>
        );

      case VIEW_COMMAND_DETAILS:
        return (
          <div>
            {isLoading && <p>Loading details...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            {selectedCommand && (
              <Boxen borderColor="cyan">
                {/* Render markdown content of the command */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedCommand.content}
                </ReactMarkdown>
              </Boxen>
            )}
            <button onClick={() => setCurrentView(VIEW_LIST_COMMANDS)}>
              Back to List
            </button>
            <button onClick={goBackToMainMenu} style={{ marginLeft: "1rem" }}>
              Back to Menu
            </button>
          </div>
        );

      case VIEW_AI_MODE:
        return (
          <div>
            <Boxen
              title="AI Mode - Ask anything about Unix commands!"
              borderColor="magenta"
            >
              <p>
                Type your query below. Type 'exit' or 'back' in the input (or
                click Back) to return.
              </p>
              <form onSubmit={handleAiSubmit} className="query-form">
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g., how to list files sorted by size?"
                  rows="3"
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Asking AI..." : "Ask Gemini"}
                </button>
              </form>
              {error && (
                <p className="error-message" style={{ marginTop: "1rem" }}>
                  Error: {error}
                </p>
              )}
              {aiResponse && (
                <Boxen title="Gemini says:" borderColor="green">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiResponse}
                  </ReactMarkdown>
                </Boxen>
              )}
            </Boxen>
            <button onClick={goBackToMainMenu}>Back to Menu</button>
          </div>
        );

      case VIEW_MAIN_MENU:
      default:
        return (
          <Boxen
            title="Your Interactive Unix Commands Reference"
            borderColor="cyan"
          >
            <h2>What would you like to do?</h2>
            {isLoading && commands.length === 0 && (
              <p>Loading initial data...</p>
            )}
            {error && commands.length === 0 && (
              <p className="error-message">Error: {error}</p>
            )}
            <ul className="main-menu">
              <li>
                <button
                  onClick={() => setCurrentView(VIEW_LIST_COMMANDS)}
                  disabled={isLoading || commands.length === 0}
                >
                  1. List all commands
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView(VIEW_LIST_COMMANDS)}
                  disabled={isLoading || commands.length === 0}
                >
                  2. View command details
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView(VIEW_AI_MODE)}
                  disabled={isLoading}
                >
                  3. AI Mode (Chat with Gemini)
                </button>
              </li>
            </ul>
          </Boxen>
        );
    }
  };

  // ASCII Art Header (Optional, might look messy on web)
  const renderCliHeader = () => (
    <pre
      style={{
        color: "#3498db",
        textAlign: "center",
        marginBottom: "1rem",
        fontSize: "0.8em",
        lineHeight: "1.1",
      }}
    >
      {`██╗   ██╗███╗   ██╗██╗██╗  ██╗ █████╗ ██╗
██║   ██║████╗  ██║██║╚██╗██╔╝ ██╔══██╗██║
██║   ██║██╔██╗ ██║██║ ╚███╔╝  ███████║██║
██║   ██║██║╚██╗██║██║ ██╔██╗  ██╔══██║██║
╚██████╔╝██║ ╚████║██║██╔╝ ██╗ ██║  ██║██║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝ ╚═╝  ╚═╝╚═╝`}
    </pre>
  );

  return (
    <div className="app-container">
      {/* Optional: Render the ASCII art header */}
      {/* renderCliHeader() */}
      <main>{renderView()}</main>
      <footer>
        <p>Powered by Gemini</p>
      </footer>
    </div>
  );
}

export default App;
