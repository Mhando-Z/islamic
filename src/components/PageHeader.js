import LanguageToggle from "./LanguageToggle";
import GeometricDivider from "./GeometricDivider";

export default function PageHeader({ eyebrow, title, subheading }) {
  return (
    <header className="px-5 pt-7 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="text-gold/80 text-[11px] tracking-[0.2em] uppercase font-body mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-2xl text-parchment leading-tight">{title}</h1>
          {subheading && (
            <p className="text-parchment-dim/70 text-sm mt-1 font-body">{subheading}</p>
          )}
        </div>
        <LanguageToggle />
      </div>
      <GeometricDivider className="mt-4" />
    </header>
  );
}
