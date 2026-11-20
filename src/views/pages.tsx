/**
 * Vues des pages, communes au français et à l'anglais. Les fichiers de
 * route (app/(fr)/… et app/en/…) ne font que les appeler avec leur langue.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { BackupPanel } from "@/components/backup-panel";
import { CategoryList } from "@/components/category-list";
import { ChecklistView } from "@/components/checklist-view";
import { ContributionForm } from "@/components/contribution-form";
import { GuideList } from "@/components/guide-list";
import { HomeDashboard } from "@/components/home-dashboard";
import { NewsFeed } from "@/components/news-feed";
import { OfficialTrailers } from "@/components/official-trailers";
import { ReliabilityBadge } from "@/components/reliability-badge";
import { SectionTitle } from "@/components/section-title";
import { getGuide, publishedGuides, type Block } from "@/content/guides";
import { SITE_NAME, SITE_URL, getCategory, getGame } from "@/data/game";
import { alternates } from "@/i18n/alternates";
import {
  OG_LOCALE,
  formatShortDate,
  paths,
  tr,
  type Locale,
} from "@/i18n/locale";

const h1 = "font-display text-[49px] font-extrabold leading-[0.9]";
const more =
  "inline-flex min-h-11 items-center text-[15px] font-semibold text-rose";

const og = (locale: Locale) => ({ openGraph: { locale: OG_LOCALE[locale] } });

/* ---------- Accueil ---------- */

export const homeMetadata = (locale: Locale): Metadata => ({
  alternates: alternates({ page: "home" }, locale),
  ...og(locale),
});

export function HomeView({ locale }: { locale: Locale }) {
  const t = tr(locale);
  const p = paths(locale);
  const game = getGame(locale);
  return (
    <div className="flex flex-col gap-9">
      <HomeDashboard />

      <section aria-labelledby="neuf" className="flex flex-col gap-2">
        <SectionTitle
          id="neuf"
          action={
            <Link href={p.news} className={more}>
              {t("Tout voir →", "See all →")}
            </Link>
          }
        >
          {t("Quoi de neuf", "What's new")}
        </SectionTitle>
        <NewsFeed limit={3} />
      </section>

      <section aria-labelledby="objectifs" className="flex flex-col gap-4">
        <SectionTitle
          id="objectifs"
          action={
            <Link href={p.checklist} className={more}>
              {t("Checklist →", "Checklist →")}
            </Link>
          }
        >
          {t("Tous les objectifs", "Every goal")}
        </SectionTitle>
        <CategoryList />
      </section>

      <section aria-labelledby="trailers" className="flex flex-col gap-3">
        <SectionTitle id="trailers">
          {t("Les trailers officiels", "Official trailers")}
        </SectionTitle>
        <OfficialTrailers />
      </section>

      <section aria-labelledby="guides" className="flex flex-col gap-2">
        <SectionTitle id="guides">
          {t("Guides vérifiés", "Verified guides")}
        </SectionTitle>
        <GuideList limit={3} />
        <Link href={p.contribute} className={more}>
          {t("Tu as une info ? Propose-la →", "Got a tip? Share it →")}
        </Link>
      </section>

      <AdSlot id="home-bas" />

      <p className="rounded-case border border-soleil/60 px-3 py-2 text-[13px] text-soleil">
        {t(
          `Données mises à jour le ${formatShortDate(locale, game.updatedAt)}. Le jeu vient de sortir : les chiffres sont recoupés entre plusieurs sources et confirmés en jeu au fur et à mesure.`,
          `Data updated on ${formatShortDate(locale, game.updatedAt)}. The game just came out: numbers are cross-checked across several sources and confirmed in game as we go.`,
        )}
      </p>
    </div>
  );
}

/* ---------- Checklist ---------- */

export function checklistMetadata(locale: Locale): Metadata {
  const t = tr(locale);
  return {
    title: t(
      "GTA 6 à 100 % : checklist complète en français",
      "GTA 6 100% completion checklist: every requirement",
    ),
    description: t(
      "Les 32 objectifs du 100 % de GTA 6 en français : combien sont requis, combien existent, et ta progression cochée même hors ligne.",
      "All 32 GTA 6 100% completion requirements: how many you need, how many exist, and your progress tracked even offline.",
    ),
    alternates: alternates({ page: "checklist" }, locale),
    ...og(locale),
  };
}

