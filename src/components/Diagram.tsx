import type { ReactNode } from "react";

/**
 * Curated inline-SVG diagrams for concepts best explained visually.
 * Schematic, theme-aware, and accessible (each has an aria-label / title).
 * Keyed by `Question.diagramId`.
 */

const ROAD = "#5b6168";
const YELLOW = "#fdb81e";
const BLUE = "#046b99";
const RED = "#b3261e";
const GREEN = "#1e7e34";
const CAR = "#046b99";
const CAR2 = "#b3261e";

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label={label}
      className="h-auto w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <rect x="0" y="0" width="320" height="200" rx="10" fill="#f4f6f8" />
      {children}
    </svg>
  );
}

function Car({ x, y, rot = 0, color = CAR }: { x: number; y: number; rot?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-12" y="-20" width="24" height="40" rx="6" fill={color} />
      <rect x="-9" y="-14" width="18" height="12" rx="3" fill="#dfe7ee" />
    </g>
  );
}

const DIAGRAMS: Record<string, () => ReactNode> = {
  "four-way-stop": () => (
    <Frame label="Four-way stop: yield to the vehicle on your right">
      <rect x="0" y="80" width="320" height="40" fill={ROAD} />
      <rect x="140" y="0" width="40" height="200" fill={ROAD} />
      <line x1="0" y1="100" x2="120" y2="100" stroke={YELLOW} strokeDasharray="10 8" />
      <line x1="200" y1="100" x2="320" y2="100" stroke={YELLOW} strokeDasharray="10 8" />
      <line x1="160" y1="0" x2="160" y2="80" stroke={YELLOW} strokeDasharray="10 8" />
      <line x1="160" y1="120" x2="160" y2="200" stroke={YELLOW} strokeDasharray="10 8" />
      <Car x={160} y={150} rot={0} color={CAR} />
      <Car x={250} y={100} rot={-90} color={CAR2} />
      <text x="160" y="190" textAnchor="middle" fontSize="11" fill="#2b2d33">You</text>
      <text x="250" y="78" textAnchor="middle" fontSize="11" fill="#2b2d33">Has right-of-way →</text>
    </Frame>
  ),
  roundabout: () => (
    <Frame label="Roundabout: yield to traffic already in the circle">
      <circle cx="160" cy="100" r="55" fill="none" stroke={ROAD} strokeWidth="26" />
      <circle cx="160" cy="100" r="26" fill="#cfe0cf" />
      <path d="M120 60 A 60 60 0 0 1 210 70" fill="none" stroke={YELLOW} strokeWidth="3" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={YELLOW} />
        </marker>
      </defs>
      <Car x={160} y={185} rot={0} color={CAR} />
      <text x="160" y="160" textAnchor="middle" fontSize="11" fill="#2b2d33">Yield, then enter →</text>
    </Frame>
  ),
  "sign-shapes": () => (
    <Frame label="Common sign shapes: stop, yield, and warning">
      <polygon
        points="40,30 70,30 90,50 90,80 70,100 40,100 20,80 20,50"
        fill={RED}
      />
      <text x="55" y="70" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="700">STOP</text>
      <polygon points="135,30 185,30 160,95" fill="#fff" stroke={RED} strokeWidth="6" />
      <text x="160" y="130" textAnchor="middle" fontSize="11" fill="#2b2d33">Yield</text>
      <polygon points="255,30 290,65 255,100 220,65" fill={YELLOW} />
      <text x="255" y="70" textAnchor="middle" fontSize="18" fill="#2b2d33" fontWeight="700">!</text>
      <text x="55" y="130" textAnchor="middle" fontSize="11" fill="#2b2d33">Stop</text>
      <text x="255" y="130" textAnchor="middle" fontSize="11" fill="#2b2d33">Warning</text>
    </Frame>
  ),
  "no-passing-lines": () => (
    <Frame label="Center line markings and passing rules">
      <rect x="0" y="40" width="320" height="120" fill={ROAD} />
      <line x1="0" y1="70" x2="320" y2="70" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <line x1="0" y1="100" x2="320" y2="100" stroke={YELLOW} strokeWidth="3" />
      <line x1="0" y1="106" x2="320" y2="106" stroke={YELLOW} strokeWidth="3" />
      <line x1="0" y1="135" x2="320" y2="135" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <text x="160" y="30" textAnchor="middle" fontSize="11" fill="#2b2d33">Double yellow = no passing either way</text>
    </Frame>
  ),
  "curb-colors": () => (
    <Frame label="Painted curb colors and their meanings">
      <g fontSize="10" fill="#2b2d33">
        <rect x="20" y="40" width="50" height="16" fill={RED} />
        <text x="45" y="72" textAnchor="middle">Red: no stop</text>
        <rect x="90" y="40" width="50" height="16" fill={YELLOW} />
        <text x="115" y="72" textAnchor="middle">Yellow: load</text>
        <rect x="160" y="40" width="50" height="16" fill="#fff" stroke="#bbb" />
        <text x="185" y="72" textAnchor="middle">White: drop-off</text>
        <rect x="230" y="40" width="50" height="16" fill={GREEN} />
        <text x="255" y="72" textAnchor="middle">Green: timed</text>
        <rect x="125" y="110" width="70" height="18" fill={BLUE} />
        <text x="160" y="146" textAnchor="middle">Blue: disabled placard</text>
      </g>
    </Frame>
  ),
  "curb-parking": () => (
    <Frame label="Which way to turn wheels when parking on a hill">
      <line x1="20" y1="150" x2="150" y2="60" stroke={ROAD} strokeWidth="16" />
      <line x1="170" y1="60" x2="300" y2="150" stroke={ROAD} strokeWidth="16" />
      <Car x={78} y={108} rot={-35} color={CAR} />
      <Car x={242} y={108} rot={35} color={CAR2} />
      <text x="80" y="180" textAnchor="middle" fontSize="10" fill="#2b2d33">Uphill: wheels AWAY from curb</text>
      <text x="240" y="180" textAnchor="middle" fontSize="10" fill="#2b2d33">Downhill: wheels TOWARD curb</text>
    </Frame>
  ),
  "school-bus": () => (
    <Frame label="School bus warning lights">
      <rect x="60" y="70" width="170" height="60" rx="8" fill={YELLOW} />
      <rect x="210" y="80" width="20" height="40" rx="4" fill="#ffe9a8" />
      <circle cx="75" cy="62" r="6" fill={RED} />
      <circle cx="215" cy="62" r="6" fill={RED} />
      <circle cx="95" cy="62" r="6" fill={YELLOW} stroke="#caa400" />
      <circle cx="195" cy="62" r="6" fill={YELLOW} stroke="#caa400" />
      <rect x="40" y="95" width="20" height="22" fill={RED} />
      <text x="50" y="111" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">S</text>
      <text x="160" y="160" textAnchor="middle" fontSize="10" fill="#2b2d33">Red flashing = STOP both directions</text>
    </Frame>
  ),
  "railroad-crossing": () => (
    <Frame label="Railroad crossing with gate and lights">
      <line x1="120" y1="40" x2="120" y2="160" stroke="#888" strokeWidth="6" />
      <g transform="translate(120 60)">
        <rect x="-45" y="-12" width="40" height="8" fill={RED} transform="rotate(-15)" />
        <rect x="5" y="-12" width="40" height="8" fill="#fff" stroke="#bbb" transform="rotate(-15)" />
      </g>
      <circle cx="105" cy="95" r="7" fill={RED} />
      <circle cx="135" cy="95" r="7" fill="#7a1d18" />
      <rect x="120" y="120" width="120" height="8" fill="#a06a2c" transform="rotate(-3 120 120)" />
      <line x1="160" y1="40" x2="290" y2="160" stroke="#9aa0a6" strokeWidth="3" />
      <line x1="180" y1="40" x2="310" y2="160" stroke="#9aa0a6" strokeWidth="3" />
      <text x="160" y="185" textAnchor="middle" fontSize="10" fill="#2b2d33">Flashing red = stop and wait</text>
    </Frame>
  ),
  "freeway-merge": () => (
    <Frame label="Merging onto a freeway from an on-ramp">
      <rect x="0" y="60" width="320" height="70" fill={ROAD} />
      <line x1="0" y1="95" x2="320" y2="95" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <path d="M20 175 C 90 175, 110 140, 170 120" fill="none" stroke={ROAD} strokeWidth="22" strokeLinecap="round" />
      <path d="M60 165 C 110 160, 130 135, 175 118" fill="none" stroke={YELLOW} strokeWidth="3" markerEnd="url(#arrow2)" />
      <defs>
        <marker id="arrow2" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto">
          <path d="M0 0 L9 4 L0 8 z" fill={YELLOW} />
        </marker>
      </defs>
      <Car x={60} y={150} rot={-35} color={CAR} />
      <text x="200" y="50" textAnchor="middle" fontSize="10" fill="#2b2d33">Match speed, then merge into a gap</text>
    </Frame>
  ),
  "following-distance": () => (
    <Frame label="Three-second following distance">
      <rect x="0" y="80" width="320" height="50" fill={ROAD} />
      <line x1="0" y1="105" x2="320" y2="105" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <Car x={70} y={105} rot={90} color={CAR2} />
      <Car x={235} y={105} rot={90} color={CAR} />
      <line x1="95" y1="150" x2="210" y2="150" stroke={BLUE} strokeWidth="2" markerStart="url(#a3)" markerEnd="url(#a3)" />
      <defs>
        <marker id="a3" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto">
          <path d="M0 0 L9 4 L0 8 z" fill={BLUE} />
        </marker>
      </defs>
      <text x="152" y="172" textAnchor="middle" fontSize="11" fill={BLUE} fontWeight="700">at least 3 seconds</text>
    </Frame>
  ),
};

export function hasDiagram(id: string | undefined): boolean {
  return !!id && id in DIAGRAMS;
}

export function Diagram({ id }: { id: string }) {
  const render = DIAGRAMS[id];
  if (!render) return null;
  return (
    <div className="overflow-hidden rounded-lg border border-ca-line bg-white">
      {render()}
    </div>
  );
}
