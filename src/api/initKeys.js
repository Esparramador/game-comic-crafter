// Auto-init de API keys desde variables de entorno (Vite)
// Se ejecuta una vez al arrancar la app
import { initGCC } from "./services";
import { initHyperBrain } from "./hyperBrain";

export function autoInitKeys() {
  // Keys desde .env.local (VITE_*)
  const envConfig = {
    elevenKey:     import.meta.env.VITE_ELEVEN_KEY     || "",
    shopifyToken:  import.meta.env.VITE_SHOPIFY_TOKEN  || "",
    shopifyDomain: import.meta.env.VITE_SHOPIFY_DOMAIN || "comic-crafter.myshopify.com",
    replicateKey:  import.meta.env.VITE_REPLICATE_KEY  || "",
    manusKey:      import.meta.env.VITE_MANUS_KEY      || "",
  };

  // Keys desde localStorage (el usuario puede sobrescribirlas en ConfigScreen)
  let savedConfig = {};
  try { savedConfig = JSON.parse(localStorage.getItem("gcc_api_config") || "{}"); } catch {}

  // Merge: localStorage tiene prioridad (el usuario puede override las del .env)
  const finalConfig = { ...envConfig, ...savedConfig };

  // Guardar en localStorage si hay keys nuevas del env
  const hasEnvKeys = Object.values(envConfig).some(v => !!v);
  if (hasEnvKeys) {
    const merged = { ...envConfig, ...savedConfig };
    localStorage.setItem("gcc_api_config", JSON.stringify(merged));
  }

  initGCC(finalConfig);
  initHyperBrain(finalConfig);
}
