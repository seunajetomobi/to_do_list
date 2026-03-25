import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// include a tiny build timestamp to force a new bundle hash on rebuild
// (helps bust stubborn caches when redeploying to static hosts)
const __BUILD_TS__ = "20260325-" + String(Date.now());
console.log("main: build", __BUILD_TS__);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
