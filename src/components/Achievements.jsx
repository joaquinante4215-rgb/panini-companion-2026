import React from "react";

export const TOTAL_STICKERS = 994;

const ACHIEVEMENT_ASSETS = {
  "bronze-medal.png": new URL("../assets/achievements/bronze-medal.png", import.meta.url).href,
  "panini-pack.png": new URL("../assets/achievements/panini-pack.png", import.meta.url).href,
  "silver-medal.png": new URL("../assets/achievements/silver-medal.png", import.meta.url).href,
  "gold-star.png": new URL("../assets/achievements/gold-star.png", import.meta.url).href,
  "gold-cup.png": new URL("../assets/achievements/gold-cup.png", import.meta.url).href,
  "silver-cup.png": new URL("../assets/achievements/silver-cup.png", import.meta.url).href,
  "crown.png": new URL("../assets/achievements/crown.png", import.meta.url).href,
  "world.png": new URL("../assets/achievements/world.png", import.meta.url).href,
  "fire-ball.png": new URL("../assets/achievements/fire-ball.png", import.meta.url).href,
  "world-cup.png": new URL("../assets/achievements/world-cup.png", import.meta.url).href,
  "special-star.png": new URL("../assets/achievements/special-star.png", import.meta.url).href,
  "coca-cola.png": new URL("../assets/achievements/coca-cola.png", import.meta.url).href,
  "fwc-stadium.png": new URL("../assets/achievements/fwc-stadium.png", import.meta.url).href,
  "family.png": new URL("../assets/achievements/family.png", import.meta.url).href,
  "coach-board.png": new URL("../assets/achievements/coach-board.png", import.meta.url).href,
  "family-league.png": new URL("../assets/achievements/family-league.png", import.meta.url).href,
  "calendar-7.png": new URL("../assets/achievements/calendar-7.png", import.meta.url).href,
  "calendar-30.png": new URL("../assets/achievements/calendar-30.png", import.meta.url).href,
  "calendar-100.png": new URL("../assets/achievements/calendar-100.png", import.meta.url).href,
};

const achievementAsset = (fileName) => ACHIEVEMENT_ASSETS[fileName] || "";