export function ChecklistIndexView({ locale }: { locale: Locale }) {
  const t = tr(locale);
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>{t("GTA 6 à 100 %", "GTA 6 100%")}</h1>
      <p className="text-brume">
        {t(
          "Ce qu'il faut vraiment faire pour le 100 %, catégorie par catégorie. Ta progression reste sur ce téléphone, même hors ligne.",
          "What you actually need for 100%, category by category. Your progress stays on this phone, even offline.",
        )}
      </p>
      <CategoryList />
    </div>
  );
}

/* ---------- Catégorie ---------- */

export const categoryParams = (locale: Locale) =>
  getGame(locale).categories.map((c) => ({ slug: c.slug }));

export function categoryMetadata(locale: Locale, slug: string): Metadata {
  const cat = getCategory(slug, locale);
  if (!cat) return {};
  const t = tr(locale);
  const count =
    cat.required < cat.total
      ? t(` sur ${cat.total}`, ` out of ${cat.total}`)
      : "";
  return {
    title:
      cat.items.length > 0
        ? t(
            `GTA 6 ${cat.name} : liste complète (${cat.items.length}) et checklist 100 %`,
            `GTA 6 ${cat.name}: full list (${cat.items.length}) and 100% checklist`,
          )
        : t(
            `GTA 6 ${cat.name} : combien pour le 100 % ? (${cat.required} requis)`,
            `GTA 6 ${cat.name}: how many for 100%? (${cat.required} required)`,
          ),
    description: t(
      `${cat.name} dans GTA 6 : ${cat.required} requis pour le 100 %${count}. ${cat.description}`,
      `${cat.name} in GTA 6: ${cat.required} required for 100%${count}. ${cat.description}`,
    ).slice(0, 160),
    alternates: alternates({ page: "category", id: cat.id }, locale),
    ...og(locale),
  };
}

export function CategoryView({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const cat = getCategory(slug, locale);
  if (!cat) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: tr(locale)(`${cat.name} de GTA 6`, `GTA 6 ${cat.name}`),
    numberOfItems: cat.items.length,
    url: `${SITE_URL}${paths(locale).category(cat.slug)}`,
    itemListElement: cat.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.title,
    })),
  };
  return (
    <>
      {cat.items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <ChecklistView slug={cat.slug} />
    </>
  );
}

/* ---------- Nouveautés ---------- */

export function newsMetadata(locale: Locale): Metadata {
  const t = tr(locale);
  return {
    title: t(
      "Nouveautés GTA 6 : mises à jour du 100 % et des missions",
      "GTA 6 news: 100% checklist and mission updates",
    ),
    description: t(
      "Tout ce qui change sur Platine City : nouveaux objectifs du 100 % de GTA 6, emplacements vérifiés en jeu, corrections. Mis à jour chaque jour.",
      "Everything that changes on Platine City: new GTA 6 100% goals, locations verified in game, corrections. Updated daily.",
    ),
    alternates: alternates({ page: "news" }, locale),
    ...og(locale),
  };
}

export function NewsView({ locale }: { locale: Locale }) {
  const t = tr(locale);
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>{t("Quoi de neuf", "What's new")}</h1>
      <p className="text-brume">
        {t(
          "Chaque ajout, vérification en jeu ou correction, du plus récent au plus ancien.",
          "Every addition, in-game check or correction, newest first.",
        )}
      </p>
      <NewsFeed />
    </div>
  );
}

/* ---------- Contribuer ---------- */

export function contributeMetadata(locale: Locale): Metadata {
  const t = tr(locale);
  return {
    title: t(
      "Contribuer : signaler un emplacement GTA 6",
      "Contribute: report a GTA 6 location",
    ),
    description: t(
      "Signale un emplacement ou corrige une info sur GTA 6. Chaque proposition est relue avant publication.",
      "Report a location or fix some GTA 6 info. Every submission is reviewed before it goes live.",
    ),
    alternates: alternates({ page: "contribute" }, locale),
    ...og(locale),
  };
}

export function ContributeView({ locale }: { locale: Locale }) {
  const t = tr(locale);
  return (
    <div className="flex flex-col gap-5">
      <h1 className={h1}>{t("Contribuer", "Contribute")}</h1>
      <p className="text-brume">
        {t(
          "Tu as trouvé un emplacement ou une erreur ? Dis-le-nous. Chaque proposition est relue et vérifiée en jeu avant d'être publiée.",
          "Found a location or a mistake? Tell us. Every submission is reviewed and checked in game before it's published.",
        )}
      </p>
      <ContributionForm />
    </div>
  );
}

