import type { CSSProperties, ImgHTMLAttributes } from "react";
import { useState } from "react";
import { IconImage } from "./Icons";

export interface SafeImageProps
  extends Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    "loading" | "aria-hidden" | "aria-label"
  > {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  style?: CSSProperties;
  fallbackSrc?: string;
}

/**
 * Image component that reserves aspect ratio to avoid layout shift,
 * supports graceful fallback to an alternate image (e.g. vector art),
 * and renders a neutral fallback placeholder when an image fails to load.
 */
export function SafeImage({
  src,
  alt,
  className = "",
  aspectRatio,
  style,
  loading,
  fallbackSrc,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
}: SafeImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [attemptedFallback, setAttemptedFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setAttemptedFallback(false);
    setHasError(false);
  }

  // If a raster JPG image fails to load, try its corresponding SVG vector as fallback
  const resolvedFallback =
    fallbackSrc ??
    (src.endsWith(".jpg") ? src.replace(/\.jpg$/, ".svg") : undefined);

  const activeSrc =
    attemptedFallback && resolvedFallback ? resolvedFallback : src;

  const mergedStyle: CSSProperties | undefined =
    aspectRatio || style
      ? { ...(aspectRatio ? { aspectRatio } : {}), ...style }
      : undefined;

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={ariaLabel ?? `${alt} (image unavailable)`}
        aria-hidden={ariaHidden}
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
      src={activeSrc}
      alt={alt}
      loading={loading ?? "lazy"}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      onError={() => {
        if (
          !attemptedFallback &&
          resolvedFallback &&
          resolvedFallback !== src
        ) {
          setAttemptedFallback(true);
        } else {
          setHasError(true);
        }
      }}
      style={mergedStyle}
      className={className}
    />
  );
}
