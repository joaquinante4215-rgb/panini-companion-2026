
import React, { useEffect, useMemo, useState } from "react";
import { Trophy, Star, Repeat2, CheckCircle2, XCircle, BarChart3, PackageOpen, Search, Shuffle, Download, Upload, Trash2, PlusCircle, TrendingUp, Target, Wallet, CalendarDays, Medal } from "lucide-react";
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
  const panini = [{ id: "PANINI00", group: "Panini", code: "PAN", number: "00", label: "Panini 00" }];

  const fwc = Array.from({ length: 19 }, (_, i) => ({
    id: `FWC${i + 1}`,
    group: "FWC",
    code: "FWC",
    number: i + 1,
    label: `FWC ${i + 1}`
  }));

  const cocaCola = Array.from({ length: 14 }, (_, i) => ({
    id: `CC${i + 1}`,
    group: "Coca Cola",
    code: "CC",
    number: i + 1,
    label: `Coca Cola ${i + 1}`
  }));

  return [...panini, ...fwc, ...cocaCola].map(item => ({
    ...item,
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
  const [captureCount, setCaptureCount] = useState(() => Number(localStorage.getItem("panini2026_captureCount") || 0));
  const packs = Math.floor(captureCount / 7);
  const [log, setLog] = useState(() => safeLoad("panini2026_log", []));
  const [showLog, setShowLog] = useState(false);
  const [extraStickers, setExtraStickers] = useState(() => safeLoad("panini2026_extraStickers", []));
  const [undoStack, setUndoStack] = useState(() => safeLoad("panini2026_undo", []));
  const [cloudStatus, setCloudStatus] = useState("local");
  const [cloudReady, setCloudReady] = useState(false);

  useEffect(() => localStorage.setItem("panini2026_collection", JSON.stringify(collection)), [collection]);
  useEffect(() => localStorage.setItem("panini2026_specials", JSON.stringify(specials)), [specials]);
  useEffect(() => localStorage.setItem("panini2026_log", JSON.stringify(log)), [log]);
  useEffect(() => localStorage.setItem("panini2026_captureCount", String(captureCount)), [captureCount]);
  useEffect(() => localStorage.setItem("panini2026_extraStickers", JSON.stringify(extraStickers)), [extraStickers]);
  useEffect(() => localStorage.setItem("panini2026_undo", JSON.stringify(undoStack)), [undoStack]);

  useEffect(() => {
    async function startCloudSync() {
      try {
        setCloudStatus("cargando nube");
        const cloudData = await loadCloudAlbum();

        if (cloudData && cloudData.collection) {
          setCollection(cloudData.collection);
          setSpecials(cloudData.specials || initialSpecials());
          setCaptureCount(Number(cloudData.captureCount || Number(cloudData.packs || 0) * 7 || 0));
          setExtraStickers(Array.isArray(cloudData.extraStickers) ? cloudData.extraStickers : []);
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
          undoStack,
          extraStickers,
          captureCount
        });
        setCloudStatus("sincronizado");
      } catch (error) {
        console.error("Firebase save error", error);
        setCloudStatus("error nube");
      }
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [collection, specials, captureCount, log, undoStack, extraStickers, cloudReady]);

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
        const completionByTeam = Object.entries(collection).map(([code, stickers]) => ({
      code,
      name: countryNames[code],
      owned: stickers.filter(s => s.owned).length,
      missing: stickers.filter(s => !s.owned).length,
      duplicates: stickers.reduce((sum, s) => sum + s.duplicates, 0)
    })).sort((a, b) => b.owned - a.owned);

    const completedTeams = completionByTeam.filter(t => t.owned === 20).length;
    const almostTeams = completionByTeam.filter(t => t.owned >= 17 && t.owned < 20).length;
    const weakestTeams = [...completionByTeam].sort((a, b) => a.owned - b.owned).slice(0, 5);
    const strongestTeams = completionByTeam.slice(0, 5);
    const usefulRate = Math.round((owned / Math.max(1, owned + dupes)) * 1000) / 10;
    const duplicateRate = Math.round((dupes / Math.max(1, owned + dupes)) * 1000) / 10;
    const expectedUsefulPerPack = Math.round((nextNewProbability / 100) * 7 * 10) / 10;
    const recommendedMode = nextNewProbability > 35 ? "Comprar sobres" : nextNewProbability > 18 ? "Comprar + intercambiar" : "Priorizar intercambio";
    const estimatedCostRemaining = estimatedPacks * 21;
    const albumIntensity = progress >= 90 ? "Recta final" : progress >= 70 ? "Etapa difícil" : progress >= 40 ? "Buen ritmo" : "Arranque";

    return { total, owned, missing, dupes, traded, availableDupes, normalOwned, specialOwned, progress, nextNewProbability, estimatedPacks, completionByTeam, completedTeams, almostTeams, weakestTeams, strongestTeams, usefulRate, duplicateRate, expectedUsefulPerPack, recommendedMode, estimatedCostRemaining, albumIntensity };
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
      captureCount,
      packs,
      log,
      extraStickers
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
    setCaptureCount(Number(last.captureCount || Number(last.packs || 0) * 7 || 0));
    setExtraStickers(Array.isArray(last.extraStickers) ? last.extraStickers : extraStickers);
    setLog([{ text: `Deshacer: ${last.label}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...last.log].slice(0, 30));
    setUndoStack(prev => prev.slice(1));
  }

  function exportBackup() {
    const backup = {
      version: 4,
      createdAt: new Date().toISOString(),
      collection,
      specials,
      captureCount,
      packs,
      log,
      extraStickers,
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
        setCaptureCount(Number(data.captureCount || Number(data.packs || 0) * 7 || 0));
        setExtraStickers(Array.isArray(data.extraStickers) ? data.extraStickers : []);
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

  function removeNormalCapture(code, n) {
    const sticker = collection?.[code]?.find(s => s.number === n);
    if (!sticker) return;

    saveUndoSnapshot(`${code}${n}: quitar captura`);

    setCollection(prev => ({
      ...prev,
      [code]: prev[code].map(s => {
        if (s.number !== n) return s;
        if (s.duplicates > s.traded) return { ...s, duplicates: s.duplicates - 1 };
        if (s.owned) return { ...s, owned: false };
        return s;
      })
    }));

    setCaptureCount(prev => Math.max(0, prev - 1));
    addLog(`${code}${n}: captura retirada`);
    showFeedback("error", `${code}${n} retirada`, "Se corrigió la captura");
  }

  function processSpecialQuickCode(specialId) {
    const special = specials.find(item => item.id === specialId);

    if (!special) {
      addLog(`No encontré la especial ${specialId}`);
      showFeedback("error", "Especial no encontrada", "Revisa la clave capturada");
      return;
    }

    saveUndoSnapshot(`${special.label}: capturar especial`);

    setSpecials(prev => prev.map(item => {
      if (item.id !== specialId) return item;
      if (item.owned) return { ...item, duplicates: item.duplicates + 1 };
      return { ...item, owned: true };
    }));

    if (special.owned) {
      addLog(`${special.label}: repetida agregada`);
      showFeedback("duplicate", `${special.label} repetida`, "Se agregó a repetidas especiales");
    } else {
      addLog(`${special.label}: nueva conseguida`);
      showFeedback("new", `${special.label} nueva`, "Se marcó como conseguida");
    }

    setCaptureCount(prev => prev + 1);
  }

  function removeSpecialCapture(id) {
    const special = specials.find(item => item.id === id);
    if (!special) return;

    saveUndoSnapshot(`${special.label}: quitar captura`);

    setSpecials(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (item.duplicates > item.traded) return { ...item, duplicates: item.duplicates - 1 };
      if (item.owned) return { ...item, owned: false };
      return item;
    }));

    setCaptureCount(prev => Math.max(0, prev - 1));
    addLog(`${special.label}: captura retirada`);
    showFeedback("error", `${special.label} retirada`, "Se corrigió la captura especial");
  }

  function processQuickCode() {
    const raw = quickCode.trim().toUpperCase().replace(/\s+/g, "");
    const match = raw.match(/^([A-Z]{2,6})(\d{1,2}|00)$/);

    if (!match) {
      addLog(`Código no válido: ${quickCode}`);
      showFeedback("error", "Código no válido", "Usa formato tipo MEX7 o ARG19");
      setQuickCode("");
      return;
    }

    const typedCode = match[1];
    const numberText = match[2];
    const number = Number(numberText);

    const specialId =
      (typedCode === "PAN" || typedCode === "PANINI") && numberText === "00" ? "PANINI00" :
      typedCode === "FWC" ? `FWC${number}` :
      typedCode === "CC" ? `CC${number}` :
      null;

    if (specialId) {
      processSpecialQuickCode(specialId);
      setQuickCode("");
      return;
    }

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

    setCaptureCount(prev => prev + 1);
    setQuickCode("");
  }

  function addExtraSticker(playerName, color) {
    const name = playerName.trim();
    if (!name) {
      showFeedback("error", "Falta jugador", "Escribe el nombre del jugador");
      return false;
    }

    if (extraStickers.length >= 10) {
      showFeedback("error", "Límite alcanzado", "Solo se pueden capturar 10 Extra Stickers");
      return false;
    }

    saveUndoSnapshot("agregar Extra Sticker");

    const item = {
      id: `EXTRA-${Date.now()}`,
      playerName: name,
      color,
      createdAt: new Date().toISOString()
    };

    setExtraStickers(prev => [...prev, item]);
    addLog(`Extra Sticker: ${name} (${color})`);
    showFeedback("new", "Extra Sticker agregado", `${name} · ${color}`);
    return true;
  }

  function removeExtraSticker(id) {
    const item = extraStickers.find(x => x.id === id);
    if (!item) return;

    saveUndoSnapshot("quitar Extra Sticker");
    setExtraStickers(prev => prev.filter(x => x.id !== id));
    addLog(`Extra Sticker retirado: ${item.playerName}`);
    showFeedback("error", "Extra Sticker retirado", item.playerName);
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
            await saveCloudAlbum({ collection, specials, packs, captureCount, log, undoStack, extraStickers });
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
          <p>Captura continua: escribe <b>MEX7</b>, <b>PAN00</b>, <b>FWC7</b> o <b>CC3</b>, presiona Enter y sigue con la siguiente.</p>
          <div className={captureFeedback ? `captureFeedback ${captureFeedback.type}` : "captureFeedback idle"}>
            {captureFeedback ? (
              <>
                <strong>{captureFeedback.title}</strong>
                <span>{captureFeedback.detail}</span>
              </>
            ) : (
              <>
                <strong>Lista para capturar</strong>
                <span>Formato: país + número. Ej. MEX7. Especiales: PAN00, FWC7 o CC3</span>
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
            {["PAN00","FWC","CC"].map(code => (
              <button key={code} onClick={() => setQuickCode(code)}>{code}</button>
            ))}
          </div>
          <div className="autoPacks">
            <div>
              <span>Estampas capturadas</span>
              <strong>{captureCount}</strong>
            </div>
            <div>
              <span>Sobres abiertos estimados</span>
              <strong>{packs}</strong>
              <small>1 sobre por cada 7 estampas capturadas</small>
            </div>
          </div>

          <button className="showLogBtn" onClick={() => setShowLog(prev => !prev)}>
            {showLog ? "Ocultar últimos movimientos" : "Mostrar últimos movimientos"}
          </button>

          {showLog && (
            <>
              <h3>Últimos movimientos</h3>
              <div className="log">
                {log.length === 0 ? <p className="muted">Aún no hay capturas.</p> : log.map((item, i) => (
                  <div key={i}><span>{item.text}</span><small>{item.time}</small></div>
                ))}
              </div>
            </>
          )}
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
          <TeamDetail code={selectedTeam} stickers={collection[selectedTeam]} markOwned={markOwned} addDuplicate={addDuplicate} markTraded={markTraded} removeNormalCapture={removeNormalCapture} />
        </>
      )}

      {tab === "stats" && <Stats totals={totals} packs={packs}/>}
      {tab === "duplicates" && <Duplicates collection={collection} markTraded={markTraded}/>}
      {tab === "specials" && <Specials specials={specials} setSpecials={setSpecials} removeSpecialCapture={removeSpecialCapture} extraStickers={extraStickers} addExtraSticker={addExtraSticker} removeExtraSticker={removeExtraSticker}/>}
    </div>
  )
}

function TeamDetail({ code, stickers, markOwned, addDuplicate, markTraded, removeNormalCapture }) {
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
              <button onClick={() => removeNormalCapture(code, s.number)}><Trash2 size={12}/></button>
            </div>
            {(s.duplicates > 0 || s.traded > 0) && <small>R:{s.duplicates} C:{s.traded}</small>}
          </div>
        ))}
      </div>
    </section>
  )
}

function Stats({ totals, packs }) {
  const mainStats = [
    ["Avance total", `${totals.progress}%`, <TrendingUp/>],
    ["Conseguidas", `${totals.owned}/${totals.total}`, <Trophy/>],
    ["Normales", `${totals.normalOwned}/960`, <Target/>],
    ["Especiales", `${totals.specialOwned}/34`, <Star/>],
    ["Faltantes", totals.missing, <XCircle/>],
    ["Sobres abiertos", packs, <PackageOpen/>],
    ["Repetidas disponibles", totals.availableDupes, <Repeat2/>],
    ["Eficiencia útil", `${totals.usefulRate}%`, <Medal/>],
  ];

  const smartStats = [
    ["Probabilidad próxima nueva", `${totals.nextNewProbability}%`],
    ["Útiles esperadas por sobre", `${totals.expectedUsefulPerPack}`],
    ["Tasa de repetición", `${totals.duplicateRate}%`],
    ["Sobres estimados faltantes", totals.estimatedPacks],
    ["Costo estimado restante", `$${totals.estimatedCostRemaining.toLocaleString("es-MX")} MXN`],
    ["Estrategia sugerida", totals.recommendedMode],
    ["Estado del álbum", totals.albumIntensity],
    ["Selecciones completas", totals.completedTeams],
    ["Selecciones casi completas", totals.almostTeams],
  ];

  return (
    <div className="statsPage">
      <section className="statsHero card">
        <div>
          <h2><BarChart3/> Numeralia inteligente</h2>
          <p>Lectura rápida del avance, dificultad restante y estrategia recomendada.</p>
        </div>
        <div className="bigProgress">
          <strong>{totals.progress}%</strong>
          <span>{totals.owned}/{totals.total} estampas</span>
          <div className="bar"><div style={{ width: `${totals.progress}%` }} /></div>
        </div>
      </section>

      <section className="stats">{mainStats.map(([a,b,icon]) => (
        <div className="stat" key={a}><span>{a}{icon}</span><strong>{b}</strong></div>
      ))}</section>

      <section className="card">
        <h2><Target/> Recomendación</h2>
        <div className={`recommendation ${totals.recommendedMode.includes("sobres") ? "packs" : totals.recommendedMode.includes("+") ? "mixed" : "trade"}`}>
          <strong>{totals.recommendedMode}</strong>
          <p>
            Con el avance actual, la probabilidad de que la siguiente estampa sea nueva es de {totals.nextNewProbability}%.
            La app estima {totals.expectedUsefulPerPack} estampas útiles por sobre.
          </p>
        </div>
      </section>

      <section className="smartGrid">
        {smartStats.map(([label, value]) => (
          <div className="smartCard" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="rankings">
        <div className="card">
          <h2><Medal/> Más avanzadas</h2>
          <TeamRanking teams={totals.strongestTeams} />
        </div>
        <div className="card">
          <h2><CalendarDays/> Más atrasadas</h2>
          <TeamRanking teams={totals.weakestTeams} />
        </div>
      </section>

      <section className="card">
        <h2><Wallet/> Nota de costos</h2>
        <p>El costo estimado usa un supuesto editable de <b>$21 MXN por sobre</b>. Más adelante podemos agregar configuración para cambiar precio por sobre y estampas por sobre.</p>
      </section>
    </div>
  );
}

function TeamRanking({ teams }) {
  return (
    <div className="teamRanking">
      {teams.map(team => (
        <div key={team.code} className="rankRow">
          <div>
            <strong>{team.code}</strong>
            <span>{team.name}</span>
          </div>
          <div className="rankBar">
            <div style={{ width: `${(team.owned / 20) * 100}%` }} />
          </div>
          <b>{team.owned}/20</b>
        </div>
      ))}
    </div>
  );
}

function Duplicates({ collection, markTraded }) {
  const rows = Object.entries(collection).map(([code, stickers]) => ({ code, stickers: stickers.filter(s => s.duplicates > s.traded) })).filter(r => r.stickers.length);
  return <div className="groups">{rows.map(r => <section className="card" key={r.code}><h3>{flags[r.code]} {countryNames[r.code]}</h3><div className="chips">{r.stickers.map(s => <button key={s.number} onClick={() => markTraded(r.code, s.number)}>{s.number} × {s.duplicates - s.traded}</button>)}</div></section>)}</div>
}

function Specials({ specials, setSpecials, removeSpecialCapture, extraStickers, addExtraSticker, removeExtraSticker }) {
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

  const specialGroups = [
    { name: "Panini", items: specials.filter(s => s.group === "Panini") },
    { name: "FWC · FIFA World Cup", items: specials.filter(s => s.group === "FWC") },
    { name: "Coca Cola", items: specials.filter(s => s.group === "Coca Cola") }
  ];

  const owned = specials.filter(s => s.owned).length;
  const dupes = specials.reduce((sum, s) => sum + s.duplicates, 0);
  const available = specials.reduce((sum, s) => sum + Math.max(0, s.duplicates - s.traded), 0);

  return (
    <section className="card">
      <h2><Star/> Especiales <small>{owned}/34</small></h2>
      <div className="specialSummary">
        <div><span>Avance especiales</span><strong>{Math.round((owned / 34) * 1000) / 10}%</strong></div>
        <div><span>Conseguidas</span><strong>{owned}/34</strong></div>
        <div><span>Repetidas</span><strong>{dupes}</strong></div>
        <div><span>Disponibles cambio</span><strong>{available}</strong></div>
      </div>
      <div className="specialProgress"><div style={{ width: `${Math.round((owned / 34) * 100)}%` }} /></div>
      {specialGroups.map(group => (
        <div key={group.name} className="specialGroup">
          <h3>{group.name}</h3>
          <div className="specials">
            {group.items.map(s => (
              <div className={s.owned ? "special owned" : "special"} key={s.id}>
                <b>{s.label}</b>
                <span>{s.owned ? "Tengo" : "Falta"}</span>
                <small>R:{s.duplicates} C:{s.traded}</small>
                <div>
                  <button onClick={() => update(s.id, "owned")}>Tengo</button>
                  <button onClick={() => update(s.id, "dupe")}>Repetida</button>
                  <button onClick={() => update(s.id, "trade")}>Cambiada</button>
                  <button onClick={() => removeSpecialCapture(s.id)}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <ExtraStickers extraStickers={extraStickers} addExtraSticker={addExtraSticker} removeExtraSticker={removeExtraSticker} />
    </section>
  );
}

function ExtraStickers({ extraStickers, addExtraSticker, removeExtraSticker }) {
  const [playerName, setPlayerName] = useState("");
  const [color, setColor] = useState("morado");

  function handleAdd() {
    const ok = addExtraSticker(playerName, color);
    if (ok) {
      setPlayerName("");
      setColor("morado");
    }
  }

  return (
    <div className="extraStickersPanel">
      <h3>Extra Stickers para presumir <small>{extraStickers.length}/10</small></h3>
      <p>No cuentan para el total de 994 ni para el % de avance del álbum.</p>
      <div className="extraForm">
        <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Nombre del jugador" />
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="morado">Morado</option>
          <option value="bronce">Bronce</option>
          <option value="plata">Plata</option>
          <option value="oro">Oro</option>
        </select>
        <button onClick={handleAdd} disabled={extraStickers.length >= 10}><PlusCircle size={16}/> Agregar</button>
      </div>
      <div className="extraList">
        {extraStickers.length === 0 ? <p className="muted">Aún no hay Extra Stickers capturados.</p> : extraStickers.map(item => (
          <div key={item.id} className={`extraItem ${item.color}`}>
            <strong>{item.playerName}</strong>
            <span>{item.color}</span>
            <button onClick={() => removeExtraSticker(item.id)}><Trash2 size={14}/> Quitar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
