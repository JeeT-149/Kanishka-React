export interface MaterialsCareProps {
  materials?: string[];
  care?: string;
}

export function MaterialsCare({ materials, care }: MaterialsCareProps) {
  if (!materials && !care) return null;

  return (
    <div className="space-y-5">
      {materials && materials.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-mute">
            Materials
          </h3>
          <ul className="mt-2.5 space-y-1.5 text-sm text-ink/90">
            {materials.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent/60 shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {care && (
        <div className="rounded-lg border border-line bg-card/60 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-mute">
            Care & Maintenance
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-mute">{care}</p>
        </div>
      )}
    </div>
  );
}
