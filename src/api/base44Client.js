// ══════════════════════════════════════════════════════
//  base44Client.js — SDK de Base44 para GameComicCraft
//  Provee acceso a entidades y autenticación
// ══════════════════════════════════════════════════════
import { createClient } from "@base44/sdk";

const base44 = createClient({
  appId: "69aa73f013b5c82e8989d6fc",
});

export { base44 };
export default base44;
