import { useEffect } from "react";

export default function Layout({ children }) {
  useEffect(() => {
    // Load Orbitron font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, background: "#080c1a", minHeight: "100vh" }}>
      {children}
    </div>
  );
}