
import React, {useEffect, useMemo, useRef, useState } from "react";
import {Trophy, Star, Repeat2, CheckCircle2, XCircle, BarChart3, PackageOpen, Search, Shuffle, Download, Upload, Trash2, PlusCircle, TrendingUp, Target, Wallet, CalendarDays, Medal, Users, UserPlus, Crown, ClipboardList, MessageCircle, Printer} from "lucide-react";
import {motion } from "framer-motion";
import { loadCloudFamily, saveCloudFamily, deleteCloudMember } from "./firebase";
import Achievements, { calculateAchievements, getAchievementById } from "./components/Achievements";
import avatarGoleadora from "./assets/avatars/goleadora-estrella.png";
import avatarPortero from "./assets/avatars/portero-imbatible.png";
import avatarCapitana from "./assets/avatars/la-capitana.png";
import avatarFichaje from "./assets/avatars/fichaje-mas-caro.png";
import avatarGalacticos from "./assets/avatars/los-galacticos.png";
import avatarDupla from "./assets/avatars/dupla-del-gol.png";
import avatarDuenas from "./assets/avatars/duenas-de-la-cancha.png";

const groups = [
  {name: "Grupo A", teams: ["MEX", "RSA", "KOR", "CZE"] },
  {name: "Grupo B", teams: ["CAN", "BIH", "QAT", "SUI"] },
  {name: "Grupo C", teams: ["BRA", "MAR", "HAI", "SCO"] },
  {name: "Grupo D", teams: ["USA", "PAR", "AUS", "TUR"] },
  {name: "Grupo E", teams: ["GER", "CUW", "CIV", "ECU"] },
  {name: "Grupo F", teams: ["NED", "JPN", "SWE", "TUN"] },
  {name: "Grupo G", teams: ["BEL", "EGY", "IRN", "NZL"] },
  {name: "Grupo H", teams: ["ESP", "CPV", "KSA", "URU"] },
  {name: "Grupo I", teams: ["FRA", "SEN", "IRQ", "NOR"] },
  {name: "Grupo J", teams: ["ARG", "ALG", "AUT", "JOR"] },
  {name: "Grupo K", teams: ["POR", "COD", "UZB", "COL"] },
  {name: "Grupo L", teams: ["ENG", "CRO", "GHA", "PAN"] },
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


const teamOrderIndex = groups.reduce((acc, group, groupIndex) => {
  group.teams.forEach((code, teamIndex) => {
    acc[code] = groupIndex * 10 + teamIndex;
  });
  return acc;
}, {});

function getCountryLabel(code) {
  return `${countryNames[code] || code} (${code})`;
}

function sortTeamCodes(codes, mode = "group") {
  return [...codes].sort((a, b) => {
    if (mode === "alpha") {
      return (countryNames[a] || a).localeCompare(countryNames[b] || b, "es", { sensitivity: "base" });
    }
    return (teamOrderIndex[a] ?? 9999) - (teamOrderIndex[b] ?? 9999);
  });
}

const missingByTeam = {"MEX":[3,5,6,7,9,10,13,14,15,18],"RSA":[2,5,6,9,10,11,14,15,16,18,19,20],"KOR":[4,6,10,11,12,14,16,17,19,20],"CZE":[5,11,12,16,17],"CAN":[3,4,9,11,13,15,16,17,19],"BIH":[3,4,5,9,14,15,16,17,18,19],"QAT":[1,2,4,6,7,10,11,13,14,16,18,20],"SUI":[1,4,8,9,10,12,14,15,16,19,20],"BRA":[3,4,5,6,8,10,15,16,17,19,20],"MAR":[1,4,5,8,12,15,16,17,18,20],"HAI":[3,4,6,7,13,14,16,18],"SCO":[5,7,8,9,10,11,12,13,14,15,17,18,20],"USA":[1,2,5,7,8,9,10,11,12,15,17,18,19,20],"PAR":[1,5,7,8,9,10,12,13,14,15,17,20],"AUS":[1,2,3,5,6,7,8,9,10,14,16,19,20],"TUR":[3,4,5,11,13,14,16,18,19],"GER":[2,5,7,8,9,12,16,18,20],"CUW":[1,2,4,5,6,7,9,10,11,12,13,15,18,20],"CIV":[1,3,4,7,8,9,10,11,14,15,16,18,20],"ECU":[3,4,6,9,10,11,12,13,14,16,20],"NED":[2,5,8,9,10,11,13,14,17,18,19],"JPN":[1,3,4,5,6,7,10,11,13,14,15,16,18],"SWE":[6,15,16,17,18,20],"TUN":[1,2,3,4,8,10,11,13,14,17,19],"BEL":[1,2,3,4,5,6,7,9,10,12,13,17,18,19,20],"EGY":[2,4,6,7,8,9,12,13,15,17,19,20],"IRN":[1,4,5,6,7,9,10,14,16,17,19],"NZL":[2,3,5,7,8,9,10,11,12,14,16,17,20],"ESP":[2,5,11,13,14,16,18,20],"CPV":[3,4,7,8,11,12,13,15,16,18,19],"KSA":[1,2,3,4,5,6,7,8,10,11,13,16,17,20],"URU":[3,6,9,10,13,14,15,16,17,19],"FRA":[2,3,4,5,7,8,12,15,19],"SEN":[1,4,5,7,9,10,11,19,20],"IRQ":[2,4,10,14,16,17],"NOR":[1,2,3,6,7,9,10,11,12,13,15,16,17,18,19],"ARG":[1,5,6,9,11,12,13,14,15,16,18,19,20],"ALG":[1,2,4,5,7,9,10,11,14,15,16,19,20],"AUT":[1,2,3,5,6,8,9,11,12,13,14,16,17,18,19],"JOR":[2,3,4,5,6,8,9,11,12,15,16,18,19,20],"POR":[3,4,7,10,11,12,15,16,17,18,20],"COD":[1,9,10,12,13,14,17,19],"UZB":[1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,19,20],"COL":[1,2,4,5,6,7,8,10,14,15,16,17,19,20],"ENG":[2,5,6,9,13,14,17,19],"CRO":[6,7,9,12,14,15,16,18,19,20],"GHA":[2,6,9,12,13,14,15,16,17],"PAN":[6,7,8,10,11,12,13,14,15,16,18,19]};
const duplicateByTeam = {"MEX":{"2":1,"19":1,"20":1},"RSA":{"17":1},"KOR":{"2":1,"7":1},"CZE":{"1":1,"4":2,"6":2,"7":1,"10":3,"13":1,"14":2,"15":2,"18":1},"CAN":{"5":2,"8":1,"10":1,"12":1,"18":1},"BIH":{"1":2,"2":1,"7":2,"8":1,"11":2,"13":1},"QAT":{"8":1},"SUI":{"13":1,"18":1},"BRA":{"9":1,"12":1,"18":1},"MAR":{"6":1},"HAI":{"5":1,"10":1,"12":1,"15":1},"SCO":{"6":1,"16":1},"USA":{},"PAR":{"2":1,"19":2},"AUS":{},"TUR":{"1":1,"7":1,"9":1,"10":2,"15":1,"16":1},"GER":{},"CUW":{},"CIV":{"2":1,"12":1},"ECU":{"1":1,"2":1,"5":1,"9":1,"19":1},"NED":{"7":1},"JPN":{"19":1},"SWE":{"5":2,"7":1,"9":1,"10":1},"TUN":{"5":1,"16":1},"BEL":{"8":1,"11":1,"15":1},"EGY":{"14":1,"16":1,"18":1},"IRN":{"20":1},"NZL":{"4":2,"6":1,"19":1},"ESP":{"6":1,"8":1},"CPV":{"14":1,"20":1},"KSA":{"14":1,"15":1},"URU":{"5":1,"7":2,"8":2},"FRA":{"11":1,"18":1},"SEN":{"2":1},"IRQ":{"3":2,"6":1,"7":1,"8":1,"9":3,"13":1,"15":2,"18":1},"NOR":{"8":1},"ARG":{"7":1,"17":1},"ALG":{"12":1,"13":1},"AUT":{"20":1},"JOR":{"10":1},"POR":{"13":1,"14":1},"COD":{"5":1,"7":1,"15":1,"18":3,"20":1},"UZB":{},"COL":{"13":1},"ENG":{"3":1,"4":1,"8":1,"16":1},"CRO":{"5":1,"11":1},"GHA":{"18":1},"PAN":{"9":1}};

function initialCollection() {
  const data = {};
  groups.flatMap(g => g.teams).forEach(code => {
    const missing = new Set(missingByTeam[code] || []);
    const dupes = duplicateByTeam[code] || {};
    data[code] = Array.from({length: 20 }, (_, i) => {
      const number = i + 1;
      return {number, owned: !missing.has(number), duplicates: Number(dupes[String(number)] || 0), traded: 0 };
    });
  });
  return data;
}

function initialSpecials() {
  const panini = [{id: "PANINI00", group: "Panini", code: "PAN", number: "00", label: "Panini 00" }];

  const fwc = Array.from({length: 19 }, (_, i) => ({
    id: `FWC${i + 1}`,
    group: "FWC",
    code: "FWC",
    number: i + 1,
    label: `FWC ${i + 1}`
  }));

  const cocaCola = Array.from({length: 14 }, (_, i) => ({
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


const founderCharacter = {
  id: "goleadora_estrella",
  emoji: "👧",
  title: "Goleadora Estrella",
  description: "Siempre encuentra la portería.",
  defaultColor: "rosa"
};

function getProfileCharacter(profile) {
  if (!profile) return founderCharacter;

  if ((profile.name || "").toLowerCase().includes("valentina")) {
    return {
      ...founderCharacter,
      ...profile.customCharacter,
      id: "goleadora_estrella",
      emoji: profile.customCharacter?.emoji || "👧",
      title: profile.customCharacter?.title || "Goleadora Estrella",
      description: profile.customCharacter?.description || "Siempre encuentra la portería."
    };
  }

  return profile.customCharacter || {
    id: profile.character || `custom_${profile.id || "collector"}`,
    emoji: profile.emoji || "⭐",
    title: "Nuevo Coleccionista",
    description: "Listo para llenar el álbum.",
    defaultColor: profile.color || "dorado"
  };
}

function normalizeProfileCharacter(profile) {
  const character = getProfileCharacter(profile);
  return {
    ...profile,
    character: character.id || profile.character || `custom_${profile.id || "collector"}`,
    customCharacter: character,
    emoji: character.emoji,
    color: profile.color || character.defaultColor || "dorado"
  };
}



function suggestFootballPhrase(name) {
  const base = (name || "").trim() || "Este coleccionista";
  const phrases = [
    `${base} juega cada sobre como una final mundialista.`,
    `${base} tiene olfato de gol para encontrar faltantes.`,
    `${base} domina la cancha de las repetidas.`,
    `${base} va por la copa, estampa por estampa.`,
    `${base} colecciona con garra de campeón.`,
    `${base} siempre aparece en el minuto decisivo.`
  ];
  let score = 0;
  for (const char of base) score += char.charCodeAt(0);
  return phrases[score % phrases.length];
}

function emojiForName(name) {
  const base = (name || "").trim();
  if (!base) return "⭐";
  const emojis = ["⚽", "🏆", "⭐", "🔥", "🚀", "👑", "🎯", "🥇", "😎", "🦁"];
  let score = 0;
  for (const char of base) score += char.charCodeAt(0);
  return emojis[score % emojis.length];
}



const characterTypes = [
  { id: "goleadora_estrella", title: "Goleadora Estrella", gender: "mujer", emoji: "👧", defaultPhrase: "Siempre encuentra la portería." },
  { id: "portero_imbatible", title: "Portero Imbatible", gender: "hombre", emoji: "👦", defaultPhrase: "Nada pasa la línea." },
  { id: "la_capitana", title: "La Capitana", gender: "mujer", emoji: "👩", defaultPhrase: "Dirige al equipo al campeonato." },
  { id: "fichaje_mas_caro", title: "El Fichaje Más Caro", gender: "hombre", emoji: "👨", defaultPhrase: "El jugador más cotizado del mercado." },
  { id: "los_galacticos", title: "Los Galácticos", gender: "pareja_hombre_hombre", emoji: "👨‍👨", defaultPhrase: "Juntos son imparables." },
  { id: "dupla_del_gol", title: "La Dupla del Gol", gender: "pareja_hombre_mujer", emoji: "👨‍👩", defaultPhrase: "Dos talentos, un mismo objetivo." },
  { id: "duenas_de_la_cancha", title: "Las Dueñas de la Cancha", gender: "pareja_mujer_mujer", emoji: "👩‍👩", defaultPhrase: "Control absoluto del partido." }
];

function getCharacterType(typeId) {
  return characterTypes.find(type => type.id === typeId) || characterTypes[0];
}


function slugifyProfileName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `perfil-${Date.now()}`;
}

function createEmptyProfile(name = "Joaquín", emoji = "⚽", avatarType = "girl") {
  const emptyCollection = initialCollection();
  const emptySpecials = initialSpecials();

  Object.keys(emptyCollection).forEach(code => {
    emptyCollection[code] = emptyCollection[code].map(sticker => ({
      ...sticker,
      owned: false,
      duplicates: 0,
      traded: 0
    }));
  });

  return {
    id: slugifyProfileName(name),
    name,
    emoji,
    avatarType,
    color: avatarType === "girl" ? "rosa" : "azul",
    pin: "2026",
    collection: emptyCollection,
    specials: emptySpecials.map(sticker => ({
      ...sticker,
      owned: false,
      duplicates: 0,
      traded: 0
    })),
    extraStickers: [],
    captureCount: 0,
    log: [
      {
        text: `Perfil creado: ${name}`,
        time: "Perfil"
      }
    ],
    undoStack: []
  };
}

function createProfileFromLegacy(name, legacy) {
  return {
    id: slugifyProfileName(name),
    name,
    emoji: "👧",
    character: "goleadora_estrella",
    customCharacter: founderCharacter,
    color: "rosa",
    pin: "2026",
    collection: legacy.collection,
    specials: legacy.specials,
    extraStickers: legacy.extraStickers || [],
    captureCount: Number(legacy.captureCount || Number(legacy.packs || 0) * 7 || 0),
    log: legacy.log || [],
    undoStack: legacy.undoStack || []
  };
}

function profileTotals(profile) {
  const normal = Object.values(profile.collection || {}).flat();
  const specials = profile.specials || [];
  const all = [...normal, ...specials];
  const total = all.length || 994;
  const owned = all.filter(s => s.owned).length;
  const dupes = all.reduce((sum, s) => sum + (s.duplicates || 0), 0);
  const traded = all.reduce((sum, s) => sum + (s.traded || 0), 0);
  return {
    total,
    owned,
    progress: Math.round((owned / total) * 1000) / 10,
    duplicatesAvailable: Math.max(0, dupes - traded)
  };
}

function hasMeaningfulLegacyData(legacyCollection, legacySpecials) {
  if (!legacyCollection || !legacySpecials) return false;
  const normal = Object.values(legacyCollection).flat();
  const specials = legacySpecials || [];
  const owned = [...normal, ...specials].filter(s => s && s.owned).length;
  const dupes = [...normal, ...specials].reduce((sum, s) => sum + (s?.duplicates || 0), 0);
  return owned > 0 || dupes > 0;
}

function shouldUpgradeValentinaProfile(existingProfile, legacyCollection, legacySpecials) {
  if (!existingProfile || !hasMeaningfulLegacyData(legacyCollection, legacySpecials)) return false;
  const currentTotals = profileTotals(existingProfile);
  const legacyOwned = [
    ...Object.values(legacyCollection).flat(),
    ...(legacySpecials || [])
  ].filter(s => s && s.owned).length;
  return currentTotals.owned === 0 && legacyOwned > 0;
}

export default function App() {
  const [familyProfiles, setFamilyProfiles] = useState(() => {
    const legacyCollection = safeLoad("panini2026_collection", null);
    const legacySpecials = safeLoad("panini2026_specials", null);
    const legacyLog = safeLoad("panini2026_log", []);
    const legacyUndo = safeLoad("panini2026_undo", []);
    const legacyExtras = safeLoad("panini2026_extraStickers", []);
    const legacyProfile = hasMeaningfulLegacyData(legacyCollection, legacySpecials)
      ? createProfileFromLegacy("Valentina", {
          collection: legacyCollection,
          specials: legacySpecials,
          captureCount: Number(localStorage.getItem("panini2026_captureCount") || 0),
          packs: Number(localStorage.getItem("panini2026_packs") || 0),
          log: legacyLog,
          undoStack: legacyUndo,
          extraStickers: legacyExtras
        })
      : null;

    const savedFamily = safeLoad("panini2026_familyProfiles", null);

    if (savedFamily && savedFamily.length) {
      if (legacyProfile) {
        const index = savedFamily.findIndex(p => p.id === "valentina" || p.name === "Valentina" || p.name === "Joaquín");
        if (index >= 0 && shouldUpgradeValentinaProfile(savedFamily[index], legacyCollection, legacySpecials)) {
          const migrated = [...savedFamily];
          migrated[index] = {...legacyProfile, id: savedFamily[index].id, name: "Valentina" };
          return migrated;
        }
      }
      return savedFamily.map(p => p.name === "Joaquín" ? {...p, name: "Valentina", id: p.id === "joaquin" ? "valentina" : p.id } : p);
    }

    if (legacyProfile) return [legacyProfile];

    return [createEmptyProfile("Valentina", "⚽", "dorado")];
  });

  const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem("panini2026_activeProfileId") || "valentina");
  const activeProfile = familyProfiles.find(p => p.id === activeProfileId) || familyProfiles[0];

  function isGhostProfile(profile) {
    const value = `${profile?.id || ""} ${profile?.name || ""}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return (
      value.includes("mich-y-omar") ||
      value.includes("mich y omar") ||
      value.includes("mich") && value.includes("omar")
    );
  }

  function removeGhostProfiles(profiles) {
    return (profiles || []).filter(profile => !isGhostProfile(profile));
  }

  const collection = activeProfile.collection;
  const specials = activeProfile.specials;
  const extraStickers = activeProfile.extraStickers || [];
  const captureCount = Number(activeProfile.captureCount || 0);
  const packs = Math.floor(captureCount / 7);
  const log = activeProfile.log || [];
  const undoStack = activeProfile.undoStack || [];

  const [selectedTeam, setSelectedTeam] = useState("MEX");
  const [tab, setTab] = useState("capture");
  const [query, setQuery] = useState("");
  const [quickCode, setQuickCode] = useState("");
  const [captureFeedback, setCaptureFeedback] = useState(null);
  const achievementSnapshotRef = useRef({ profileId: null, achievements: null });
  const [showLog, setShowLog] = useState(false);
  const [cloudStatus, setCloudStatus] = useState("local");
  const [cloudReady, setCloudReady] = useState(false);
  const [lastCloudUpdate, setLastCloudUpdate] = useState(null);


  function updateActiveProfile(updater) {
    setFamilyProfiles(prev => prev.map(profile => {
      if (profile.id !== activeProfile.id) return profile;
      return typeof updater === "function" ? updater(profile) : {...profile, ...updater };
    }));
  }

  function setCollection(valueOrUpdater) {
    updateActiveProfile(profile => ({
      ...profile,
      collection: typeof valueOrUpdater === "function" ? valueOrUpdater(profile.collection) : valueOrUpdater
    }));
  }

  function setSpecials(valueOrUpdater) {
    updateActiveProfile(profile => ({
      ...profile,
      specials: typeof valueOrUpdater === "function" ? valueOrUpdater(profile.specials) : valueOrUpdater
    }));
  }

  function setExtraStickers(valueOrUpdater) {
    updateActiveProfile(profile => ({
      ...profile,
      extraStickers: typeof valueOrUpdater === "function" ? valueOrUpdater(profile.extraStickers || []) : valueOrUpdater
    }));
  }

  function setCaptureCount(valueOrUpdater) {
    updateActiveProfile(profile => ({
      ...profile,
      captureCount: typeof valueOrUpdater === "function" ? valueOrUpdater(Number(profile.captureCount || 0)) : valueOrUpdater
    }));
  }

  function setLog(valueOrUpdater) {
    updateActiveProfile(profile => ({
      ...profile,
      log: typeof valueOrUpdater === "function" ? valueOrUpdater(profile.log || []) : valueOrUpdater
    }));
  }

  function setUndoStack(valueOrUpdater) {
    updateActiveProfile(profile => ({
      ...profile,
      undoStack: typeof valueOrUpdater === "function" ? valueOrUpdater(profile.undoStack || []) : valueOrUpdater
    }));
  }

  function createNewFamilyProfile(name, customCharacter = null, pin = "") {
    const cleanName = name.trim();
    if (!cleanName) return;

    const safeCharacter = customCharacter || {
      emoji: emojiForName(cleanName),
      title: cleanName,
      description: suggestFootballPhrase(cleanName),
      defaultColor: "dorado"
    };

    setFamilyProfiles(prev => {
      const baseId = slugifyProfileName(cleanName);
      const existingIds = new Set(prev.map(p => p.id));
      let id = baseId;
      let counter = 2;

      while (existingIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter += 1;
      }

      const finalProfile = {
        ...createEmptyProfile(cleanName, safeCharacter.emoji || "⭐", "dorado"),
        id,
        character: `custom_${id}`,
        customCharacter: {
          ...safeCharacter,
          id: `custom_${id}`,
          title: safeCharacter.title || cleanName,
          description: safeCharacter.description || suggestFootballPhrase(cleanName),
          emoji: safeCharacter.emoji || emojiForName(cleanName),
          defaultColor: "dorado"
        },
        emoji: safeCharacter.emoji || emojiForName(cleanName),
        color: "dorado",
        pin,
        captureCount: 0,
        extraStickers: [],
        log: [{ text: `Perfil creado: ${cleanName}`, time: "Perfil" }],
        undoStack: []
      };

      setActiveProfileId(finalProfile.id);
      showFeedback("new", "Perfil creado", `${cleanName} inicia en 0%`);
      return [...prev, finalProfile];
    });
  }

  function deleteFamilyProfile(profileId) {
    const profile = familyProfiles.find(p => p.id === profileId);

    if (familyProfiles.length <= 1) {
      showFeedback("error", "No se puede eliminar", "Debe existir al menos un perfil");
      return;
    }

    if (!profile) return;

    const ok = window.confirm(`¿Eliminar el perfil ${profile.name}? Esta acción no se puede deshacer.`);
    if (!ok) return;

    const next = familyProfiles.filter(p => p.id !== profileId);

    setFamilyProfiles(next);

    if (activeProfile.id === profileId) {
      setActiveProfileId(next[0].id);
    }

    deleteCloudMember(profileId)
      .then(() => {
        showFeedback("new", "Perfil eliminado de la nube", `${profile.name} ya no aparecerá en otros dispositivos`);
      })
      .catch(error => {
        console.error("Error deleting cloud profile", error);
        showFeedback("error", "Perfil eliminado localmente", "Presiona Guardar nube para completar la limpieza");
      });
  }

  useEffect(() => localStorage.setItem("panini2026_familyProfiles", JSON.stringify(familyProfiles)), [familyProfiles]);
  useEffect(() => localStorage.setItem("panini2026_activeProfileId", activeProfile.id), [activeProfile.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialCloudData() {
      try {
        setCloudStatus("revisando nube");
        const cloudData = await loadCloudFamily();

        if (cancelled) return;

        if (cloudData?.familyProfiles?.length) {
          const rawProfiles = cloudData.familyProfiles.map(normalizeProfileCharacter);
          const ghostProfiles = rawProfiles.filter(isGhostProfile);
          const normalizedProfiles = removeGhostProfiles(rawProfiles);

          if (ghostProfiles.length) {
            ghostProfiles.forEach(profile => {
              deleteCloudMember(profile.id).catch(error => console.error("Ghost profile cleanup error", error));
            });
          }

          const localActiveId = localStorage.getItem("panini2026_activeProfileId");
          const safeActiveId = normalizedProfiles.some(profile => profile.id === localActiveId)
            ? localActiveId
            : normalizedProfiles[0]?.id;

          if (!normalizedProfiles.length) {
            setCloudReady(true);
            setCloudStatus("nube sin perfiles válidos");
            return;
          }

          setFamilyProfiles(normalizedProfiles);
          setActiveProfileId(safeActiveId);
          localStorage.setItem("panini2026_familyProfiles", JSON.stringify(normalizedProfiles));
          localStorage.setItem("panini2026_activeProfileId", safeActiveId);
          setCloudReady(true);
          setCloudStatus("sincronizado");
          setLastCloudUpdate(new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit" }));
        } else {
          setCloudReady(true);
          setCloudStatus("nube vacía");
        }
      } catch (error) {
        console.error("Cloud start error", error);
        setCloudStatus("modo local");
        setCloudReady(false);
      }
    }

    loadInitialCloudData();

    return () => {
      cancelled = true;
    };
  }, []);

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

    return {total, owned, missing, dupes, traded, availableDupes, normalOwned, specialOwned, progress, nextNewProbability, estimatedPacks, completionByTeam, completedTeams, almostTeams, weakestTeams, strongestTeams, usefulRate, duplicateRate, expectedUsefulPerPack, recommendedMode, estimatedCostRemaining, albumIntensity };
  }, [collection, specials]);

  const activeAchievements = useMemo(() => calculateAchievements(activeProfile, familyProfiles), [activeProfile, familyProfiles]);

  useEffect(() => {
    if (!activeProfile?.id) return;
    const current = JSON.stringify(activeProfile.achievements || {});
    const next = JSON.stringify(activeAchievements);
    if (current === next) return;

    setFamilyProfiles(prev => prev.map(profile => (
      profile.id === activeProfile.id
        ? {...profile, achievements: activeAchievements }
        : profile
    )));
  }, [activeProfile?.id, activeAchievements]);

  useEffect(() => {
    if (!activeProfile?.id) return;

    const previous = achievementSnapshotRef.current;
    const profileChanged = previous.profileId !== activeProfile.id;

    if (profileChanged || !previous.achievements) {
      achievementSnapshotRef.current = { profileId: activeProfile.id, achievements: activeAchievements };
      return;
    }

    const newlyUnlocked = Object.entries(activeAchievements)
      .filter(([id, unlocked]) => unlocked && !previous.achievements[id])
      .map(([id]) => getAchievementById(id))
      .filter(Boolean);

    achievementSnapshotRef.current = { profileId: activeProfile.id, achievements: activeAchievements };

    if (tab !== "capture" || newlyUnlocked.length === 0) return;

    const achievement = newlyUnlocked[0];
    window.setTimeout(() => showAchievementUnlocked(achievement), 120);
  }, [activeProfile?.id, activeAchievements, tab]);

  function addLog(text) {
    const now = new Date();
    setLog(prev => [{text, time: now.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit" }) }, ...prev].slice(0, 30));
  }

  function showFeedback(type, title, detail, duration = 1800) {
    setCaptureFeedback({type, title, detail });
    window.setTimeout(() => setCaptureFeedback(null), duration);
  }

  function playAchievementSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.55);
      gain.connect(audioContext.destination);

      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.08);
        oscillator.connect(gain);
        oscillator.start(audioContext.currentTime + index * 0.08);
        oscillator.stop(audioContext.currentTime + 0.48 + index * 0.08);
      });
    } catch (error) {
      console.warn("No se pudo reproducir el sonido del logro", error);
    }
  }

  function showAchievementUnlocked(achievement) {
    if (!achievement) return;
    playAchievementSound();
    showFeedback("achievement", "Logro desbloqueado", achievement.title);
    addLog(`Logro desbloqueado: ${achievement.title}`);
  }


  function playCelebrationSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.9);
      gain.connect(audioContext.destination);

      [392.0, 523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = index % 2 === 0 ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.075);
        oscillator.connect(gain);
        oscillator.start(audioContext.currentTime + index * 0.075);
        oscillator.stop(audioContext.currentTime + 0.55 + index * 0.075);
      });
    } catch (error) {
      console.warn("No se pudo reproducir el sonido de celebración", error);
    }
  }

  function showCelebration(title, detail) {
    playCelebrationSound();
    showFeedback("celebration", title, detail, 2600);
    addLog(`${title}: ${detail}`);
  }

  function ownedCountForTeam(collectionData, code) {
    return (collectionData?.[code] || []).filter(sticker => sticker.owned).length;
  }

  function getGroupForTeam(code) {
    return groups.find(group => group.teams.includes(code));
  }

  function collectionWithOwnedSticker(collectionData, code, number) {
    return {
      ...collectionData,
      [code]: (collectionData?.[code] || []).map(sticker => (
        sticker.number === number ? {...sticker, owned: true } : sticker
      ))
    };
  }

  function specialsWithOwnedSticker(specialsData, specialId) {
    return (specialsData || []).map(item => (
      item.id === specialId ? {...item, owned: true } : item
    ));
  }

  function isAlbumComplete(collectionData, specialsData) {
    const normalComplete = Object.values(collectionData || {}).flat().every(sticker => sticker.owned);
    const specialsComplete = (specialsData || []).every(sticker => sticker.owned);
    return normalComplete && specialsComplete;
  }

  function getNormalCompletionCelebration(code, number) {
    const currentSticker = collection?.[code]?.find(sticker => sticker.number === number);
    if (!currentSticker || currentSticker.owned) return null;

    const nextCollection = collectionWithOwnedSticker(collection, code, number);

    if (isAlbumComplete(nextCollection, specials)) {
      return {
        title: "ÁLBUM COMPLETO",
        detail: `${activeProfile.name} completó 994/994 estampas`
      };
    }

    const beforeTeamOwned = ownedCountForTeam(collection, code);
    const afterTeamOwned = ownedCountForTeam(nextCollection, code);

    if (beforeTeamOwned < 20 && afterTeamOwned === 20) {
      const group = getGroupForTeam(code);
      const groupCompleted = group?.teams.every(teamCode => ownedCountForTeam(nextCollection, teamCode) === 20);

      if (groupCompleted) {
        return {
          title: `${group.name} completado`,
          detail: `Todas las selecciones del ${group.name} están completas`
        };
      }

      return {
        title: "Selección completada",
        detail: `${flags[code] || ""} ${countryNames[code] || code} 20/20 estampas`
      };
    }

    return null;
  }

  function getSpecialCompletionCelebration(specialId) {
    const special = specials.find(item => item.id === specialId);
    if (!special || special.owned) return null;

    const nextSpecials = specialsWithOwnedSticker(specials, specialId);

    if (isAlbumComplete(collection, nextSpecials)) {
      return {
        title: "ÁLBUM COMPLETO",
        detail: `${activeProfile.name} completó 994/994 estampas`
      };
    }

    const groupItems = nextSpecials.filter(item => item.group === special.group);
    const groupComplete = groupItems.length > 0 && groupItems.every(item => item.owned);

    if (groupComplete && special.group === "Coca Cola") {
      return {
        title: "Colección Coca-Cola completa",
        detail: "Las 14 especiales Coca-Cola ya están completas"
      };
    }

    if (groupComplete && special.group === "FWC") {
      return {
        title: "Colección FWC completa",
        detail: "Las 19 especiales FWC ya están completas"
      };
    }

    return null;
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
    setLog([{text: `Deshacer: ${last.label}`, time: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit" }) }, ...last.log].slice(0, 30));
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

        if (Array.isArray(data.familyProfiles) && data.familyProfiles.length) {
          setFamilyProfiles(data.familyProfiles.map(normalizeProfileCharacter));
          setActiveProfileId(data.activeProfileId || data.familyProfiles[0].id);
        } else {
          setCollection(data.collection || initialCollection());
          setSpecials(data.specials || initialSpecials());
          setCaptureCount(Number(data.captureCount || Number(data.packs || 0) * 7 || 0));
          setExtraStickers(Array.isArray(data.extraStickers) ? data.extraStickers : []);
          setLog(Array.isArray(data.log) ? data.log : []);
          setUndoStack(Array.isArray(data.undoStack) ? data.undoStack : []);
        }

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
    setCollection(prev => ({...prev, [code]: prev[code].map(s => s.number === n ? {...s, owned: true } : s) }));
    addLog(`${code}${n}: ${wasMissing ? "nueva conseguida" : "ya estaba conseguida"}`);
  }

  function addDuplicate(code, n) {
    saveUndoSnapshot(`${code}${n}: agregar repetida`);
    setCollection(prev => ({...prev, [code]: prev[code].map(s => s.number === n ? {...s, owned: true, duplicates: s.duplicates + 1 } : s) }));
    addLog(`${code}${n}: repetida agregada`);
  }

  function markTraded(code, n) {
    saveUndoSnapshot(`${code}${n}: marcar cambiada`);
    setCollection(prev => ({...prev, [code]: prev[code].map(s => s.number === n && s.traded < s.duplicates ? {...s, traded: s.traded + 1 } : s) }));
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
        if (s.duplicates > s.traded) return {...s, duplicates: s.duplicates - 1 };
        if (s.owned) return {...s, owned: false };
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

    const celebration = getSpecialCompletionCelebration(specialId);

    saveUndoSnapshot(`${special.label}: capturar especial`);

    setSpecials(prev => prev.map(item => {
      if (item.id !== specialId) return item;
      if (item.owned) return {...item, duplicates: item.duplicates + 1 };
      return {...item, owned: true };
    }));

    if (special.owned) {
      addLog(`${special.label}: repetida agregada`);
      showFeedback("duplicate", `${special.label} repetida`, "Se agregó a repetidas especiales");
    } else {
      addLog(`${special.label}: nueva conseguida`);
      if (celebration) {
        window.setTimeout(() => showCelebration(celebration.title, celebration.detail), 120);
      } else {
        showFeedback("new", `${special.label} nueva`, "Se marcó como conseguida");
      }
    }

    setCaptureCount(prev => prev + 1);
  }

  function removeSpecialCapture(id) {
    const special = specials.find(item => item.id === id);
    if (!special) return;

    saveUndoSnapshot(`${special.label}: quitar captura`);

    setSpecials(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (item.duplicates > item.traded) return {...item, duplicates: item.duplicates - 1 };
      if (item.owned) return {...item, owned: false };
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
      const celebration = getNormalCompletionCelebration(code, number);
      markOwned(code, number);
      if (celebration) {
        window.setTimeout(() => showCelebration(celebration.title, celebration.detail), 120);
      } else {
        showFeedback("new", `${code}${number} nueva`, "Se marcó como conseguida");
      }
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
      <motion.header initial={{opacity: 0, y: -12 }} animate={{opacity: 1, y: 0 }} className="hero">
        <div>
          <div className="eyebrow"><Trophy size={18}/> Panini Companion 2026</div>
          <h1>Mi Álbum del Mundial</h1>
          <p>Captura express, repetidas, intercambios y numeralia en tiempo real.</p>
        </div>
        <div className="progressCard">
          <span>Avance total</span>
          <em className="activeProfileMini">{activeProfile.emoji} {activeProfile.name}</em>
          <strong>{totals.progress}%</strong>
          <div className="bar"><div style={{width: `${totals.progress}%` }} /></div>
          <small>{totals.owned}/{totals.total} estampas</small>
        </div>
      </motion.header>

      <nav className="tabs">
        <button onClick={() => setTab("capture")} className={tab === "capture" ? "active" : ""}><PackageOpen size={17}/> Abrí sobre</button>
        <button onClick={() => setTab("album")} className={tab === "album" ? "active" : ""}><Trophy size={17}/> Mi álbum</button>
        <button onClick={() => setTab("stats")} className={tab === "stats" ? "active" : ""}><BarChart3 size={17}/> Numeralia</button>
        <button onClick={() => setTab("duplicates")} className={tab === "duplicates" ? "active" : ""}><Repeat2 size={17}/> Repetidas</button>
        <button onClick={() => setTab("specials")} className={tab === "specials" ? "active" : ""}><Star size={17}/> Especiales</button>
        <button onClick={() => setTab("family")} className={tab === "family" ? "active" : ""}><Users size={17}/> Familia</button>
        <button onClick={() => setTab("achievements")} className={tab === "achievements" ? "active" : ""}><Medal size={17}/> Logros</button>
        <button onClick={undoLastAction} className="undo">Deshacer</button>
        <button onClick={exportBackup} className="backupBtn"><Download size={17}/> Exportar</button>
        <label className="backupBtn importBtn"><Upload size={17}/> Importar<input type="file" accept="application/json" onChange={importBackup} hidden /></label>
        <button onClick={async () => {
          try {
            setCloudStatus("guardando nube");
            await saveCloudFamily({
              familyProfiles: familyProfiles.map(normalizeProfileCharacter),
              schemaVersion: 14.2,
              updatedFrom: "manual-button",
              clientUpdatedAt: new Date().toISOString()
            });
            setCloudStatus("sincronizado");
            setLastCloudUpdate(new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit" }));
            showFeedback("new", "Nube actualizada", "Avance guardado en nube ligera y segura");
          } catch (error) {
            console.error(error);
            setCloudStatus("error nube");
            showFeedback("error", "Error en nube", error?.message || "No se pudo guardar en Firebase");
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
      {tab === "achievements" && <Achievements profile={activeProfile} familyProfiles={familyProfiles} />}

      {tab === "family" && (
        <div className="familyScreen">
          <ProfileBar
            profiles={familyProfiles}
            activeProfile={activeProfile}
            setActiveProfileId={setActiveProfileId}
            createNewFamilyProfile={createNewFamilyProfile}
            deleteFamilyProfile={deleteFamilyProfile}
          />
          <FamilyRanking profiles={familyProfiles} />
          <ProfileListTools profiles={familyProfiles} />
        </div>
      )}
    </div>
  )
}


function getCharacterTheme(profile) {
  const character = getProfileCharacter(profile);
  const id = character?.typeId || character?.id || profile?.character || "default";
  if (id.includes("goleadora")) return "theme-goleadora";
  if (id.includes("portero")) return "theme-portero";
  if (id.includes("capitana")) return "theme-capitana";
  if (id.includes("fichaje")) return "theme-fichaje";
  if (id.includes("galacticos")) return "theme-galacticos";
  if (id.includes("dupla")) return "theme-dupla";
  if (id.includes("duenas")) return "theme-duenas";
  return "theme-custom";
}

function getProfileStickerCount(profile) {
  const normal = Object.values(profile.collection || {}).flat();
  const specials = profile.specials || [];
  return [...normal, ...specials].filter(sticker => sticker.owned).length;
}


const avatarImageMap = {
  goleadora_estrella: avatarGoleadora,
  portero_imbatible: avatarPortero,
  la_capitana: avatarCapitana,
  fichaje_mas_caro: avatarFichaje,
  los_galacticos: avatarGalacticos,
  dupla_del_gol: avatarDupla,
  duenas_de_la_cancha: avatarDuenas
};

function getAvatarImage(profile) {
  const character = getProfileCharacter(profile);
  const id = character?.typeId || character?.id || profile?.character || "";
  if (id.includes("goleadora")) return avatarGoleadora;
  if (id.includes("portero")) return avatarPortero;
  if (id.includes("capitana")) return avatarCapitana;
  if (id.includes("fichaje")) return avatarFichaje;
  if (id.includes("galacticos")) return avatarGalacticos;
  if (id.includes("dupla")) return avatarDupla;
  if (id.includes("duenas")) return avatarDuenas;
  return avatarGoleadora;
}

function PremiumAvatarImage({ profile }) {
  return (
    <div className="premiumAvatarImageWrap">
      <img className="premiumAvatarImage" src={getAvatarImage(profile)} alt={getProfileCharacter(profile).title} />
    </div>
  );
}


function ProfileBar({profiles, activeProfile, setActiveProfileId, createNewFamilyProfile, deleteFamilyProfile }) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [selectedCharacterType, setSelectedCharacterType] = useState("portero_imbatible");
  const [customPhrase, setCustomPhrase] = useState("");
  const [pin, setPin] = useState("");

  function handleCreate() {
    if (!name.trim()) return;
    if (!pin.trim()) {
      alert("Por favor asigna un PIN para este coleccionista.");
      return;
    }

    const selectedType = getCharacterType(selectedCharacterType);

    createNewFamilyProfile(name, {
      id: selectedType.id,
      typeId: selectedType.id,
      gender: selectedType.gender,
      emoji: selectedType.emoji,
      title: selectedType.title,
      description: customPhrase.trim() || selectedType.defaultPhrase || suggestFootballPhrase(name),
      defaultColor: "dorado"
    }, pin);
    setName("");
    setSelectedCharacterType("portero_imbatible");
    setCustomPhrase("");
    setPin("");
    setShowCreate(false);
  }

  return (
    <section className="profileBar card">
      <div className="profileHeader">
        <div>
          <h2><Users/> Familia coleccionista</h2>
          <p>Perfil activo: <b>{activeProfile.emoji} {activeProfile.name}</b></p>
        </div>
        <button onClick={() => setShowCreate(prev => !prev)}><UserPlus size={17}/> Nuevo coleccionista</button>
      </div>
      <div className="profileChips">
        {profiles.map(profile => {
          const totals = profileTotals(profile);
          return (
            <div key={profile.id} className={profile.id === activeProfile.id ? `collectorCard active ${getCharacterTheme(profile)}` : `collectorCard ${getCharacterTheme(profile)}`}>
              <button className="collectorCardMain" onClick={() => {
                  if (profile.id === activeProfile.id) return;

                  const entered = window.prompt(`PIN de ${profile.name}`);
                  if (entered === null) return;

                  if ((profile.pin || "2026") !== entered) {
                    alert("PIN incorrecto");
                    return;
                  }

                  setActiveProfileId(profile.id);
                }}>
                <div className="collectorAvatar"><PremiumAvatarImage profile={profile} /></div>
                <div className="collectorName">{profile.name}</div>
                <div className="collectorRole">{getProfileCharacter(profile).title}</div>
                <div className="collectorProgressNumber">{totals.progress}%</div>
                <div className="collectorProgressBar">
                  <span style={{ width: `${Math.min(100, totals.progress)}%` }} />
                </div>
                <div className="collectorStickerCount">{getProfileStickerCount(profile)} / {totals.total} estampas</div>
                {profile.id === activeProfile.id && <div className="collectorBadge">🏆 Activo</div>}
              </button>
              <button className="deleteProfileBtn premiumDelete" title="Eliminar perfil" onClick={() => deleteFamilyProfile(profile.id)}>🗑️</button>
            </div>
          );
        })}
      </div>
      {showCreate && (
        <div className="createProfile">
          <div className="customCharacterBuilder">
            <h3>⚽ Crea tu personaje</h3>
            <p>Selecciona el tipo de personaje; esto nos ayudará después a asignar el avatar correcto.</p>
            <div className="customCharacterFields characterDropdownFields">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del coleccionista" />
              <select value={selectedCharacterType} onChange={e => {
                const nextType = getCharacterType(e.target.value);
                setSelectedCharacterType(e.target.value);
                if (!customPhrase.trim()) setCustomPhrase(nextType.defaultPhrase);
              }}>
                {characterTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.emoji} {type.title}</option>
                ))}
              </select>
              <input value={pin} maxLength={6} type="password" inputMode="numeric" onChange={e => setPin(e.target.value.replace(/\\D/g, ""))} placeholder="PIN" />
              <input value={customPhrase} onChange={e => setCustomPhrase(e.target.value)} placeholder="Frase mundialista" />
            </div>
            <div className="customCharacterPreview">
              <span>{getCharacterType(selectedCharacterType).emoji}</span>
              <div>
                <strong>{name || "Nuevo coleccionista"}</strong>
                <small>{getCharacterType(selectedCharacterType).title} · {customPhrase || getCharacterType(selectedCharacterType).defaultPhrase}</small>
              </div>
            </div>
          </div>
          <button onClick={handleCreate}>Crear</button>
        </div>
      )}
    </section>
  );
}

function FamilyRanking({profiles }) {
  const ranking = profiles
    .map(profile => ({...profile, totals: profileTotals(profile) }))
    .sort((a, b) => b.totals.progress - a.totals.progress);

  return (
    <section className="familyRanking card">
      <h2><Crown/> Ranking familiar</h2>
      <div className="familyRows">
        {ranking.map((profile, index) => (
          <div key={profile.id} className="familyRow">
            <b>{index + 1}</b>
            <span>{profile.emoji}</span>
            <strong>{profile.name}<small>{getProfileCharacter(profile).title}</small></strong>
            <div className="familyProgress"><div style={{width: `${profile.totals.progress}%` }} /></div>
            <em>{profile.totals.progress}%</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function getTeamGroupName(code) {
  const group = groups.find(g => g.teams.includes(code));
  return group ? group.name : "Especiales";
}

function formatStickerList(profile) {
  const missingByGroup = {};
  const duplicatesByGroup = {};

  groups.forEach(group => {
    missingByGroup[group.name] = [];
    duplicatesByGroup[group.name] = [];
  });

  sortTeamCodes(Object.keys(profile.collection || {}), "group").forEach(code => {
    const stickers = profile.collection?.[code] || [];
    const groupName = getTeamGroupName(code);
    const missing = [];
    const duplicates = [];

    stickers.forEach(sticker => {
      const available = (sticker.duplicates || 0) - (sticker.traded || 0);
      const label = `${code}${sticker.number}`;

      if (!sticker.owned) missing.push(label);
      if (available > 0) duplicates.push(`${label}${available > 1 ? ` x${available}` : ""}`);
    });

    if (missing.length) missingByGroup[groupName].push({ code, label: getCountryLabel(code), items: missing });
    if (duplicates.length) duplicatesByGroup[groupName].push({ code, label: getCountryLabel(code), items: duplicates });
  });

  const missingSpecials = [];
  const duplicateSpecials = [];

  (profile.specials || []).forEach(sticker => {
    const available = (sticker.duplicates || 0) - (sticker.traded || 0);
    const label = sticker.label || sticker.id;

    if (!sticker.owned) missingSpecials.push(label);
    if (available > 0) duplicateSpecials.push(`${label}${available > 1 ? ` x${available}` : ""}`);
  });

  missingByGroup["Especiales"] = missingSpecials.length ? [{ code: "ESP", label: "Especiales", items: missingSpecials }] : [];
  duplicatesByGroup["Especiales"] = duplicateSpecials.length ? [{ code: "ESP", label: "Especiales", items: duplicateSpecials }] : [];

  return {missingByGroup, duplicatesByGroup };
}

function countGroupedItems(groupedItems) {
  return Object.values(groupedItems).reduce((sum, rows) => (
    sum + rows.reduce((rowSum, row) => rowSum + (row.items?.length || 0), 0)
  ), 0);
}

function renderGroupedList(title, groupedItems) {
  const lines = [title];

  Object.entries(groupedItems).forEach(([groupName, rows]) => {
    if (!rows.length) return;
    lines.push("");
    lines.push(groupName);
    rows.forEach(row => {
      lines.push(`${row.label}: ${row.items.join(", ")}`);
    });
  });

  if (lines.length === 1) lines.push("Sin registros");

  return lines.join("\n");
}

function buildShareText(profile) {
  const {missingByGroup, duplicatesByGroup } = formatStickerList(profile);
  const missingCount = countGroupedItems(missingByGroup);
  const duplicateCount = countGroupedItems(duplicatesByGroup);

  return [
    `Álbum Panini 2026 · ${profile.name}`,
    "",
    renderGroupedList(`FALTANTES (${missingCount})`, missingByGroup),
    "",
    renderGroupedList(`REPETIDAS DISPONIBLES (${duplicateCount})`, duplicatesByGroup)
  ].join("\n");
}

function buildExcelRows(profile) {
  const rows = [["Perfil", "Tipo", "Grupo", "País", "Código", "Estampa", "Cantidad"]];
  const {missingByGroup, duplicatesByGroup } = formatStickerList(profile);

  Object.entries(missingByGroup).forEach(([groupName, groupRows]) => {
    groupRows.forEach(row => row.items.forEach(item => {
      rows.push([profile.name, "Faltante", groupName, row.label, row.code, item, 1]);
    }));
  });

  Object.entries(duplicatesByGroup).forEach(([groupName, groupRows]) => {
    groupRows.forEach(row => row.items.forEach(item => {
      const [sticker, qty] = item.split(" x");
      rows.push([profile.name, "Repetida disponible", groupName, row.label, row.code, sticker, Number(qty || 1)]);
    }));
  });

  return rows;
}

function downloadExcelCsv(profile) {
  const rows = buildExcelRows(profile);
  const csv = rows.map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `panini-${slugifyProfileName(profile.name)}-listado-excel.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function ProfileListTools({profiles }) {
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id || "");
  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
  const text = selectedProfile ? buildShareText(selectedProfile) : "";

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      alert("Listado copiado. Ya puedes pegarlo en WhatsApp.");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Listado copiado. Ya puedes pegarlo en WhatsApp.");
    }
  }

  function openWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function printList() {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Listado Panini 2026</title>
          <style>
            body {font-family: Arial, sans-serif; padding: 28px; line-height: 1.45; }
            h1 {margin-bottom: 4px; }
            pre {white-space: pre-wrap; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Listado Panini 2026</h1>
          <pre>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }

  if (!selectedProfile) return null;

  return (
    <section className="card profileListTools">
      <h2><ClipboardList/> Listado para WhatsApp / imprimir</h2>
      <p>Prepara una lista limpia de faltantes y repetidas disponibles por perfil.</p>
      <div className="listToolsControls">
        <select value={selectedProfileId} onChange={e => setSelectedProfileId(e.target.value)}>
          {profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.emoji} {profile.name}</option>)}
        </select>
        <button onClick={copyText}><ClipboardList size={16}/> Copiar</button>
        <button onClick={openWhatsApp}><MessageCircle size={16}/> WhatsApp</button>
        <button onClick={printList}><Printer size={16}/> Imprimir</button>
        <button onClick={() => downloadExcelCsv(selectedProfile)}><Download size={16}/> Excel</button>
      </div>
      <textarea value={text} readOnly />
    </section>
  );
}

function TeamDetail({code, stickers, markOwned, addDuplicate, markTraded, removeNormalCapture }) {
  const owned = stickers.filter(s => s.owned).length;
  return (
    <section className="card">
      <h2>{flags[code]} {getCountryLabel(code)} <small>{owned}/20</small></h2>
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

function Stats({totals, packs }) {
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
          <div className="bar"><div style={{width: `${totals.progress}%` }} /></div>
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

function TeamRanking({teams }) {
  return (
    <div className="teamRanking">
      {teams.map(team => (
        <div key={team.code} className="rankRow">
          <div>
            <strong>{team.code}</strong>
            <span>{team.name}</span>
          </div>
          <div className="rankBar">
            <div style={{width: `${(team.owned / 20) * 100}%` }} />
          </div>
          <b>{team.owned}/20</b>
        </div>
      ))}
    </div>
  );
}

function Duplicates({collection, markTraded }) {
  const [sortMode, setSortMode] = useState("group");
  const rows = Object.entries(collection)
    .map(([code, stickers]) => ({code, stickers: stickers.filter(s => s.duplicates > s.traded) }))
    .filter(r => r.stickers.length);

  const sortedRows = sortTeamCodes(rows.map(r => r.code), sortMode)
    .map(code => rows.find(r => r.code === code))
    .filter(Boolean);

  const groupedRows = sortMode === "group"
    ? groups.map(group => ({...group, rows: sortedRows.filter(row => group.teams.includes(row.code)) })).filter(group => group.rows.length)
    : [{name: "Orden alfabético", rows: sortedRows}];

  return (
    <div className="duplicatesScreen">
      <section className="card duplicateControls">
        <h2><Repeat2/> Repetidas disponibles</h2>
        <p>Ordena por grupo del Mundial o por país en orden alfabético.</p>
        <div className="segmentedControls">
          <button className={sortMode === "group" ? "active" : ""} onClick={() => setSortMode("group")}>Por grupo</button>
          <button className={sortMode === "alpha" ? "active" : ""} onClick={() => setSortMode("alpha")}>Alfabético</button>
        </div>
      </section>

      {groupedRows.length === 0 ? (
        <section className="card"><p className="muted">No hay repetidas disponibles.</p></section>
      ) : groupedRows.map(group => (
        <section className="card duplicateGroup" key={group.name}>
          <h3>{group.name}</h3>
          <div className="duplicateTeamGrid">
            {group.rows.map(r => (
              <div className="duplicateTeamCard" key={r.code}>
                <h4>{flags[r.code]} {getCountryLabel(r.code)}</h4>
                <div className="chips">
                  {r.stickers.map(s => (
                    <button key={s.number} onClick={() => markTraded(r.code, s.number)}>
                      {r.code}{s.number} × {s.duplicates - s.traded}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Specials({specials, setSpecials, removeSpecialCapture, extraStickers, addExtraSticker, removeExtraSticker }) {
  function update(id, action) {
    setUndoStack(prev => [{label: `${id}: actualizar especial`, collection, specials, packs, log }, ...prev].slice(0, 10));
    setSpecials(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (action === "owned") return {...s, owned: true };
      if (action === "dupe") return {...s, owned: true, duplicates: s.duplicates + 1 };
      if (action === "trade" && s.traded < s.duplicates) return {...s, traded: s.traded + 1 };
      return s;
    }));
  }

  const specialGroups = [
    {name: "Panini", items: specials.filter(s => s.group === "Panini") },
    {name: "FWC · FIFA World Cup", items: specials.filter(s => s.group === "FWC") },
    {name: "Coca Cola", items: specials.filter(s => s.group === "Coca Cola") }
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
      <div className="specialProgress"><div style={{width: `${Math.round((owned / 34) * 100)}%` }} /></div>
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

function ExtraStickers({extraStickers, addExtraSticker, removeExtraSticker }) {
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