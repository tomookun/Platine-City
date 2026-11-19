"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { game } from "@/data/game";
import {
  MILESTONE_TEXT,
  celebrate,
  milestoneToCelebrate,
  parseCelebrated,
  reached,
  type Celebrated,
} from "@/lib/milestones";
import { globalProgress } from "@/lib/progress";
import { useProgress } from "@/lib/progress-store";
import { ShareButton } from "./share-button";
import { Sun } from "./sun";

/* Paliers déjà fêtés, dans localStorage. null = jamais initialisé. */
const KEY = "platinecity:paliers";
let celebrated: Celebrated | null | undefined;
const listeners = new Set<() => void>();

function read(): Celebrated | null {
  try {
    return parseCelebrated(window.localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

function setCelebrated(next: Celebrated) {
  celebrated = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* navigation privée */
  }
  listeners.forEach((l) => l());
}

function useCelebrated() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => (celebrated === undefined ? (celebrated = read()) : celebrated),
    () => null,
  );
}

/**
 * Fête les paliers 25 / 50 / 75 / 100 % de la progression globale, une fois
 * chacun. À la première visite, les paliers déjà dépassés sont notés sans fête.
 */
export function MilestoneCelebration() {
  const progress = useProgress();
  const done = useCelebrated();
  const ref = useRef<HTMLDialogElement>(null);
  const global = progress ? globalProgress(game, progress) : null;
  const pending =
    global && done ? milestoneToCelebrate(global.percent, done) : null;

  // Première fois : on part de l'état actuel, sans fête rétroactive.
  useEffect(() => {
    if (global && done === null) setCelebrated(reached(global.percent));
  }, [global, done]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (pending && !d.open) d.showModal();
    if (!pending && d.open) d.close();
  }, [pending]);

  const close = () => {
    if (pending && done) setCelebrated(celebrate(done, pending));
  };

  const text = pending ? MILESTONE_TEXT[pending] : null;

  return (
    <dialog
      ref={ref}
      onClose={close}
      aria-labelledby="palier-titre"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-feuille bg-surface p-0 text-sable backdrop:bg-nuit/80"
    >
      {text && global && (
        <div className="flex flex-col items-center gap-3 px-5 pb-5 pt-6 text-center">
          <Sun percent={global.percent} />
          <p className="font-display tabular text-[88px] font-extrabold leading-[0.85]">
            {pending} %
          </p>
          <h2
            id="palier-titre"
            className="font-display text-[31px] font-bold leading-tight"
          >
            {text.title}
          </h2>
          <p className="text-brume">{text.body}</p>
          <div className="mt-2 flex w-full flex-col gap-2">
            <ShareButton stats={global} label="Partager ce palier" primary />
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="h-12 rounded-[10px] border border-contour text-[17px] font-semibold"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
