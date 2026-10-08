import type { CSSProperties } from "react";
import { useState } from "react";
import { IconImage } from "./Icons";

export interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  style?: CSSProperties;
}

/**
 * Image component that reserves aspect ratio to avoid layout shift
 * and renders a neutral fallback placeholder when an image fails to load.
 */
export function SafeImage({
  src,
  alt,
  className = "",
  aspectRatio,
  style,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const mergedStyle: CSSProperties | undefined =
    aspectRatio || style
      ? { ...(aspectRatio ? { aspectRatio } : {}), ...style }
      : undefined;

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={`${alt} (image unavailable)`}
        style={mergedStyle}
        className={`flex flex-col items-center justify-center gap-2 bg-sunk text-mute ${className}`}
      >
        <IconImage width={28} height={28} />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      style={mergedStyle}
      className={className}
    />
  );
}
