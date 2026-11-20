"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCategory } from "@/data/game";
import {
  categoryProgress,
  increment,
  toggleItem,
  type Progress,
} from "@/lib/progress";
import {
  setProgress,
  setSettings,
  updateProgress,
  useProgress,
  useSettings,
} from "@/lib/progress-store";
import { game } from "@/data/game";
import { changelog } from "@/data/changelog";
import { latestChangeFor, markCategorySeen } from "@/lib/seen";
import { updateSeen } from "@/lib/seen-store";
import { getDetails } from "@/data/details";
import { CategoryIcon } from "./category-icon";
import { ItemSheet } from "./item-sheet";
import { ReliabilityBadge } from "./reliability-badge";
import { formatDay } from "@/i18n/locale";
import { useI18n } from "@/i18n/locale-context";

type Filter = "todo" | "done" | "all";
const filters: [Filter, string, string][] = [
  ["todo", "À faire", "To do"],
  ["done", "Faites", "Done"],
  ["all", "Toutes", "All"],
];

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export function ChecklistView({ slug }: { slug: string }) {
  const { t, p: paths, locale } = useI18n();
  const cat = getCategory(slug, locale)!;
  const progress = useProgress();
  const { spoilerFree } = useSettings();
  const [filter, setFilter] = useState<Filter>("todo");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<{
    text: string;
    previous: Progress;
  } | null>(null);
  // Garde visibles les éléments cochés pendant la session, pour pouvoir se corriger.
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  // Ouvrir la catégorie éteint sa pastille « Nouveau ».
  useEffect(() => {
    updateSeen((s) => markCategorySeen(s, cat.id));
  }, [cat.id]);
  const lastChange = latestChangeFor(cat.id, changelog);

  const r = progress ? categoryProgress(progress, cat) : null;

  function commit(change: (p: Progress) => Progress, text: string) {
    if (!progress) return;
    const previous = updateProgress(change);
    setToast({ text, previous });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 5000);
  }

  function toggle(id: string, label: string, done: boolean) {
    if (!progress) return;
    setTouched((t) => new Set(t).add(id));
    commit(
      (p) => toggleItem(game, p, id),
      done
        ? t(`${label} décoché`, `${label} unticked`)
        : t(`${label} coché`, `${label} ticked`),
    );
  }

  const openItem = cat.items.find((it) => it.id === openId) ?? null;
  const openHidden = !!openItem?.spoiler && spoilerFree;
  const openDone = !!(openItem && progress?.checked[openItem.id]);

  const q = normalize(query.trim());
  const items = cat.items.filter((it) => {
    const done = !!progress?.checked[it.id];
    if (filter === "todo" && done && !touched.has(it.id)) return false;
    if (filter === "done" && !done) return false;
    if (!q) return true;
    const hidden = it.spoiler && spoilerFree;
    return normalize(
      hidden
        ? `${it.n} ${it.where ?? ""}`
        : `${it.n} ${it.title} ${it.where ?? ""}`,
    ).includes(q);
  });

  return (
    <div
      className={`flex flex-col gap-4 ${cat.items.length > 0 ? "pb-40" : ""}`}
    >
      <header className="flex flex-col gap-2.5">
        <div className="-my-2 flex items-center justify-between">
          <Link
            href={paths.checklist}
            className="inline-flex min-h-11 items-center text-[15px] text-brume"
          >
            {t("Ton 100 %", "Your 100%")}
          </Link>
          <span className="flex size-11 items-center justify-center rounded-feuille bg-surface text-rose">
            <CategoryIcon id={cat.id} size={26} />
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <h1
            className={`font-display font-extrabold leading-[0.9] ${cat.name.length > 16 ? "text-[39px]" : "text-[49px]"}`}
          >
            {cat.name}
          </h1>
          <span
            className="shrink-0 whitespace-nowrap font-display tabular text-[31px] font-bold"
            aria-live="polite"
          >
            {r ? `${r.done} / ${r.total}` : `– / ${cat.required}`}
          </span>
        </div>
        <p className="text-[13px] text-brume">
          {cat.required < cat.total
            ? t(
                `${cat.required} requis pour le 100 %, sur ${cat.total} dans le jeu.`,
                `${cat.required} required for 100%, out of ${cat.total} in the game.`,
              )
            : cat.totalKnown === false
              ? t(
                  `${cat.required} requis pour le 100 %. Total dans le jeu encore inconnu.`,
                  `${cat.required} required for 100%. In-game total not known yet.`,
                )
              : t(
                  `Les ${cat.total} sont requis pour le 100 %.`,
                  `All ${cat.total} are required for 100%.`,
                )}
          {r &&
            r.all > r.total &&
            t(
              ` Bonus : ${r.all - r.total} en plus.`,
              ` Bonus: ${r.all - r.total} extra.`,
            )}
        </p>
        <div className="h-1.5 rounded-full bg-ligne" aria-hidden="true">
          <div
            className="h-1.5 rounded-full bg-lagon transition-[width] duration-300"
            style={{ width: `${r ? (r.done / r.total) * 100 : 0}%` }}
          />
        </div>
        <p className="text-brume">{cat.description}</p>
        {cat.gameLabel && cat.items.length === 0 && (
          <p className="text-[13px] text-brume">
            {t("Dans le menu du jeu : ", "In the game menu: ")}
            <span lang="en">{cat.gameLabel}</span>
          </p>
        )}
        <ReliabilityBadge value={cat.reliability} />
        {lastChange && (
          <Link
            href={paths.news}
            className="text-[13px] text-brume underline-offset-4 hover:underline"
          >
            {t("Dernière mise à jour le ", "Last updated on ")}
            {formatDay(locale, lastChange.at)}
            {t(" : ", ": ")}
            {locale === "en" ? lastChange.en.title : lastChange.title}
          </Link>
        )}
      </header>

      <section
        aria-label={t("Compteur", "Counter")}
        className="flex items-center gap-3 rounded-feuille bg-surface p-3"
      >
        <span className="flex-1 text-[15px] text-brume">
          {cat.items.length === 0
            ? t(
                "Compte ta progression avec + et −.",
                "Track your progress with + and −.",
              )
            : t(
                "Ajuste le compteur si tu en as fait hors liste.",
                "Adjust the counter if you did some off the list.",
              )}
        </span>
        <button
          type="button"
          aria-label={t(`Retirer 1 ${cat.unit}`, `Remove 1 ${cat.unit}`)}
          disabled={!progress || r?.done === 0}
          onClick={() =>
            commit(
              (p) => increment(cat, p, -1),
              t(
                `Compteur : 1 ${cat.unit} en moins`,
                `Counter: 1 ${cat.unit} less`,
              ),
            )
          }
          className="h-12 w-12 rounded-[10px] border border-contour text-2xl active:scale-95 disabled:opacity-40"
        >
          −
        </button>
        <button
          type="button"
          aria-label={t(`Ajouter 1 ${cat.unit}`, `Add 1 ${cat.unit}`)}
          disabled={!progress || r?.all === r?.max}
          onClick={() =>
            commit(
              (p) => increment(cat, p, 1),
              t(
                `Compteur : 1 ${cat.unit} en plus`,
                `Counter: 1 more ${cat.unit}`,
              ),
            )
          }
          className="h-12 w-12 rounded-[10px] bg-rose text-2xl font-bold text-nuit active:scale-95 disabled:opacity-40"
        >
          +
        </button>
      </section>

      {cat.items.length === 0 ? (
        <p className="rounded-feuille border border-ligne p-4 text-brume">
          {t(
            "La liste détaillée des emplacements arrive après vérification en jeu. En attendant, utilise le compteur, ou ",
            "The detailed location list is coming once checked in game. Meanwhile, use the counter, or ",
          )}
          <Link
            href={paths.contribute}
            className="text-rose underline underline-offset-4"
          >
            {t("signale un emplacement", "report a location")}
          </Link>
          .
        </p>
      ) : items.length === 0 ? (
        <p className="py-6 text-brume">
          {filter === "todo" && !q
            ? t("Tout est coché ici. Bravo.", "Everything's ticked here. Nice.")
            : t("Aucun élément ne correspond.", "Nothing matches.")}
        </p>
      ) : (
        <ul>
          {items.map((it) => {
            const done = !!progress?.checked[it.id];
            const hidden = it.spoiler && spoilerFree;
            return (
              <li
                key={it.id}
                className="flex items-stretch border-t border-ligne"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(it.id)}
                  aria-haspopup="dialog"
                  aria-label={t(
                    `Voir la fiche : ${hidden ? `${cat.unit} ${it.n}` : it.title}`,
                    `Open details: ${hidden ? `${cat.unit} ${it.n}` : it.title}`,
                  )}
                  className="flex min-h-16 flex-1 flex-col justify-center gap-1 py-2.5 pr-2 text-left"
                >
                  <span
                    className={`text-[17px] font-semibold ${done ? "text-brume line-through decoration-1" : ""}`}
                  >
                    {hidden
                      ? `${cat.unit[0].toUpperCase()}${cat.unit.slice(1)} ${it.n} ${t("(titre masqué)", "(title hidden)")}`
                      : it.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 text-[13px] text-brume">
                    {it.where && <span>{it.where}</span>}
                    {!hidden && getDetails(it.id)?.media?.length ? (
                      <span className="font-semibold text-lagon">
                        ▶ {t("Vidéo / photo", "Video / photo")}
                      </span>
                    ) : null}
                  </span>
                  {it.reliability.status !== cat.reliability.status && (
                    <ReliabilityBadge value={it.reliability} />
                  )}
                </button>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={done}
                  aria-label={hidden ? `${cat.unit} ${it.n}` : it.title}
                  disabled={!progress}
                  onClick={() =>
                    toggle(it.id, hidden ? `#${it.n}` : it.title, done)
                  }
                  className="flex w-14 shrink-0 items-center justify-end"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-8 items-center justify-center rounded-case border-2 ${
                      done ? "border-lagon bg-lagon" : "border-contour"
                    }`}
                  >
                    {done && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d1222"
                        strokeWidth="3"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <ItemSheet
        cat={cat}
        item={openItem}
        done={openDone}
        hidden={openHidden}
        onToggle={() =>
          openItem &&
          toggle(
            openItem.id,
            openHidden ? `#${openItem.n}` : openItem.title,
            openDone,
          )
        }
        onClose={() => setOpenId(null)}
      />

      {toast && (
        <div
          role="status"
          className={`fixed inset-x-4 ${cat.items.length > 0 ? "bottom-[calc(72px+124px+env(safe-area-inset-bottom))]" : "bottom-[calc(72px+16px+env(safe-area-inset-bottom))]"} z-40 mx-auto flex h-12 max-w-[calc(36rem-2rem)] items-center justify-between rounded-[10px] bg-sable pl-4 pr-2 text-[15px] font-semibold text-nuit`}
        >
          <span>{toast.text}</span>
          <button
            type="button"
            onClick={() => {
              setProgress(toast.previous);
              setToast(null);
            }}
            className="h-10 px-3 font-bold text-rose-fonce"
          >
            {t("Annuler", "Undo")}
          </button>
        </div>
      )}

      {cat.items.length > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-30 bg-surface">
          <div className="mx-auto flex max-w-xl flex-col gap-2.5 px-4 py-2.5">
            <div
              className="flex gap-2"
              role="group"
              aria-label={t("Filtrer", "Filter")}
            >
              {filters.map(([key, fr, en]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={`h-11 whitespace-nowrap rounded-full border px-3 text-[15px] font-semibold ${
                    filter === key
                      ? "border-rose bg-rose text-nuit"
                      : "border-contour"
                  }`}
                >
                  {t(fr, en)}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={spoilerFree}
                onClick={() => setSettings({ spoilerFree: !spoilerFree })}
                aria-label={t("Masquer les spoilers", "Hide spoilers")}
                title={
                  spoilerFree
                    ? t("Spoilers masqués", "Spoilers hidden")
                    : t("Spoilers visibles", "Spoilers shown")
                }
                className={`ml-auto flex size-11 shrink-0 items-center justify-center rounded-full border ${
                  spoilerFree
                    ? "border-lagon bg-lagon text-nuit"
                    : "border-contour text-brume"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  {spoilerFree ? (
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A9.8 9.8 0 0 1 12 5c5 0 9 4.5 10 7a13 13 0 0 1-3 4.2M6.6 6.6A13 13 0 0 0 2 12c1 2.5 5 7 10 7a9.6 9.6 0 0 0 4.4-1" />
                  ) : (
                    <path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  )}
                </svg>
              </button>
            </div>
            <label className="flex h-11 items-center gap-2.5 rounded-[10px] border border-contour px-3.5 text-brume">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <span className="sr-only">{t("Chercher", "Search")}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  cat.id === "histoire"
                    ? t(
                        "Chercher un titre, un chapitre",
                        "Search a title, a chapter",
                      )
                    : t(
                        "Chercher un numéro, un lieu",
                        "Search a number, a place",
                      )
                }
                className="min-w-0 flex-1 bg-transparent text-base text-sable placeholder:text-brume focus:outline-none"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
