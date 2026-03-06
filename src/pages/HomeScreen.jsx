export const config = { requiresAuth: true };

import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";

const SUGGESTED = [
  { name:"Comic Legends MOBA", icon:"🏟️", tags:["MOBA","3 carriles"], bg:"linear-gradient(135deg,#1a0338,#0a1628)" },
  { name:"Comic-Mon Starter", icon:"🐾", tags:["Pokémon","Turnos"], bg:"linear-gradient(135deg,#031a03,#0a2810)" },
  { name:"GCC Warcraft RTS", icon:"🏰", tags:["RTS","Blizzard"], bg:"linear-gradient(135deg,#1a0303,#280a0a)" },
  { name:"GCC Diablo Mode", icon:"💀", tags:["RPG","Hordas"], bg:"linear-gradient(135deg,#1a1003,#28200a)" },
  { name:"GCC World MMO", icon:"🌌", tags:["MMO","Online"], bg:"linear-gradient(135deg,#0a0a28,#15153c)" },
];

const ACTIVITY = [
  { icon:"🎙️", bg:"rgba(0,245,255,0.08)", title:"Voice asset — Trinity Engine Activation", sub:"ElevenLabs · score 98 · hace 2h", pill:"✓", pc:"green" },
  { icon:"⚙️", bg:"rgba(124,58,237,0.08)", title:"Physics Mixer — Crash + Riot + Diablo IA", sub:"Nintendo Polish Grade AAA · hace 3h", pill:"Mix", pc:"purple" },
  { icon:"🏺", bg:"rgba(255,0,255,0.08)", title:"Modelo 3D GLB — Lía (Mage)", sub:"Tripo3D v2.5 · PBR · hace 4h", pill:"GLB", pc:"cyan" },
  { icon:"🛍️", bg:"rgba(150,191,72,0.08)", title:"Publicado en Shopify", sub:"Product ID 16158363320665 · €15.00 · hace 5h", pill:"€15", pc:"gold" },
];

const pill = (c) => {
  const m = {
    green:{background:"rgba(34,197,94,0.12)",color:"#22c55e"},
    gold:{background:"rgba(255,215,0,0.1)",color:"#ffd700"},
    purple:{background:"rgba(124,58,237,0.15)",color:"#a78bfa"},
    cyan:{background:"rgba(0,245,255,0.1)",color:"#00f5ff"},
    red:{background:"rgba(239,68,68,0.1)",color:"#ef4444"},
    shopify:{background:"rgba(150,191,72,0.1)",color:"#96bf48"},
  };
  return {...{padding:"2px 8px",borderRadius:50,fontSize:"0.6rem",fontWeight:600},...m[c]};
};

