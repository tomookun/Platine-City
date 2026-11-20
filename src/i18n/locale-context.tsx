"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getGame } from "@/data/game";
import { numberFormat, paths, tr, type Locale } from "./locale";

const LocaleContext = createContext<Locale>("fr");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

/** Langue courante et outils associés, pour les composants client. */
export function useI18n() {
  const locale = useContext(LocaleContext);
  return useMemo(
    () => ({
      locale,
      t: tr(locale),
      p: paths(locale),
      game: getGame(locale),
      nf: numberFormat(locale),
    }),
    [locale],
  );
}
