import type { ReactNode } from "react";

/** Titre de rubrique avec le trait néon rose → lagon. */
export function SectionTitle({
  id,
  children,
  level = 2,
  action,
}: {
  id?: string;
  children: ReactNode;
  level?: 2 | 3;
  action?: ReactNode;
}) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <H
          id={id}
          className={`font-display font-bold leading-none ${level === 2 ? "text-[28px]" : "text-[20px] text-brume"}`}
        >
          {children}
        </H>
        <span
          aria-hidden="true"
          className={`rounded-full bg-gradient-to-r from-rose to-lagon ${level === 2 ? "h-[3px] w-12 shadow-[0_0_12px_rgba(255,92,147,0.6)]" : "h-0.5 w-6"}`}
        />
      </div>
      {action}
    </div>
  );
}
