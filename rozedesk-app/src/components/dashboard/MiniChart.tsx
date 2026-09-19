"use client";
/**
 * MiniChart — lightweight inline sparkline / bar chart rendered via SVG.
 * No external chart library — pure SVG, no dependency, DRY.
 *
 * DRY: one component for all inline charts in both dashboards.
 * Supports: "bar" | "line" | "area"
 * All colours from CSS var tokens — never raw hex.
 *
 * Accessibility: decorative, aria-hidden. Labels provided by parent.
 */
import React, { useMemo } from "react";

interface MiniChartProps {
  data:       number[];
  type?:      "bar" | "line" | "area";
  color?:     string;   /* CSS colour value — default var(--brand-500) */
  height?:    number;
  className?: string;
  labels?:    string[]; /* x-axis labels — shown if provided */
}

export default function MiniChart({
  data,
  type = "bar",
  color = "var(--brand-500)",
  height = 48,
  className = "",
  labels,
}: MiniChartProps) {
  const WIDTH  = 100; /* SVG viewBox units */
  const HEIGHT = height;
  const max    = Math.max(...data, 1);
  const count  = data.length;
  const gap    = 2;

  /* ── Bar chart ── */
  const bars = useMemo(() => {
    const barW = (WIDTH - gap * (count - 1)) / count;
    return data.map((v, i) => {
      const barH = (v / max) * HEIGHT * 0.85;
      const x    = i * (barW + gap);
      const y    = HEIGHT - barH;
      return { x, y, w: barW, h: barH, v };
    });
  }, [data, max, count, HEIGHT]);

  /* ── Line / area path ── */
  const linePath = useMemo(() => {
    if (count < 2) return "";
    const stepX = WIDTH / (count - 1);
    const pts   = data.map((v, i) => [
      i * stepX,
      HEIGHT - (v / max) * HEIGHT * 0.85,
    ] as [number, number]);

    const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

    const areaD = type === "area"
      ? `${lineD} L${pts[pts.length - 1][0]},${HEIGHT} L${pts[0][0]},${HEIGHT} Z`
      : lineD;

    return { lineD, areaD };
  }, [data, max, count, HEIGHT, type]);

  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height }}
        role="presentation"
      >
        <defs>
          <linearGradient id={`area-grad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {type === "bar" && bars.map((b, i) => (
          <rect
            key={i}
            x={b.x} y={b.y} width={b.w} height={b.h}
            rx="1.5"
            fill={color}
            opacity={i === bars.length - 1 ? "1" : "0.45"}
          />
        ))}

        {(type === "line" || type === "area") && typeof linePath !== "string" && (
          <>
            {type === "area" && (
              <path
                d={linePath.areaD}
                fill={`url(#area-grad-${color.replace(/[^a-z0-9]/gi, "")})`}
              />
            )}
            <path
              d={linePath.lineD}
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* End dot */}
            {(() => {
              const last = data.length - 1;
              const stepX = WIDTH / (data.length - 1);
              const x = last * stepX;
              const y = HEIGHT - (data[last] / max) * HEIGHT * 0.85;
              return (
                <circle cx={x} cy={y} r="2.5" fill={color} />
              );
            })()}
          </>
        )}
      </svg>

      {/* X-axis labels */}
      {labels && labels.length > 0 && (
        <div className="flex justify-between mt-1">
          {labels.map((l, i) => (
            <span key={i} className="text-[8px] text-[var(--text-muted)] leading-none">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