/* ---------- Sauvegarde ---------- */

export function backupMetadata(locale: Locale): Metadata {
  const t = tr(locale);
  return {
    title: t("Ma sauvegarde", "My backup"),
    description: t(
      "Exporte ou importe ta progression 100 % sans compte.",
      "Export or import your 100% progress, no account needed.",
    ),
    robots: { index: false },
  };
}

export function BackupView({ locale }: { locale: Locale }) {
  const t = tr(locale);
  return (
    <div className="flex flex-col gap-5">
      <h1 className={h1}>{t("Ma sauvegarde", "My backup")}</h1>
      <p className="text-brume">
        {t(
          "Pas de compte : ta progression reste sur ce téléphone. Exporte-la pour la garder ou la transférer.",
          "No account: your progress stays on this phone. Export it to keep it safe or move it to another device.",
        )}
      </p>
      <BackupPanel />
    </div>
  );
}

/* ---------- Guides ---------- */

export function guidesMetadata(locale: Locale): Metadata {
  const t = tr(locale);
  return {
    title: t(
      "Guides GTA 6 en français, vérifiés en jeu",
      "GTA 6 guides, checked in game",
    ),
    description: t(
      "Guides courts en français pour GTA 6, vérifiés en jeu et datés. Astuces, emplacements et 100 %.",
      "Short GTA 6 guides, checked in game and dated. Tips, locations and 100% completion.",
    ),
    alternates: alternates({ page: "guides" }, locale),
    ...og(locale),
  };
}

export function GuidesView({ locale }: { locale: Locale }) {
  const t = tr(locale);
  return (
    <div className="flex flex-col gap-5">
      <h1 className={h1}>{t("Guides", "Guides")}</h1>
      <p className="text-brume">
        {t(
          "Chaque guide est court, écrit en français et daté de sa dernière vérification en jeu.",
          "Every guide is short and dated with its last in-game check.",
        )}
      </p>
      <GuideList />
      <Link
        href={paths(locale).contribute}
        className="flex h-12 items-center justify-center rounded-[10px] border border-contour font-bold"
      >
        {t("Proposer une info", "Share a tip")}
      </Link>
    </div>
  );
}

export const guideParams = (locale: Locale) =>
  publishedGuides(locale).map((g) => ({ slug: g.slug }));

export function guideMetadata(locale: Locale, slug: string): Metadata {
  const g = getGuide(slug, locale);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: alternates({ page: "guide", key: g.key }, locale),
    openGraph: {
      type: "article",
      modifiedTime: g.updatedAt,
      locale: OG_LOCALE[locale],
    },
  };
}

function Render({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[17px] leading-relaxed">{block.text}</p>;
    case "h2":
      return (
        <h2 className="mt-2 font-display text-[25px] font-bold">
          {block.text}
        </h2>
      );
    case "steps":
      return (
        <ol className="flex list-decimal flex-col gap-2 pl-6 text-[17px] marker:font-bold marker:text-rose">
          {block.items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      );
    case "list":
      return (
        <ul className="flex list-disc flex-col gap-2 pl-6 text-[17px] marker:text-lagon">
          {block.items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <p className="rounded-feuille bg-surface p-4 text-[17px]">
          {block.text}
        </p>
      );
  }
}

export function GuideView({ locale, slug }: { locale: Locale; slug: string }) {
  const g = getGuide(slug, locale);
  if (!g) notFound();
  const t = tr(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    dateModified: g.updatedAt,
    inLanguage: locale === "en" ? "en-US" : "fr-FR",
    url: `${SITE_URL}${paths(locale).guide(g.slug)}`,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
  return (
    <article className="flex flex-col gap-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link
        href={paths(locale).guides}
        className="-my-2 inline-flex min-h-11 items-center self-start text-[15px] text-brume"
      >
        {t("← Guides", "← Guides")}
      </Link>
      <h1 className="font-display text-[39px] font-extrabold leading-[0.95]">
        {g.title}
      </h1>
      <ReliabilityBadge value={g.reliability} about={g.about} />
      {g.body.map((b, i) => (
        <Render key={i} block={b} />
      ))}
      <AdSlot id={`guide-${g.slug}`} />
    </article>
  );
}
