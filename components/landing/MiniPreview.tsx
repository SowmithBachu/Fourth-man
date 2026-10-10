import type { LensId } from "@/lib/types";

/** Decorative thumbnails of what each lens shows. Not data; aria-hidden. */
export default function MiniPreview({ id, accent }: { id: LensId; accent: string }) {
  return (
    <svg viewBox="0 0 220 84" className="h-auto w-full" aria-hidden>
      <rect x={0.5} y={0.5} width={219} height={83} rx={12} fill="#0b1015" stroke="#232b33" />
      {id === "beginner" && (
        <g>
          <ellipse cx={110} cy={52} rx={92} ry={26} fill="#134a2c" stroke="#e8f8b8" strokeOpacity={0.5} />
          <rect x={106} y={42} width={8} height={22} rx={1} fill="#c7b17f" opacity={0.8} />
          <path d="M112 60 Q 150 4 196 22" fill="none" stroke={accent} strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" />
          <circle cx={196} cy={22} r={4.5} fill="#e23a46" stroke="#fff" />
          <text x={168} y={16} fontSize={12} fontWeight={800} fill={accent} style={{ fontFamily: "var(--font-display)" }}>
            SIX!
          </text>
        </g>
      )}
      {id === "strategist" && (
        <g>
          {[0, 1, 2].map((i) => {
            const played = i === 0;
            const x = 14 + i * 68;
            return (
              <g key={i} opacity={played ? 1 : 0.45}>
                <rect x={x} y={14} width={60} height={56} rx={9} fill={played ? "#2a1f0b" : "#131920"} stroke={played ? accent : "#2c343c"} strokeWidth={played ? 2 : 1} />
                <text x={x + 10} y={40} fontSize={20} fontWeight={800} fill={played ? accent : "#8e99a3"} style={{ fontFamily: "var(--font-display)" }}>
                  {String.fromCharCode(65 + i)}
                </text>
                <rect x={x + 10} y={50} width={38} height={4} rx={2} fill="#2c343c" />
                {played && (
                  <>
                    <rect x={x + 26} y={22} width={28} height={10} rx={3} fill={accent} />
                    <text x={x + 40} y={30} fontSize={7} fontWeight={800} textAnchor="middle" fill="#0b1200">
                      PLAYED
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      )}
      {id === "statistician" && (
        <g>
          {[
            [62, "#d03b3b", 0.82],
            [158, "#fab219", 0.55],
          ].map(([cx, color, pct]) => {
            const len = Math.PI * 28;
            return (
              <g key={cx as number}>
                <path d={`M ${(cx as number) - 28} 60 A 28 28 0 0 1 ${(cx as number) + 28} 60`} fill="none" stroke="#2c343c" strokeWidth={8} strokeLinecap="round" />
                <path
                  d={`M ${(cx as number) - 28} 60 A 28 28 0 0 1 ${(cx as number) + 28} 60`}
                  fill="none"
                  stroke={color as string}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={`${len * (pct as number)} ${len}`}
                />
              </g>
            );
          })}
          <text x={110} y={56} fontSize={18} textAnchor="middle" fill={accent}>
            →
          </text>
        </g>
      )}
      {id === "fantasy" && (
        <g>
          <text x={16} y={34} fontSize={22} fontWeight={700} fill={accent}>
            +12
          </text>
          <rect x={16} y={46} width={60} height={10} rx={2} fill="#3987e5" />
          <rect x={78} y={46} width={60} height={10} rx={2} fill="#d95926" />
          <rect x={160} y={18} width={46} height={18} rx={9} fill={accent} />
          <text x={183} y={30.5} fontSize={10} fontWeight={800} textAnchor="middle" fill="#0b1200">
            C ×2
          </text>
          <text x={16} y={72} fontSize={9} fill="#8e99a3">
            Run +6 · Six Bonus +6
          </text>
        </g>
      )}
    </svg>
  );
}
