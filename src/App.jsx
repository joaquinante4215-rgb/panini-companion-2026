
import React, { useEffect, useMemo, useState } from "react";
import { Trophy, Star, Repeat2, CheckCircle2, XCircle, BarChart3, PackageOpen, Search, Shuffle, Download, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { loadCloudAlbum, saveCloudAlbum } from "./firebase";

const groups = [
  { name: "Grupo A", teams: ["MEX", "RSA", "KOR", "CZE"] },
  { name: "Grupo B", teams: ["CAN", "BIH", "QAT", "SUI"] },
  { name: "Grupo C", teams: ["BRA", "MAR", "HAI", "SCO"] },
  { name: "Grupo D", teams: ["USA", "PAR", "AUS", "TUR"] },
  { name: "Grupo E", teams: ["GER", "CUW", "CIV", "ECU"] },
  { name: "Grupo F", teams: ["NED", "JPN", "SWE", "TUN"] },
  { name: "Grupo G", teams: ["BEL", "EGY", "IRN", "NZL"] },
  { name: "Grupo H", teams: ["ESP", "CPV", "KSA", "URU"] },
  { name: "Grupo I", teams: ["FRA", "SEN", "IRQ", "NOR"] },
  { name: "Grupo J", teams: ["ARG", "ALG", "AUT", "JOR"] },
  { name: "Grupo K", teams: ["POR", "COD", "UZB", "COL"] },
  { name: "Grupo L", teams: ["ENG", "CRO", "GHA", "PAN"] },
];

const countryNames = {
  MEX:"México", RSA:"Sudáfrica", KOR:"Corea del Sur", CZE:"República Checa",
  CAN:"Canadá", BIH:"Bosnia y Herzegovina", QAT:"Qatar", SUI:"Suiza",
  BRA:"Brasil", MAR:"Marruecos", HAI:"Haití", SCO:"Escocia",
  USA:"Estados Unidos", PAR:"Paraguay", AUS:"Australia", TUR:"Turquía",
  GER:"Alemania", CUW:"Curazao", CIV:"Costa de Marfil", ECU:"Ecuador",
  NED:"Países Bajos", JPN:"Japón", SWE:"Suecia", TUN:"Túnez",
  BEL:"Bélgica", EGY:"Egipto", IRN:"Irán", NZL:"Nueva Zelanda",
  ESP:"España", CPV:"Cabo Verde", KSA:"Arabia Saudita", URU:"Uruguay",
  FRA:"Francia", SEN:"Senegal", IRQ:"Irak", NOR:"Noruega",
  ARG:"Argentina", ALG:"Argelia", AUT:"Austria", JOR:"Jordania",
  POR:"Portugal", COD:"R. D. del Congo", UZB:"Uzbekistán", COL:"Colombia",
  ENG:"Inglaterra", CRO:"Croacia", GHA:"Ghana", PAN:"Panamá",
};

const flags = {
  MEX:"🇲🇽", RSA:"🇿🇦", KOR:"🇰🇷", CZE:"🇨🇿",
  CAN:"🇨🇦", BIH:"🇧🇦", QAT:"🇶🇦", SUI:"🇨🇭",
  BRA:"🇧🇷", MAR:"🇲🇦", HAI:"🇭🇹", SCO:"🏴",
  USA:"🇺🇸", PAR:"🇵🇾", AUS:"🇦🇺", TUR:"🇹🇷",
  GER:"🇩🇪", CUW:"🇨🇼", CIV:"🇨🇮", ECU:"🇪🇨",
  NED:"🇳🇱", JPN:"🇯🇵", SWE:"🇸🇪", TUN:"🇹🇳",
  BEL:"🇧🇪", EGY:"🇪🇬", IRN:"🇮🇷", NZL:"🇳🇿",
  ESP:"🇪🇸", CPV:"🇨🇻", KSA:"🇸🇦", URU:"🇺🇾",
  FRA:"🇫🇷", SEN:"🇸🇳", IRQ:"🇮🇶", NOR:"🇳🇴",
  ARG:"🇦🇷", ALG:"🇩🇿", AUT:"🇦🇹", JOR:"🇯🇴",
  POR:"🇵🇹", COD:"🇨🇩", UZB:"🇺🇿", COL:"🇨🇴",
  ENG:"🏴", CRO:"🇭🇷", GHA:"🇬🇭", PAN:"🇵🇦",
};

const missingByTeam = {"MEX":[3,5,6,7,9,10,13,14,15,18],"RSA":[2,5,6,9,10,11,14,15,16,18,19,20],"KOR":[4,6,10,11,12,14,16,17,19,20],"CZE":[5,11,12,16,17],"CAN":[3,4,9,11,13,15,16,17,19],"BIH":[3,4,5,9,14,15,16,17,18,19],"QAT":[1,2,4,6,7,10,11,13,14,16,18,20],"SUI":[1,4,8,9,10,12,14,15,16,19,20],"BRA":[3,4,5,6,8,10,15,16,17,19,20],"MAR":[1,4,5,8,12,15,16,17,18,20],"HAI":[3,4,6,7,13,14,16,18],"SCO":[5,7,8,9,10,11,12,13,14,15,17,18,20],"USA":[1,2,5,7,8,9,10,11,12,15,17,18,19,20],"PAR":[1,5,7,8,9,10,12,13,14,15,17,20],"AUS":[1,2,3,5,6,7,8,9,10,14,16,19,20],"TUR":[3,4,5,11,13,14,16,18,19],"GER":[2,5,7,8,9,12,16,18,20],"CUW":[1,2,4,5,6,7,9,10,11,12,13,15,18,20],"CIV":[1,3,4,7,8,9,10,11,14,15,16,18,20],"ECU":[3,4,6,9,10,11,12,13,14,16,20],"NED":[2,5,8,9,10,11,13,14,17,18,19],"JPN":[1,3,4,5,6,7,10,11,13,14,15,16,18],"SWE":[6,15,16,17,18,20],"TUN":[1,2,3,4,8,10,11,13,14,17,19],"BEL":[1,2,3,4,5,6,7,9,10,12,13,17,18,19,20],"EGY":[2,4,6,7,8,9,12,13,15,17,19,20],"IRN":[1,4,5,6,7,9,10,14,16,17,19],"NZL":[2,3,5,7,8,9,10,11,12,14,16,17,20],"ESP":[2,5,11,13,14,16,18,20],"CPV":[3,4,7,8,11,12,13,15,16,18,19],"KSA":[1,2,3,4,5,6,7,8,10,11,13,16,17,20],"URU":[3,6,9,10,13,14,15,16,17,19],"FRA":[2,3,4,5,7,8,12,15,19],"SEN":[1,4,5,7,9,10,11,19,20],"IRQ":[2,4,10,14,16,17],"NOR":[1,2,3,6,7,9,10,11,12,13,15,16,17,18,19],"ARG":[1,5,6,9,11,12,13,14,15,16,18,19,20],"ALG":[1,2,4,5,7,9,10,11,14,15,16,19,20],"AUT":[1,2,3,5,6,8,9,11,12,13,14,16,17,18,19],"JOR":[2,3,4,5,6,8,9,11,12,15,16,18,19,20],"POR":[3,4,7,10,11,12,15,16,17,18,20],"COD":[1,9,10,12,13,14,17,19],"UZB":[1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,19,20],"COL":[1,2,4,5,6,7,8,10,14,15,16,17,19,20],"ENG":[2,5,6,9,13,14,17,19],"CRO":[6,7,9,12,14,15,16,18,19,20],"GHA":[2,6,9,12,13,14,15,16,17],"PAN":[6,7,8,10,11,12,13,14,15,16,18,19]};
const duplicateByTeam = {"MEX":{"2":1,"19":1,"20":1},"RSA":{"17":1},"KOR":{"2":1,"7":1},"CZE":{"1":1,"4":2,"6":2,"7":1,"10":3,"13":1,"14":2,"15":2,"18":1},"CAN":{"5":2,"8":1,"10":1,"12":1,"18":1},"BIH":{"1":2,"2":1,"7":2,"8":1,"11":2,"13":1},"QAT":{"8":1},"SUI":{"13":1,"18":1},"BRA":{"9":1,"12":1,"18":1},"MAR":{"6":1},"HAI":{"5":1,"10":1,"12":1,"15":1},"SCO":{"6":1,"16":1},"USA":{},"PAR":{"2":1,"19":2},"AUS":{},"TUR":{"1":1,"7":1,"9":1,"10":2,"15":1,"16":1},"GER":{},"CUW":{},"CIV":{"2":1,"12":1},"ECU":{"1":1,"2":1,"5":1,"9":1,"19":1},"NED":{"7":1},"JPN":{"19":1},"SWE":{"5":2,"7":1,"9":1,"10":1},"TUN":{"5":1,"16":1},"BEL":{"8":1,"11":1,"15":1},"EGY":{"14":1,"16":1,"18":1},"IRN":{"20":1},"NZL":{"4":2,"6":1,"19":1},"ESP":{"6":1,"8":1},"CPV":{"14":1,"20":1},"KSA":{"14":1,"15":1},"URU":{"5":1,"7":2,"8":2},"FRA":{"11":1,"18":1},"SEN":{"2":1},"IRQ":{"3":2,"6":1,"7":1,"8":1,"9":3,"13":1,"15":2,"18":1},"NOR":{"8":1},"ARG":{"7":1,"17":1},"ALG":{"12":1,"13":1},"AUT":{"20":1},"JOR":{"10":1},"POR":{"13":1,"14":1},"COD":{"5":1,"7":1,"15":1,"18":3,"20":1},"UZB":{},"COL":{"13":1},"ENG":{"3":1,"4":1,"8":1,"16":1},"CRO":{"5":1,"11":1},"GHA":{"18":1},"PAN":{"9":1}};

function initialCollection() {
  const data = {};
  groups.flatMap(g => g.teams).forEach(code => {
    const missing = new Set(missingByTeam[code] || []);
    const dupes = duplicateByTeam[code] || {};
    data[code] = Array.from({ length: 20 }, (_, i) => {
      const number = i + 1;
      return { number, owned: !missing.has(number), duplicates: Number(dupes[String(number)] || 0), traded: 0 };
    });
  });
  return data;
}

function initialSpecials() {
  return Array.from({ length: 34 }, (_, i) => ({
    id: `ESP${i + 1}`,
    name: `Especial ${i + 1}`,
    owned: false,
    duplicates: 0,
    traded: 0
  }));
}

function safeLoad(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [collection, setCollection] = useState(() => safeLoad("panini2026_collection", initialCollection()));
  const [specials, setSpecials] = useState(() => safeLoad("panini2026_specials", initialSpecials()));
  const [selectedTeam, setSelectedTeam] = useState("MEX");
  const [tab, setTab] = useState("capture");
  const [query, setQuery] = useState("");
  const [quickCode, setQuickCode] = useState("");
  const [captureFeedback, setCaptureFeedback] = useState(null);
  const [packs, setPacks] = useState(() => Number(localStorage.getItem("panini2026_packs") || 0));
  const [log, setLog] = useState(() => safeLoad("panini2026_log", []));
  const [undoStack, setUndoStack] = useState(() => safeLoad("panini2026_undo", []));
  const [cloudStatus, setCloudStatus] = useState("local");
  const [cloudReady, setCloudReady] = useState(false);

  useEffect(() => localStorage.setItem("panini2026_collection", JSON.stringify(collection)), [collection]);
  useEffect(() => localStorage.setItem("panini2026_specials", JSON.stringify(specials)), [specials]);
  useEffect(() => localStorage.setItem("panini2026_log", JSON.stringify(log)), [log]);
  useEffect(() => localStorage.setItem("panini2026_packs", String(packs)), [packs]);
  useEffect(() => localStorage.setItem("panini2026_undo", JSON.stringify(undoStack)), [undoStack]);

  useEffect(() => {
    async function startCloudSync() {
      try {
        setCloudStatus("cargando nube");
        const cloudData = await loadCloudAlbum();

        if (cloudData && cloudData.collection) {
          setCollection(cloudData.collection);
          setSpecials(cloudData.specials || initialSpecials());
          setPacks(Number(cloudData.packs || 0));
          setLog(Array.isArray(cloudData.log) ? cloudData.log : []);
          setUndoStack(Array.isArray(cloudData.undoStack) ? cloudData.undoStack : []);
          setCloudStatus("sincronizado");
        } else {
          setCloudStatus("nube inicializada");
        }

        setCloudReady(true);
      } catch (error) {
        console.error("Firebase load error", error);
        setCloudStatus("modo local");
        setCloudReady(false);
      }
    }

    startCloudSync();
  }, []);


  useEffect(() => {
    if (!cloudReady) return;

    const timeout = window.setTimeout(async () => {
      try {
        setCloudStatus("guardando");
        await saveCloudAlbum({
          collection,
          specials,
          packs,
          log,
          undoStack
        });
        setCloudStatus("sincronizado");
      } catch (error) {
        console.error("Firebase save error", error);
        setCloudStatus("error nube");
      }
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [collection, specials, packs, log, undoStack, cloudReady]);

  const totals = useMemo(() => {
    const normal = Object.values(collection).flat();
    const all = [...normal, ...specials];
    const total = all.length;
    const owned = all.filter(s => s.owned).length;
    const missing = total - owned;
    const dupes = all.reduce((a, s) => a + s.duplicates, 0);
    const traded = all.reduce((a, s) => a + s.traded, 0);
    const availableDupes = dupes - traded;
    const normalOwned = normal.filter(s => s.owned).length;
    const specialOwned = specials.filter(s => s.owned).length;
    const progress = Math.round((owned / total) * 1000) / 10;
    const nextNewProbability = Math.round((missing / total) * 1000) / 10;
    const estimatedRemainingStickers = missing > 0 ? Math.ceil(total * Math.log(total / Math.max(1, owned))) : 0;
    const estimatedPacks = Math.ceil(estimatedRemainingStickers / 5);
    return { total, owned, missing, dupes, traded, availableDupes, normalOwned, specialOwned, progress, nextNewProbability, estimatedPacks };
  }, [collection, specials]);

  function addLog(text) {
    const now = new Date();
    setLog(prev => [{ text, time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...prev].slice(0, 30));
  }

  function showFeedback(type, title, detail) {
    setCaptureFeedback({ type, title, detail });
    window.setTimeout(() => setCaptureFeedback(null), 1800);
  }

  function suggestTeamCode(inputCode) {
    const codes = Object.keys(collection);
    if (!inputCode) return null;
    const firstLetter = inputCode[0];
    const starts = codes.find(code => code.startsWith(firstLetter));
    if (starts) return starts;
    return codes.find(code => code.includes(firstLetter)) || null;
  }

  function saveUndoSnapshot(label) {
    setUndoStack(prev => [{
      label,
      collection,
      specials,
      packs,
      log
    }, ...prev].slice(0, 10));
  }

  function undoLastAction() {
    const last = undoStack[0];
    if (!last) {
      addLog("No hay movimientos para deshacer");
      return;
    }
    setCollection(last.collection);
    setSpecials(last.specials);
    setPacks(last.packs);
    setLog([{ text: `Deshacer: ${last.label}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...last.log].slice(0, 30));
    setUndoStack(prev => prev.slice(1));
  }

  function exportBackup() {
    const backup = {
      version: 4,
      createdAt: new Date().toISOString(),
      collection,
      specials,
      packs,
      log,
      undoStack
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `panini-backup-${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showFeedback("new", "Respaldo exportado", "Archivo descargado correctamente");
    addLog("Respaldo exportado");
  }

  function importBackup(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.collection || typeof data.collection !== "object") {
          throw new Error("Archivo inválido");
        }

        saveUndoSnapshot("importar respaldo");

        setCollection(data.collection || initialCollection());
        setSpecials(data.specials || initialSpecials());
        setPacks(Number(data.packs || 0));
        setLog(Array.isArray(data.log) ? data.log : []);
        setUndoStack(Array.isArray(data.undoStack) ? data.undoStack : []);

        showFeedback("new", "Respaldo importado", "El álbum fue restaurado correctamente");
        addLog("Respaldo importado");
      } catch (err) {
        showFeedback("error", "Error al importar", "El archivo no es válido");
        addLog("Error al importar respaldo");
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  }

  function markOwned(code, n) {
    saveUndoSnapshot(`${code}${n}: marcar como conseguida`);
    const wasMissing = collection?.[code]?.find(s => s.number === n && !s.owned);
    setCollection(prev => ({ ...prev, [code]: prev[code].map(s => s.number === n ? { ...s, owned: true } : s) }));
    addLog(`${code}${n}: ${wasMissing ? "nueva conseguida" : "ya estaba conseguida"}`);
  }

  function addDuplicate(code, n) {
    saveUndoSnapshot(`${code}${n}: agregar repetida`);
    setCollection(prev => ({ ...prev, [code]: prev[code].map(s => s.number === n ? { ...s, owned: true, duplicates: s.duplicates + 1 } : s) }));
    addLog(`${code}${n}: repetida agregada`);
  }

  function markTraded(code, n) {
    saveUndoSnapshot(`${code}${n}: marcar cambiada`);
    setCollection(prev => ({ ...prev, [code]: prev[code].map(s => s.number === n && s.traded < s.duplicates ? { ...s, traded: s.traded + 1 } : s) }));
    addLog(`${code}${n}: marcada como cambiada`);
  }

  function processQuickCode() {
    const raw = quickCode.trim().toUpperCase().replace(/\s+/g, "");
    const match = raw.match(/^([A-Z]{2,3})(\d{1,2})$/);

    if (!match) {
      addLog(`Código no válido: ${quickCode}`);
      showFeedback("error", "Código no válido", "Usa formato tipo MEX7 o ARG19");
      setQuickCode("");
      return;
    }

    const typedCode = match[1];
    const number = Number(match[2]);
    const code = typedCode.length === 2 ? suggestTeamCode(typedCode) : typedCode;

    if (!collection[code]) {
      addLog(`No encontré el país ${typedCode}`);
      showFeedback("error", "País no encontrado", `Revisa el código ${typedCode}`);
      setQuickCode("");
      return;
    }

    if (number < 1 || number > 20) {
      addLog(`${code}${number}: número fuera de rango`);
      showFeedback("error", "Número fuera de rango", `${countryNames[code]} solo tiene estampas del 1 al 20`);
      setQuickCode("");
      return;
    }

    const sticker = collection[code].find(s => s.number === number);
    if (sticker?.owned) {
      addDuplicate(code, number);
      showFeedback("duplicate", `${code}${number} repetida`, "Se agregó a repetidas");
    } else {
      markOwned(code, number);
      showFeedback("new", `${code}${number} nueva`, "Se marcó como conseguida");
    }

    setQuickCode("");
  }

  const filteredGroups = groups.map(g => ({
    ...g,
    teams: g.teams.filter(code => `${code} ${countryNames[code]}`.toLowerCase().includes(query.toLowerCase()))
  })).filter(g => g.teams.length);

  return (
    <div className="app">
      <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="hero">
        <div>
          <div className="eyebrow"><Trophy size={18}/> Panini Companion 2026</div>
          <h1>Mi Álbum del Mundial</h1>
          <p>Captura express, repetidas, intercambios y numeralia en tiempo real.</p>
        </div>
        <div className="progressCard">
          <span>Avance total</span>
          <strong>{totals.progress}%</strong>
          <div className="bar"><div style={{ width: `${totals.progress}%` }} /></div>
          <small>{totals.owned}/{totals.total} estampas</small>
        </div>
      </motion.header>

      <div className={`saveBox cloud ${cloudStatus.replace(" ", "-")}`}>Guardado automático: {cloudStatus}. También hay respaldo local en este dispositivo.</div>

      <nav className="tabs">
        <button onClick={() => setTab("capture")} className={tab === "capture" ? "active" : ""}><PackageOpen size={17}/> Abrí sobre</button>
        <button onClick={() => setTab("album")} className={tab === "album" ? "active" : ""}><Trophy size={17}/> Mi álbum</button>
        <button onClick={() => setTab("stats")} className={tab === "stats" ? "active" : ""}><BarChart3 size={17}/> Numeralia</button>
        <button onClick={() => setTab("duplicates")} className={tab === "duplicates" ? "active" : ""}><Repeat2 size={17}/> Repetidas</button>
        <button onClick={() => setTab("specials")} className={tab === "specials" ? "active" : ""}><Star size={17}/> Especiales</button>
        <button onClick={undoLastAction} className="undo">Deshacer</button>
        <button onClick={exportBackup} className="backupBtn"><Download size={17}/> Exportar</button>
        <label className="backupBtn importBtn"><Upload size={17}/> Importar<input type="file" accept="application/json" onChange={importBackup} hidden /></label>
        <button onClick={async () => {
          try {
            setCloudStatus("guardando");
            await saveCloudAlbum({ collection, specials, packs, log, undoStack });
            setCloudStatus("sincronizado");
            showFeedback("new", "Nube actualizada", "Avance guardado en Firebase");
          } catch (error) {
            setCloudStatus("error nube");
            showFeedback("error", "Error en nube", "No se pudo guardar en Firebase");
          }
        }} className="backupBtn cloudBtn">Guardar nube</button>
      </nav>

      {tab === "capture" && (
        <section className="card">
          <h2><PackageOpen/> Abrí un sobre</h2>
          <p>Captura continua: escribe <b>MEX7</b>, presiona Enter y sigue con la siguiente. La app decide si es nueva o repetida.</p>
          <div className={captureFeedback ? `captureFeedback ${captureFeedback.type}` : "captureFeedback idle"}>
            {captureFeedback ? (
              <>
                <strong>{captureFeedback.title}</strong>
                <span>{captureFeedback.detail}</span>
              </>
            ) : (
              <>
                <strong>Lista para capturar</strong>
                <span>Formato: código de país + número. Ej. MEX7</span>
              </>
            )}
          </div>
          <div className="quick">
            <input value={quickCode} onChange={e => setQuickCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && processQuickCode()} placeholder="MEX7" autoFocus />
            <button onClick={processQuickCode}>Capturar</button>
          </div>
          <div className="quickTeams">
            {["MEX","ARG","BRA","POR","FRA","ESP","USA","GER"].map(code => (
              <button key={code} onClick={() => setQuickCode(code)}>{flags[code]} {code}</button>
            ))}
          </div>
          <div className="manual">
            <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
              {Object.keys(collection).map(code => <option key={code} value={code}>{code} - {countryNames[code]}</option>)}
            </select>
            <select id="manualNum">
              {Array.from({ length: 20 }, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <button onClick={() => markOwned(selectedTeam, Number(document.getElementById("manualNum").value))}><CheckCircle2/> Nueva</button>
            <button onClick={() => addDuplicate(selectedTeam, Number(document.getElementById("manualNum").value))}><Repeat2/> Repetida</button>
            <button onClick={() => { saveUndoSnapshot("sumar sobre abierto"); setPacks(p => p + 1); }}>+ Sobre abierto ({packs})</button>
          </div>
          <h3>Últimos movimientos</h3>
          <div className="log">
            {log.length === 0 ? <p className="muted">Aún no hay capturas.</p> : log.map((item, i) => (
              <div key={i}><span>{item.text}</span><small>{item.time}</small></div>
            ))}
          </div>
        </section>
      )}

      {tab === "album" && (
        <>
          <div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar país o código..." /></div>
          <div className="groups">
            {filteredGroups.map(group => (
              <section className="card group" key={group.name}>
                <h3>{group.name}</h3>
                {group.teams.map(code => {
                  const owned = collection[code].filter(s => s.owned).length;
                  return (
                    <button key={code} onClick={() => setSelectedTeam(code)} className={selectedTeam === code ? "team activeTeam" : "team"}>
                      <span>{flags[code]} <b>{countryNames[code]}</b><small>{code}</small></span>
                      <strong>{owned}/20</strong>
                    </button>
                  )
                })}
              </section>
            ))}
          </div>
          <TeamDetail code={selectedTeam} stickers={collection[selectedTeam]} markOwned={markOwned} addDuplicate={addDuplicate} markTraded={markTraded} />
        </>
      )}

      {tab === "stats" && <Stats totals={totals} packs={packs}/>}
      {tab === "duplicates" && <Duplicates collection={collection} markTraded={markTraded}/>}
      {tab === "specials" && <Specials specials={specials} setSpecials={setSpecials}/>}
    </div>
  )
}

function TeamDetail({ code, stickers, markOwned, addDuplicate, markTraded }) {
  const owned = stickers.filter(s => s.owned).length;
  return (
    <section className="card">
      <h2>{flags[code]} {countryNames[code]} <small>{owned}/20</small></h2>
      <div className="stickers">
        {stickers.map(s => (
          <div className={s.owned ? "sticker owned" : "sticker missing"} key={s.number}>
            <b>{s.number}</b>
            <span>{s.owned ? "Tengo" : "Falta"}</span>
            <div className="miniBtns">
              <button onClick={() => markOwned(code, s.number)}>✓</button>
              <button onClick={() => addDuplicate(code, s.number)}>R</button>
              <button onClick={() => markTraded(code, s.number)}>C</button>
            </div>
            {(s.duplicates > 0 || s.traded > 0) && <small>R:{s.duplicates} C:{s.traded}</small>}
          </div>
        ))}
      </div>
    </section>
  )
}

function Stats({ totals, packs }) {
  const rows = [
    ["Conseguidas", `${totals.owned}/${totals.total}`],
    ["Normales", `${totals.normalOwned}/960`],
    ["Especiales", `${totals.specialOwned}/34`],
    ["Faltantes", totals.missing],
    ["Repetidas disponibles", totals.availableDupes],
    ["Repetidas cambiadas", totals.traded],
    ["Probabilidad próxima nueva", `${totals.nextNewProbability}%`],
    ["Sobres estimados faltantes", totals.estimatedPacks],
    ["Sobres abiertos", packs],
  ];
  return <section className="stats">{rows.map(([a,b]) => <div className="stat" key={a}><span>{a}</span><strong>{b}</strong></div>)}</section>
}

function Duplicates({ collection, markTraded }) {
  const rows = Object.entries(collection).map(([code, stickers]) => ({ code, stickers: stickers.filter(s => s.duplicates > s.traded) })).filter(r => r.stickers.length);
  return <div className="groups">{rows.map(r => <section className="card" key={r.code}><h3>{flags[r.code]} {countryNames[r.code]}</h3><div className="chips">{r.stickers.map(s => <button key={s.number} onClick={() => markTraded(r.code, s.number)}>{s.number} × {s.duplicates - s.traded}</button>)}</div></section>)}</div>
}

function Specials({ specials, setSpecials }) {
  function update(id, action) {
    setUndoStack(prev => [{ label: `${id}: actualizar especial`, collection, specials, packs, log }, ...prev].slice(0, 10));
    setSpecials(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (action === "owned") return { ...s, owned: true };
      if (action === "dupe") return { ...s, owned: true, duplicates: s.duplicates + 1 };
      if (action === "trade" && s.traded < s.duplicates) return { ...s, traded: s.traded + 1 };
      return s;
    }));
  }
  return <section className="card"><h2><Star/> Especiales</h2><div className="specials">{specials.map(s => <div className={s.owned ? "special owned" : "special"} key={s.id}><b>{s.id}</b><span>{s.name}</span><small>R:{s.duplicates} C:{s.traded}</small><div><button onClick={() => update(s.id, "owned")}>Tengo</button><button onClick={() => update(s.id, "dupe")}>Repetida</button><button onClick={() => update(s.id, "trade")}>Cambiada</button></div></div>)}</div></section>
}