export const ACHIEVEMENT_CATEGORIES = [
  {
    id: "collector",
    title: "Coleccionista",
    color: "gold",
    items: [
      { id: "collectorNovice", image: achievementAsset("bronze-medal.png"), title: "Coleccionista Novato", description: "1 estampa", type: "owned", target: 1 },
      { id: "firstPack", image: achievementAsset("panini-pack.png"), title: "Primer Sobre", description: "7 estampas", type: "owned", target: 7 },
      { id: "hundredStickers", image: achievementAsset("silver-medal.png"), title: "100 Estampas", description: "100 estampas", type: "owned", target: 100 },
      { id: "twoHundredFiftyStickers", image: achievementAsset("gold-star.png"), title: "250 Estampas", description: "250 estampas", type: "owned", target: 250 },
      { id: "fiveHundredStickers", image: achievementAsset("gold-cup.png"), title: "500 Estampas", description: "500 estampas", type: "owned", target: 500 },
      { id: "sevenHundredFiftyStickers", image: achievementAsset("silver-cup.png"), title: "750 Estampas", description: "750 estampas", type: "owned", target: 750 },
      { id: "albumComplete", image: achievementAsset("crown.png"), title: "Álbum Completo", description: "994 estampas", type: "owned", target: TOTAL_STICKERS },
    ],
  },
  {
    id: "worldCup",
    title: "Mundialista",
    color: "blue",
    items: [
      { id: "worldCupRoad", image: achievementAsset("world.png"), title: "Camino al Mundial", description: "80%", type: "progress", target: 80 },
      { id: "almostChampion", image: achievementAsset("fire-ball.png"), title: "Casi Campeón", description: "90%", type: "progress", target: 90 },
      { id: "worldChampion", image: achievementAsset("world-cup.png"), title: "Campeón del Mundo", description: "100%", type: "progress", target: 100 },
    ],
  },
  {
    id: "specials",
    title: "Especiales",
    color: "green",
    items: [
      { id: "firstSpecial", image: achievementAsset("special-star.png"), title: "Primera Especial", description: "Primera estampa especial", type: "specialOwned", target: 1 },
      { id: "cocaColaComplete", image: achievementAsset("coca-cola.png"), title: "Colección Coca-Cola Completa", description: "14 especiales", type: "specialGroup", group: "Coca Cola", target: 14 },
      { id: "fwcComplete", image: achievementAsset("fwc-stadium.png"), title: "Colección FWC Completa", description: "19 especiales", type: "specialGroup", group: "FWC", target: 19 },
    ],
  },
  {
    id: "family",
    title: "Familia",
    color: "purple",
    items: [
      { id: "collectorFamily", image: achievementAsset("family.png"), title: "Familia Coleccionista", description: "Crear 2 perfiles", type: "family", target: 2 },
      { id: "technicalDirector", image: achievementAsset("coach-board.png"), title: "Director Técnico", description: "Crear 4 perfiles", type: "family", target: 4 },
      { id: "familyLeague", image: achievementAsset("family-league.png"), title: "Liga Familiar", description: "Crear 6 perfiles", type: "family", target: 6 },
    ],
  },
  {
    id: "consistency",
    title: "Constancia",
    color: "pink",
    items: [
      { id: "sevenDays", image: achievementAsset("calendar-7.png"), title: "7 días usando la app", description: "7 días", type: "usageDays", target: 7 },
      { id: "thirtyDays", image: achievementAsset("calendar-30.png"), title: "30 días usando la app", description: "30 días", type: "usageDays", target: 30 },
      { id: "hundredDays", image: achievementAsset("calendar-100.png"), title: "100 días usando la app", description: "100 días", type: "usageDays", target: 100 },
    ],
  },
];

export const ACHIEVEMENT_DEFINITIONS = ACHIEVEMENT_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({ ...item, categoryId: category.id, categoryTitle: category.title }))
);

function getDaysSince(dateValue) {
  if (!dateValue) return 0;
  const created = new Date(dateValue);
  if (Number.isNaN(created.getTime())) return 0;
  const diff = Date.now() - created.getTime();
  return Math.max(0, Math.floor(diff / 86400000) + 1);
}

function normalizeCode(value = "") {
  return String(value).trim().toUpperCase().replace(/\s+/g, "");
}

function isSpecialSticker(sticker = {}) {
  const code = normalizeCode(sticker.code || sticker.id || sticker.number || sticker.name);
  const group = normalizeCode(sticker.group || sticker.team || sticker.category);
  return code.startsWith("FWC") || code.startsWith("CC") || code.startsWith("COC") || group.includes("FWC") || group.includes("COCA");
}

function getStickerCode(sticker = {}) {
  return normalizeCode(sticker.code || sticker.id || sticker.number || sticker.name);
}

export function getProfileStats(profile = {}) {
  const normal = Object.values(profile.collection || {}).flat();
  const specials = Array.isArray(profile.specials) ? profile.specials : [];
  const all = [...normal, ...specials];
  const total = all.length || TOTAL_STICKERS;
  const owned = all.filter((sticker) => sticker.owned).length;
  const progress = total > 0 ? Math.round((owned / total) * 1000) / 10 : 0;
  const ownedSpecials = all.filter((sticker) => sticker.owned && isSpecialSticker(sticker));
  const specialOwned = ownedSpecials.length;

  const cocaOwned = all.filter((sticker) => {
    const code = getStickerCode(sticker);
    const group = normalizeCode(sticker.group || sticker.team || sticker.category);
    return sticker.owned && (code.startsWith("CC") || code.startsWith("COC") || group.includes("COCA"));
  }).length;

  const fwcOwned = all.filter((sticker) => {
    const code = getStickerCode(sticker);
    const group = normalizeCode(sticker.group || sticker.team || sticker.category);
    return sticker.owned && (code.startsWith("FWC") || group.includes("FWC"));
  }).length;

  const specialGroups = {
    "Coca Cola": { owned: cocaOwned, total: 14 },
    FWC: { owned: fwcOwned, total: 19 },
  };

  const usageDays = getDaysSince(profile.createdAt || profile.firstUsedAt || profile.installedAt);
  return { total, owned, progress, specialOwned, specialGroups, usageDays };
}

