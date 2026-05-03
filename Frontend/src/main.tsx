import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { ThemeProvider } from "./components/systems/ThemeProvider";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider defaultTheme="system" defaultLanguage="vi">
        <App />
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