export default function HomeScreen() {
  const [project,setProject] = useState(null);
  const [characters,setChars] = useState([]);
  const [profile,setProfile] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try {
        const user = await base44.auth.me();
        const [projs,chars] = await Promise.all([
          base44.entities.GameProject.list("-created_date",1),
          base44.entities.GameCharacter.list("-created_date",10),
        ]);
        setProject(projs[0]||null);
        setChars(chars||[]);
        setProfile(user||null);
      } catch(e){console.error(e);}
      setLoading(false);
    })();
  },[]);

  if(loading) return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0f0a1e",flexDirection:"column",gap:"1rem"}}>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{width:48,height:48,border:"2px solid rgba(0,245,255,0.1)",borderTopColor:"#00f5ff",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <div style={{color:"#5a7090",fontSize:"0.75rem",letterSpacing:3,fontFamily:"monospace"}}>GCC ENGINE...</div>
    </div>
  );

  return(
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0f0a1e;font-family:'Inter',sans-serif;color:#e8e0f5}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#7c3aed;border-radius:2px}
        a{text-decoration:none;color:inherit}
        .sb-item{display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.8rem;border-radius:8px;cursor:pointer;font-size:0.82rem;color:#7060a0;transition:all 0.2s;margin-bottom:2px}
        .sb-item:hover{background:rgba(124,58,237,0.1);color:#e8e0f5}
        .sb-active{background:linear-gradient(135deg,rgba(124,58,237,0.25),rgba(233,30,140,0.1));color:#e8e0f5;border:1px solid rgba(124,58,237,0.25)}
        .stat-card{background:#1a1035;border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:1rem;display:flex;align-items:center;gap:0.8rem;cursor:pointer;transition:all 0.2s}
        .stat-card:hover{border-color:rgba(124,58,237,0.4);transform:translateY(-2px)}
        .game-card{flex-shrink:0;width:180px;background:#1a1035;border:1px solid rgba(124,58,237,0.2);border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.3s}
        .game-card:hover{transform:translateY(-4px);border-color:rgba(124,58,237,0.5);box-shadow:0 12px 30px rgba(0,0,0,0.4)}
        .lib-item{display:flex;align-items:center;gap:0.8rem;padding:0.6rem 0.4rem;border-radius:8px;cursor:pointer;transition:all 0.2s;border-bottom:1px solid rgba(124,58,237,0.08)}
        .lib-item:hover{background:rgba(124,58,237,0.08)}
        .lib-item:last-child{border-bottom:none}
        .act-item{display:flex;align-items:center;gap:0.8rem;padding:0.8rem 1rem;border-bottom:1px solid rgba(124,58,237,0.08);cursor:pointer;transition:all 0.2s}
        .act-item:last-child{border-bottom:none}
        @media(max-width:900px){.sidebar-col{display:none!important}.two-col{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>

      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:"#0f0a1e"}}>

        {/* SIDEBAR */}
        <div className="sidebar-col" style={{width:220,flexShrink:0,background:"#160d2e",borderRight:"1px solid rgba(124,58,237,0.2)",display:"flex",flexDirection:"column",padding:"1.2rem 0",overflowY:"auto"}}>
          <div style={{padding:"0 1.2rem 1.5rem",display:"flex",alignItems:"center",gap:"0.6rem"}}>
            <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#7c3aed,#e91e8c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>🐧</div>
            <div style={{fontFamily:"monospace",fontSize:"0.85rem",fontWeight:900,color:"#00f5ff",letterSpacing:1}}>GCC</div>
          </div>
          <div style={{padding:"0 1.2rem",marginBottom:"0.8rem"}}>
            <div style={{fontSize:"0.6rem",letterSpacing:"2px",textTransform:"uppercase",color:"#7060a0",marginBottom:"0.5rem",padding:"0 0.4rem"}}>Principal</div>
            {[{icon:"🏠",label:"Dashboard",href:"HomeScreen",active:true},{icon:"🎮",label:"Mis Juegos",href:"Projects"},{icon:"🏪",label:"Store",href:"Store"},{icon:"👥",label:"Personajes",href:"Characters"},{icon:"⚙️",label:"Physics Mixer",href:"Physics"},{icon:"▶️",label:"Play & Test",href:"TestScreen"}].map(n=>(
              <a key={n.href} href={createPageUrl(n.href)} className={`sb-item${n.active?" sb-active":""}`}>
                <span style={{fontSize:"1rem",width:20,textAlign:"center"}}>{n.icon}</span>{n.label}
              </a>
            ))}
          </div>
          <div style={{height:1,background:"rgba(124,58,237,0.2)",margin:"0 1.2rem"}}/>
          <div style={{padding:"0.8rem 1.2rem 0"}}>
            <div style={{fontSize:"0.6rem",letterSpacing:"2px",textTransform:"uppercase",color:"#7060a0",marginBottom:"0.5rem",padding:"0 0.4rem"}}>Herramientas</div>
            {[{icon:"🎙️",label:"Voces",href:"VoicesScreen"},{icon:"🗂️",label:"Assets",href:"AssetsScreen"},{icon:"📣",label:"Marketing",href:"MarketingScreen"}].map(n=>(
              <a key={n.href} href={createPageUrl(n.href)} className="sb-item">
                <span style={{fontSize:"1rem",width:20,textAlign:"center"}}>{n.icon}</span>{n.label}
              </a>
            ))}
          </div>
          <div style={{height:1,background:"rgba(124,58,237,0.2)",margin:"0.8rem 1.2rem"}}/>
          <div style={{padding:"0 1.2rem",marginTop:"auto"}}>
            <div style={{fontSize:"0.6rem",letterSpacing:"2px",textTransform:"uppercase",color:"#7060a0",marginBottom:"0.5rem"}}>Online ahora</div>
            {characters.slice(0,2).map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.4rem",borderRadius:8,marginBottom:2}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#e91e8c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:700,color:"#fff",position:"relative",flexShrink:0}}>
                  {c.name?.[0]}<div style={{position:"absolute",bottom:0,right:0,width:7,height:7,borderRadius:"50%",background:"#22c55e",border:"1px solid #160d2e"}}/>
                </div>
                <div><div style={{fontSize:"0.75rem",fontWeight:500}}>{c.name}</div><div style={{fontSize:"0.6rem",color:"#7060a0"}}>Personaje activo</div></div>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.4rem",borderRadius:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#00f5ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:700,color:"#fff",position:"relative",flexShrink:0}}>
                {profile?.display_name?.[0]||"J"}<div style={{position:"absolute",bottom:0,right:0,width:7,height:7,borderRadius:"50%",background:"#22c55e",border:"1px solid #160d2e"}}/>
              </div>
              <div><div style={{fontSize:"0.75rem",fontWeight:500}}>{profile?.display_name||"Joan Sadia Gil"}</div><div style={{fontSize:"0.6rem",color:"#7060a0"}}>⭐ Super Creator</div></div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* TOPBAR */}
          <div style={{height:58,background:"rgba(15,10,30,0.9)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(124,58,237,0.2)",display:"flex",alignItems:"center",gap:"1rem",padding:"0 1.5rem",flexShrink:0}}>
            <div style={{flex:1,maxWidth:340,position:"relative"}}>
              <span style={{position:"absolute",left:"0.7rem",top:"50%",transform:"translateY(-50%)",color:"#7060a0"}}>🔍</span>
              <input style={{width:"100%",background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:8,padding:"0.5rem 1rem 0.5rem 2.2rem",color:"#e8e0f5",fontSize:"0.82rem",outline:"none",fontFamily:"inherit"}} placeholder="Buscar juegos, personajes, assets..."/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"0.8rem",marginLeft:"auto"}}>
              <div style={{width:34,height:34,borderRadius:8,background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                🔔<div style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:"#e91e8c",border:"1px solid #0f0a1e"}}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"0.6rem",cursor:"pointer",padding:"0.3rem 0.6rem",borderRadius:8,border:"1px solid rgba(124,58,237,0.2)"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#e91e8c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.82rem",fontWeight:700,color:"#fff"}}>{profile?.display_name?.[0]||"J"}</div>
                <div>
                  <div style={{fontSize:"0.8rem",fontWeight:600}}>{profile?.display_name||"Joan Sadia Gil"}</div>
                  <div style={{fontSize:"0.62rem",color:"#7060a0"}}>⭐ Super Creator</div>
                </div>
              </div>
              <div style={{width:34,height:34,borderRadius:8,background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>⚙️</div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{flex:1,overflowY:"auto",padding:"1.5rem"}}>

            {/* HERO */}
            {project&&(
              <div style={{borderRadius:16,overflow:"hidden",position:"relative",height:280,marginBottom:"1.5rem",cursor:"pointer"}} onClick={()=>window.location.href=createPageUrl("TestScreen")}>
                {project.cover_image_url
                  ?<img src={project.cover_image_url} alt={project.title} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  :<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#1a0a3e,#0a1628,#2a0a1e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"5rem"}}>🐧</div>
                }
                <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(15,10,30,0.92) 0%,rgba(15,10,30,0.5) 60%,transparent 100%)"}}/>
                <div style={{position:"absolute",inset:0,padding:"2rem",display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:500}}>
                  <div style={{display:"inline-flex",background:"#e91e8c",color:"#fff",padding:"0.25rem 0.8rem",borderRadius:4,fontSize:"0.68rem",fontWeight:700,marginBottom:"0.8rem",width:"fit-content"}}>🔥 En juego ahora</div>
                  <div style={{fontFamily:"monospace",fontSize:"1.8rem",fontWeight:900,lineHeight:1.2,marginBottom:"0.8rem"}}>{project.title}</div>
                  <div style={{fontSize:"0.82rem",color:"rgba(232,224,245,0.75)",lineHeight:1.6,marginBottom:"1.2rem",maxWidth:360}}>{(project.description||"").slice(0,110)}...</div>
                  <button style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"linear-gradient(135deg,#7c3aed,#e91e8c)",color:"#fff",border:"none",borderRadius:8,padding:"0.6rem 1.4rem",fontSize:"0.85rem",fontWeight:700,cursor:"pointer",width:"fit-content"}} onClick={e=>{e.stopPropagation();window.location.href=createPageUrl("TestScreen")}}>▶ Jugar ahora</button>
                </div>
                <div style={{position:"absolute",bottom:"1.2rem",left:"2rem",display:"flex",gap:"0.5rem"}}>
                  {[project.genre,project.engine,project.format,project.price&&`€${project.price}`].filter(Boolean).map(p=>(
                    <div key={p} style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"0.25rem 0.7rem",fontSize:"0.65rem"}}>{p}</div>
                  ))}
                </div>
              </div>
            )}

            {/* STATS */}
            <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"1.5rem"}}>
              {[
                {icon:"🗂️",bg:"rgba(124,58,237,0.15)",val:profile?.total_assets||25,lbl:"Assets",href:"AssetsScreen"},
                {icon:"🎙️",bg:"rgba(0,245,255,0.08)",val:profile?.total_voice_assets||18,lbl:"Voces",href:"VoicesScreen"},
                {icon:"👥",bg:"rgba(233,30,140,0.1)",val:characters.length||2,lbl:"Personajes",href:"Characters"},
                {icon:"💰",bg:"rgba(255,215,0,0.08)",val:`€${profile?.total_revenue||15}`,lbl:"Shopify",href:"MarketingScreen",gold:true},
              ].map(s=>(
                <div key={s.lbl} className="stat-card" onClick={()=>window.location.href=createPageUrl(s.href)}>
                  <div style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0,background:s.bg}}>{s.icon}</div>
                  <div>
                    <div style={{fontFamily:"monospace",fontSize:s.gold?"1.1rem":"1.3rem",fontWeight:900,color:s.gold?"#ffd700":"#00f5ff"}}>{s.val}</div>
                    <div style={{fontSize:"0.65rem",color:"#7060a0",marginTop:2}}>{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* DOS COLUMNAS */}
            <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:"1.5rem"}}>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                  <div style={{fontSize:"0.95rem",fontWeight:700}}>✨ También te puede gustar</div>
                  <div style={{fontSize:"0.75rem",color:"#9d5cf5",cursor:"pointer"}} onClick={()=>window.location.href=createPageUrl("Projects")}>Ver más →</div>
                </div>
                <div style={{display:"flex",gap:"1rem",overflowX:"auto",paddingBottom:"0.5rem"}}>
                  {SUGGESTED.map((g,i)=>(
                    <div key={i} className="game-card">
                      <div style={{width:"100%",height:120,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",background:g.bg}}>{g.icon}</div>
                      <div style={{padding:"0.7rem"}}>
                        <div style={{fontSize:"0.78rem",fontWeight:600,marginBottom:"0.3rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.name}</div>
                        <div>{g.tags.map(t=><span key={t} style={{fontSize:"0.58rem",padding:"1px 6px",borderRadius:4,background:"rgba(124,58,237,0.15)",color:"#a78bfa",border:"1px solid rgba(124,58,237,0.2)",marginRight:3}}>{t}</span>)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"1.5rem 0 1rem"}}>
                  <div style={{fontSize:"0.95rem",fontWeight:700}}>⚙️ Physics Mix Activo</div>
                  <div style={{fontSize:"0.75rem",color:"#9d5cf5",cursor:"pointer"}} onClick={()=>window.location.href=createPageUrl("Physics")}>Editar →</div>
                </div>
                <div style={{background:"#1a1035",border:"1px solid rgba(124,58,237,0.2)",borderRadius:12,padding:"1rem",display:"flex",flexWrap:"wrap",gap:"0.5rem",alignItems:"center"}}>
                  <span style={pill("purple")}>🐾 Crash (mov)</span>
                  <span style={pill("cyan")}>🏟️ Riot (hitbox)</span>
                  <span style={pill("red")}>💀 Diablo (IA)</span>
                  <span style={pill("gold")}>🍄 Mario (feel)</span>
                  <span style={{fontSize:"0.72rem",color:"#7060a0",marginLeft:"auto"}}>Rating: <span style={{color:"#ffd700",fontWeight:700}}>Miyamoto AAA ⭐</span></span>
                </div>

                <div style={{fontSize:"0.95rem",fontWeight:700,margin:"1.5rem 0 1rem"}}>📋 Actividad reciente</div>
                <div style={{background:"#1a1035",border:"1px solid rgba(124,58,237,0.2)",borderRadius:12,overflow:"hidden"}}>
                  {ACTIVITY.map((a,i)=>(
                    <div key={i} className="act-item">
                      <div style={{width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0,background:a.bg}}>{a.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"0.82rem",fontWeight:600}}>{a.title}</div>
                        <div style={{fontSize:"0.65rem",color:"#7060a0"}}>{a.sub}</div>
                      </div>
                      <span style={pill(a.pc)}>{a.pill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMNA DERECHA */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                  <div style={{fontSize:"0.95rem",fontWeight:700}}>📚 Mi Biblioteca</div>
                  <div style={{fontSize:"0.75rem",color:"#9d5cf5",cursor:"pointer"}} onClick={()=>window.location.href=createPageUrl("Projects")}>Ver todo →</div>
                </div>
                <div style={{background:"#1a1035",border:"1px solid rgba(124,58,237,0.2)",borderRadius:12,padding:"1rem"}}>
                  {project&&(
                    <div className="lib-item" onClick={()=>window.location.href=createPageUrl("TestScreen")}>
                      <div style={{width:48,height:36,borderRadius:6,flexShrink:0,overflow:"hidden",background:"linear-gradient(135deg,#1a0a3e,#0a1628)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>
                        {project.cover_image_url?<img src={project.cover_image_url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"🐧"}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:"0.78rem",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{project.title}</div>
                        <div style={{display:"flex",gap:"0.4rem",marginTop:2}}>
                          <span style={pill("green")}>Playable</span>
                          {project.price&&<span style={pill("gold")}>€{project.price}</span>}
                        </div>
                      </div>
                      <button style={{width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,#7c3aed,#e91e8c)",border:"none",color:"#fff",cursor:"pointer",flexShrink:0}}>▶</button>
                    </div>
                  )}
                  {characters.map(c=>(
                    <div key={c.id} className="lib-item" onClick={()=>window.location.href=createPageUrl("Characters")}>
                      <div style={{width:48,height:36,borderRadius:6,flexShrink:0,overflow:"hidden",background:"linear-gradient(135deg,#1a0a3e,#0a1628)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>
                        {c.concept_image_url?<img src={c.concept_image_url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(c.archetype==="Warrior"?"⚔️":"🔮")}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:"0.78rem",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                        <div style={{display:"flex",gap:"0.4rem",marginTop:2}}>
                          <span style={pill("purple")}>{c.role_in_story}</span>
                          {c.identity_locked&&<span style={pill("gold")}>🔒</span>}
                        </div>
                      </div>
                      <button style={{width:28,height:28,borderRadius:6,background:"rgba(124,58,237,0.2)",border:"none",color:"#e8e0f5",cursor:"pointer",flexShrink:0}}>›</button>
                    </div>
                  ))}
                </div>

                <div style={{marginTop:"1rem",background:"#1a1035",border:"1px solid rgba(0,245,255,0.15)",borderRadius:12,padding:"1rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.8rem"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e",animation:"blink 2s infinite"}}/>
                    <div style={{fontSize:"0.78rem",fontWeight:600}}>GCC Engine v1.0</div>
                    <div style={{marginLeft:"auto",fontSize:"0.65rem",color:"#7060a0"}}>6-AI Cluster</div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                    <span style={pill("purple")}>🎤 STT</span>
                    <span style={pill("cyan")}>🧠 Gemini</span>
                    <span style={{...pill("purple"),background:"rgba(255,0,255,0.1)",color:"#ff00ff"}}>🏺 Tripo3D</span>
                    <span style={pill("gold")}>🤖 Manus</span>
                    <span style={pill("green")}>🎙️ ElevenLabs</span>
                    <span style={pill("shopify")}>🛍️ Shopify</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}