function getAchievementValue(definition, stats, familyProfiles) {
  if (definition.type === "owned") return stats.owned;
  if (definition.type === "progress") return stats.progress;
  if (definition.type === "specialOwned") return stats.specialOwned;
  if (definition.type === "specialGroup") return stats.specialGroups?.[definition.group]?.owned || 0;
  if (definition.type === "family") return familyProfiles.length;
  if (definition.type === "usageDays") return stats.usageDays;
  return 0;
}

export function calculateAchievements(profile = {}, familyProfiles = []) {
  const stats = getProfileStats(profile);
  return ACHIEVEMENT_DEFINITIONS.reduce((result, definition) => {
    result[definition.id] = getAchievementValue(definition, stats, familyProfiles) >= definition.target;
    return result;
  }, {});
}

export function getAchievementById(id) {
  return ACHIEVEMENT_DEFINITIONS.find((achievement) => achievement.id === id) || null;
}

export function getUnlockedAchievementIds(profile = {}, familyProfiles = []) {
  const achievements = calculateAchievements(profile, familyProfiles);
  return Object.entries(achievements).filter(([, unlocked]) => unlocked).map(([id]) => id);
}

export default function Achievements({ profile, familyProfiles = [] }) {
  const stats = getProfileStats(profile);
  const achievements = calculateAchievements(profile, familyProfiles);
  const unlockedByCategory = ACHIEVEMENT_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) => achievements[item.id]),
  })).filter((category) => category.items.length > 0);

  const unlockedCount = unlockedByCategory.reduce((sum, category) => sum + category.items.length, 0);

  return (
    <section className="achievementsPage achievementsDashboard">
      <header className="achievementTopbar">
        <div className="achievementTitleBlock">
          <div className="achievementMainIcon"><img src={achievementAsset("gold-cup.png")} alt="Trofeo" /></div>
          <div>
            <h2>LOGROS Y MEDALLAS</h2>
            <p>Colecciona, completa y desbloquea todos los logros</p>
          </div>
        </div>
        <div className="achievementUnlockedCounter">
          <span><img src={achievementAsset("gold-star.png")} alt="Estrella" /> {unlockedCount}</span>
          <small>Logros desbloqueados</small>
        </div>
      </header>

      {unlockedByCategory.length === 0 ? (
        <div className="achievementEmpty darkEmpty">
          <strong>Todavía no hay logros desbloqueados</strong>
          <p>Cuando se consiga el primer logro, aparecerá aquí automáticamente.</p>
        </div>
      ) : (
        <div className="achievementLayout">
          {unlockedByCategory.map((category) => (
            <section key={category.id} className={`achievementCategory achievementCategory-${category.id}`}>
              <h3><span className={`categoryDot categoryDot-${category.color}`} />{category.title}</h3>
              <div className="achievementsGrid">
                {category.items.map((definition) => (
                  <article key={definition.id} className={`achievementCard unlocked achievementCard-${category.id}`}>
                    <div className={`achievementIcon achievementIcon-${definition.id}`}><img src={definition.image} alt={definition.title} /></div>
                    <div className="achievementBody">
                      <h3>{definition.title}</h3>
                      <p>{definition.description}</p>
                      <small>DESBLOQUEADO</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <footer className="achievementFooter">
        <span><img src={achievementAsset("gold-cup.png")} alt="Trofeo" /></span>
        <div>
          <strong>¡Sigue así, {profile?.name || "Coleccionista"}!</strong>
          <p>Cada estampa te acerca a nuevas metas y grandes logros.</p>
        </div>
      </footer>
    </section>
  );
}
