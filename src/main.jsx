import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GitHubProfile from "./code/GithubProfile";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GitHubProfile />
  </StrictMode>
);
