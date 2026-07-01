import type { ReactNode } from "react";
import type { CategoryId } from "@/lib/types";

/**
 * Curated inline-SVG diagrams for concepts best explained visually.
 * Schematic, theme-aware, and accessible (each has an aria-label / title).
 *
 * Diagrams are attached to a question in one of three ways, resolved by
 * `resolveDiagramId` (most specific first):
 *   1. an explicit `Question.diagramId`,
 *   2. a keyword match against the question prompt (KEYWORD_RULES), or
 *   3. a per-category default (CATEGORY_DEFAULT).
 * This lets ~all questions show a relevant illustration without hand-tagging
 * every item in the bank.
 */

const ROAD = "#5b6168";
const YELLOW = "#fdb81e";
const BLUE = "#046b99";
const RED = "#b3261e";
const GREEN = "#1e7e34";
const ORANGE = "#e8730c";
const BROWN = "#6b4423";
const CAR = "#046b99";
const CAR2 = "#b3261e";
const INK = "#2b2d33";

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

function Car({
  x,
  y,
  rot = 0,
  color = CAR,
}: {
  x: number;
  y: number;
  rot?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-12" y="-20" width="24" height="40" rx="6" fill={color} />
      <rect x="-9" y="-14" width="18" height="12" rx="3" fill="#dfe7ee" />
    </g>
  );
}

/** A small pedestrian glyph (head + body), centered on (x, y). */
function Ped({ x, y, color = INK }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={color}>
      <circle cx="0" cy="-10" r="4" />
      <rect x="-3" y="-5" width="6" height="12" rx="2" />
      <rect x="-6" y="-3" width="12" height="3" rx="1.5" />
      <rect x="-3" y="6" width="2.5" height="9" />
      <rect x="1" y="6" width="2.5" height="9" />
    </g>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M0 0 L8 4 L0 8 z" fill={YELLOW} />
      </marker>
      <marker id="arrowB" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto">
        <path d="M0 0 L9 4 L0 8 z" fill={BLUE} />
      </marker>
    </defs>
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
      <text x="160" y="190" textAnchor="middle" fontSize="11" fill={INK}>You</text>
      <text x="250" y="78" textAnchor="middle" fontSize="11" fill={INK}>Has right-of-way →</text>
    </Frame>
  ),
  "yield-intersection": () => (
    <Frame label="Right-of-way: yield to the vehicle on your right">
      <rect x="0" y="80" width="320" height="40" fill={ROAD} />
      <rect x="140" y="0" width="40" height="200" fill={ROAD} />
      <line x1="160" y1="0" x2="160" y2="80" stroke={YELLOW} strokeDasharray="10 8" />
      <line x1="160" y1="120" x2="160" y2="200" stroke={YELLOW} strokeDasharray="10 8" />
      <line x1="0" y1="100" x2="120" y2="100" stroke={YELLOW} strokeDasharray="10 8" />
      <line x1="200" y1="100" x2="320" y2="100" stroke={YELLOW} strokeDasharray="10 8" />
      <Car x={160} y={150} rot={0} color={CAR} />
      <Car x={245} y={100} rot={-90} color={CAR2} />
      <text x="160" y="190" textAnchor="middle" fontSize="10" fill={INK}>You yield</text>
      <text x="250" y="78" textAnchor="middle" fontSize="10" fill={INK}>Car on your right →</text>
    </Frame>
  ),
  "t-intersection": () => (
    <Frame label="T-intersection: the through road has the right-of-way">
      <rect x="0" y="60" width="320" height="46" fill={ROAD} />
      <rect x="140" y="106" width="40" height="94" fill={ROAD} />
      <line x1="0" y1="83" x2="320" y2="83" stroke={YELLOW} strokeDasharray="12 9" />
      <Car x={160} y={165} rot={0} color={CAR} />
      <Car x={70} y={83} rot={90} color={CAR2} />
      <path d="M40 83 h-24" stroke={CAR2} strokeWidth="2" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="160" y="192" textAnchor="middle" fontSize="10" fill={INK}>You yield</text>
      <text x="215" y="52" textAnchor="middle" fontSize="10" fill={INK}>Through road = right-of-way</text>
    </Frame>
  ),
  "left-turn-yield": () => (
    <Frame label="Turning left: yield to oncoming traffic">
      <rect x="0" y="80" width="320" height="42" fill={ROAD} />
      <rect x="140" y="0" width="40" height="200" fill={ROAD} />
      <line x1="160" y1="122" x2="160" y2="200" stroke={YELLOW} strokeDasharray="10 8" />
      <line x1="160" y1="0" x2="160" y2="80" stroke={YELLOW} strokeDasharray="10 8" />
      <Car x={160} y={160} rot={0} color={CAR} />
      <path d="M160 138 q0 -30 -35 -38" fill="none" stroke={CAR} strokeWidth="2.5" markerEnd="url(#arrowB)" />
      <Car x={160} y={45} rot={180} color={CAR2} />
      <path d="M160 70 v22" stroke={CAR2} strokeWidth="2" />
      <ArrowDefs />
      <text x="70" y="150" textAnchor="middle" fontSize="10" fill={INK}>You</text>
      <text x="235" y="45" textAnchor="middle" fontSize="10" fill={INK}>Yield to oncoming</text>
    </Frame>
  ),
  roundabout: () => (
    <Frame label="Roundabout: yield to traffic already in the circle">
      <circle cx="160" cy="100" r="55" fill="none" stroke={ROAD} strokeWidth="26" />
      <circle cx="160" cy="100" r="26" fill="#cfe0cf" />
      <path d="M120 60 A 60 60 0 0 1 210 70" fill="none" stroke={YELLOW} strokeWidth="3" markerEnd="url(#arrow)" />
      <ArrowDefs />
      <Car x={160} y={185} rot={0} color={CAR} />
      <text x="160" y="160" textAnchor="middle" fontSize="11" fill={INK}>Yield, then enter →</text>
    </Frame>
  ),
  crosswalk: () => (
    <Frame label="Stop and yield to pedestrians in a crosswalk">
      <rect x="0" y="70" width="320" height="90" fill={ROAD} />
      <g fill="#fff">
        <rect x="150" y="72" width="12" height="86" />
        <rect x="170" y="72" width="12" height="86" />
        <rect x="190" y="72" width="12" height="86" />
        <rect x="210" y="72" width="12" height="86" />
      </g>
      <Ped x={186} y={110} color="#f4f6f8" />
      <Car x={70} y={115} rot={90} color={CAR} />
      <text x="160" y="185" textAnchor="middle" fontSize="10" fill={INK}>Stop for people in the crosswalk</text>
    </Frame>
  ),
  "sign-shapes": () => (
    <Frame label="Common sign shapes: stop, yield, and warning">
      <polygon points="40,30 70,30 90,50 90,80 70,100 40,100 20,80 20,50" fill={RED} />
      <text x="55" y="70" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="700">STOP</text>
      <polygon points="135,30 185,30 160,95" fill="#fff" stroke={RED} strokeWidth="6" />
      <text x="160" y="130" textAnchor="middle" fontSize="11" fill={INK}>Yield</text>
      <polygon points="255,30 290,65 255,100 220,65" fill={YELLOW} />
      <text x="255" y="70" textAnchor="middle" fontSize="18" fill={INK} fontWeight="700">!</text>
      <text x="55" y="130" textAnchor="middle" fontSize="11" fill={INK}>Stop</text>
      <text x="255" y="130" textAnchor="middle" fontSize="11" fill={INK}>Warning</text>
    </Frame>
  ),
  "sign-colors": () => (
    <Frame label="What traffic sign colors mean">
      <g fontSize="9" fill={INK}>
        <rect x="18" y="34" width="40" height="20" rx="3" fill={RED} />
        <text x="38" y="68" textAnchor="middle">Red: stop</text>
        <rect x="78" y="34" width="40" height="20" rx="3" fill={YELLOW} />
        <text x="98" y="68" textAnchor="middle">Yellow: warn</text>
        <rect x="138" y="34" width="40" height="20" rx="3" fill={ORANGE} />
        <text x="158" y="68" textAnchor="middle">Orange: work</text>
        <rect x="198" y="34" width="40" height="20" rx="3" fill={GREEN} />
        <text x="218" y="68" textAnchor="middle">Green: guide</text>
        <rect x="258" y="34" width="40" height="20" rx="3" fill={BLUE} />
        <text x="278" y="68" textAnchor="middle">Blue: service</text>
        <rect x="108" y="110" width="40" height="20" rx="3" fill={BROWN} />
        <text x="128" y="144" textAnchor="middle">Brown: parks</text>
        <rect x="172" y="110" width="40" height="20" rx="3" fill="#fff" stroke="#bbb" />
        <text x="192" y="144" textAnchor="middle">White: rules</text>
      </g>
    </Frame>
  ),
  "traffic-light": () => (
    <Frame label="Traffic signal: red, yellow and green">
      <rect x="132" y="30" width="56" height="140" rx="12" fill="#2b2d33" />
      <circle cx="160" cy="60" r="16" fill={RED} />
      <circle cx="160" cy="100" r="16" fill={YELLOW} />
      <circle cx="160" cy="140" r="16" fill={GREEN} />
      <text x="215" y="64" fontSize="10" fill={INK}>Stop</text>
      <text x="215" y="104" fontSize="10" fill={INK}>Caution</text>
      <text x="215" y="144" fontSize="10" fill={INK}>Go if clear</text>
    </Frame>
  ),
  "lane-arrows": () => (
    <Frame label="Pavement arrows tell you where the lane goes">
      <rect x="0" y="40" width="320" height="130" fill={ROAD} />
      <line x1="107" y1="40" x2="107" y2="170" stroke={YELLOW} strokeWidth="2" strokeDasharray="12 9" />
      <line x1="213" y1="40" x2="213" y2="170" stroke={YELLOW} strokeWidth="2" strokeDasharray="12 9" />
      <g fill="#fff">
        <path d="M53 150 v-45 h-14 l14 -20 14 20 h-14 z M53 105 q0 -20 -22 -20 h-8 v10 h8 q12 0 12 10 z" />
        <path d="M160 150 v-70 h-8 l12 -18 12 18 h-8 v70 z" />
        <path d="M267 150 v-45 h14 l-14 -20 -14 20 h14 z M267 105 q0 -20 22 -20 h8 v10 h-8 q-12 0 -12 10 z" />
      </g>
      <text x="160" y="32" textAnchor="middle" fontSize="10" fill={INK}>Turn or go straight as the arrow shows</text>
    </Frame>
  ),
  "no-passing-lines": () => (
    <Frame label="Center line markings and passing rules">
      <rect x="0" y="40" width="320" height="120" fill={ROAD} />
      <line x1="0" y1="70" x2="320" y2="70" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <line x1="0" y1="100" x2="320" y2="100" stroke={YELLOW} strokeWidth="3" />
      <line x1="0" y1="106" x2="320" y2="106" stroke={YELLOW} strokeWidth="3" />
      <line x1="0" y1="135" x2="320" y2="135" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <text x="160" y="30" textAnchor="middle" fontSize="11" fill={INK}>Double yellow = no passing either way</text>
    </Frame>
  ),
  "lane-use": () => (
    <Frame label="Keep right; pass on the left">
      <rect x="0" y="55" width="320" height="100" fill={ROAD} />
      <line x1="0" y1="88" x2="320" y2="88" stroke="#fff" strokeDasharray="16 12" strokeWidth="3" />
      <line x1="0" y1="122" x2="320" y2="122" stroke="#fff" strokeDasharray="16 12" strokeWidth="3" />
      <Car x={120} y={138} rot={90} color={CAR} />
      <Car x={200} y={72} rot={90} color={CAR2} />
      <path d="M225 72 h40" stroke={CAR2} strokeWidth="2.5" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="160" y="45" textAnchor="middle" fontSize="10" fill={INK}>Slower traffic keeps right; pass on the left</text>
    </Frame>
  ),
  "two-way-left-turn": () => (
    <Frame label="Shared center left-turn lane">
      <rect x="0" y="55" width="320" height="100" fill={ROAD} />
      <rect x="130" y="55" width="60" height="100" fill="#6a6f76" />
      <line x1="130" y1="55" x2="130" y2="155" stroke={YELLOW} strokeWidth="2" />
      <line x1="136" y1="55" x2="136" y2="155" stroke={YELLOW} strokeWidth="2" strokeDasharray="12 8" />
      <line x1="184" y1="55" x2="184" y2="155" stroke={YELLOW} strokeWidth="2" strokeDasharray="12 8" />
      <line x1="190" y1="55" x2="190" y2="155" stroke={YELLOW} strokeWidth="2" />
      <Car x={160} y={110} rot={0} color={CAR} />
      <text x="160" y="45" textAnchor="middle" fontSize="10" fill={INK}>Center lane: left turns only, both directions</text>
    </Frame>
  ),
  "hov-lane": () => (
    <Frame label="Carpool (HOV) lane marked with a diamond">
      <rect x="0" y="55" width="320" height="100" fill={ROAD} />
      <line x1="0" y1="98" x2="320" y2="98" stroke={YELLOW} strokeWidth="2" strokeDasharray="16 12" />
      <polygon points="70,68 84,84 70,100 56,84" fill="#fff" />
      <polygon points="160,68 174,84 160,100 146,84" fill="#fff" />
      <text x="160" y="45" textAnchor="middle" fontSize="10" fill={INK}>Diamond = carpool lane (2+ people)</text>
    </Frame>
  ),
  "curb-colors": () => (
    <Frame label="Painted curb colors and their meanings">
      <g fontSize="10" fill={INK}>
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
      <text x="80" y="180" textAnchor="middle" fontSize="10" fill={INK}>Uphill: wheels AWAY from curb</text>
      <text x="240" y="180" textAnchor="middle" fontSize="10" fill={INK}>Downhill: wheels TOWARD curb</text>
    </Frame>
  ),
  "parallel-parking": () => (
    <Frame label="Parallel park within 18 inches of the curb">
      <rect x="0" y="150" width="320" height="14" fill="#c9ac6b" />
      <line x1="0" y1="150" x2="320" y2="150" stroke="#8a7433" strokeWidth="2" />
      <Car x={70} y={120} rot={90} color="#8b9199" />
      <Car x={250} y={120} rot={90} color="#8b9199" />
      <Car x={160} y={120} rot={90} color={CAR} />
      <line x1="160" y1="132" x2="160" y2="149" stroke={BLUE} strokeWidth="2" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="160" y="182" textAnchor="middle" fontSize="10" fill={INK}>Park within 18 in. of the curb</text>
    </Frame>
  ),
  "no-parking-zone": () => (
    <Frame label="Do not park near hydrants, crosswalks or corners">
      <rect x="0" y="120" width="320" height="14" fill="#c9ac6b" />
      <g transform="translate(160 96)">
        <rect x="-6" y="0" width="12" height="24" rx="3" fill={RED} />
        <circle cx="0" cy="-2" r="7" fill={RED} />
        <rect x="-10" y="8" width="20" height="4" fill="#7a1d18" />
      </g>
      <line x1="112" y1="140" x2="152" y2="140" stroke={BLUE} strokeWidth="2" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
      <line x1="168" y1="140" x2="208" y2="140" stroke={BLUE} strokeWidth="2" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="132" y="156" textAnchor="middle" fontSize="9" fill={INK}>15 ft</text>
      <text x="188" y="156" textAnchor="middle" fontSize="9" fill={INK}>15 ft</text>
      <text x="160" y="182" textAnchor="middle" fontSize="10" fill={INK}>No parking within 15 ft of a hydrant</text>
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
      <text x="160" y="160" textAnchor="middle" fontSize="10" fill={INK}>Red flashing = STOP both directions</text>
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
      <text x="160" y="185" textAnchor="middle" fontSize="10" fill={INK}>Flashing red = stop and wait</text>
    </Frame>
  ),
  "freeway-merge": () => (
    <Frame label="Merging onto a freeway from an on-ramp">
      <rect x="0" y="60" width="320" height="70" fill={ROAD} />
      <line x1="0" y1="95" x2="320" y2="95" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <path d="M20 175 C 90 175, 110 140, 170 120" fill="none" stroke={ROAD} strokeWidth="22" strokeLinecap="round" />
      <path d="M60 165 C 110 160, 130 135, 175 118" fill="none" stroke={YELLOW} strokeWidth="3" markerEnd="url(#arrow)" />
      <ArrowDefs />
      <Car x={60} y={150} rot={-35} color={CAR} />
      <text x="200" y="50" textAnchor="middle" fontSize="10" fill={INK}>Match speed, then merge into a gap</text>
    </Frame>
  ),
  "following-distance": () => (
    <Frame label="Three-second following distance">
      <rect x="0" y="80" width="320" height="50" fill={ROAD} />
      <line x1="0" y1="105" x2="320" y2="105" stroke="#fff" strokeDasharray="14 10" strokeWidth="3" />
      <Car x={70} y={105} rot={90} color={CAR2} />
      <Car x={235} y={105} rot={90} color={CAR} />
      <line x1="95" y1="150" x2="210" y2="150" stroke={BLUE} strokeWidth="2" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="152" y="172" textAnchor="middle" fontSize="11" fill={BLUE} fontWeight="700">at least 3 seconds</text>
    </Frame>
  ),
  "emergency-vehicle": () => (
    <Frame label="Pull to the right and stop for emergency vehicles">
      <rect x="0" y="70" width="320" height="90" fill={ROAD} />
      <line x1="0" y1="115" x2="320" y2="115" stroke="#fff" strokeDasharray="16 12" strokeWidth="3" />
      <Car x={230} y={140} rot={90} color={CAR} />
      <g transform="translate(90 90)">
        <rect x="-16" y="-12" width="40" height="24" rx="4" fill={RED} />
        <rect x="-16" y="-16" width="8" height="5" rx="2" fill={BLUE} />
        <rect x="8" y="-16" width="8" height="5" rx="2" fill={RED} />
      </g>
      <path d="M120 90 h40" stroke={RED} strokeWidth="2.5" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="160" y="184" textAnchor="middle" fontSize="10" fill={INK}>Pull right and stop until it passes</text>
    </Frame>
  ),
  "move-over": () => (
    <Frame label="Move Over law: change lanes or slow down">
      <rect x="0" y="55" width="320" height="105" fill={ROAD} />
      <line x1="0" y1="95" x2="320" y2="95" stroke="#fff" strokeDasharray="16 12" strokeWidth="3" />
      <line x1="0" y1="130" x2="320" y2="130" stroke="#fff" strokeDasharray="16 12" strokeWidth="3" />
      <g transform="translate(230 145)">
        <rect x="-16" y="-11" width="34" height="22" rx="4" fill={RED} />
        <circle cx="-16" cy="-14" r="4" fill={BLUE} />
        <circle cx="6" cy="-14" r="4" fill={RED} />
      </g>
      <Car x={110} y={75} rot={90} color={CAR} />
      <path d="M135 75 h45" stroke={CAR} strokeWidth="2.5" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="160" y="45" textAnchor="middle" fontSize="10" fill={INK}>Move over a lane or slow down</text>
    </Frame>
  ),
  "speed-limit-sign": () => (
    <Frame label="Speed limit sign">
      <rect x="120" y="35" width="80" height="120" rx="6" fill="#fff" stroke={INK} strokeWidth="3" />
      <text x="160" y="62" textAnchor="middle" fontSize="12" fill={INK} fontWeight="700">SPEED</text>
      <text x="160" y="78" textAnchor="middle" fontSize="12" fill={INK} fontWeight="700">LIMIT</text>
      <text x="160" y="128" textAnchor="middle" fontSize="42" fill={INK} fontWeight="800">65</text>
      <text x="160" y="178" textAnchor="middle" fontSize="10" fill={INK}>Obey the posted limit</text>
    </Frame>
  ),
  "school-zone": () => (
    <Frame label="School zone speed limit">
      <polygon points="160,28 205,60 188,112 132,112 115,60" fill="#c9e265" stroke={INK} strokeWidth="2" />
      <Ped x={148} y={86} color={INK} />
      <Ped x={172} y={86} color={INK} />
      <text x="160" y="140" textAnchor="middle" fontSize="11" fill={INK} fontWeight="700">25 mph</text>
      <text x="160" y="162" textAnchor="middle" fontSize="10" fill={INK}>in a school zone when children are present</text>
    </Frame>
  ),
  "blind-intersection": () => (
    <Frame label="Blind intersection: 15 mph">
      <rect x="0" y="80" width="320" height="40" fill={ROAD} />
      <rect x="140" y="0" width="40" height="200" fill={ROAD} />
      <rect x="40" y="20" width="90" height="55" rx="4" fill="#b7bcc2" />
      <rect x="190" y="125" width="90" height="55" rx="4" fill="#b7bcc2" />
      <Car x={160} y={155} rot={0} color={CAR} />
      <text x="160" y="192" textAnchor="middle" fontSize="10" fill={INK}>Buildings block your view — 15 mph</text>
    </Frame>
  ),
  "bac-limits": () => (
    <Frame label="Blood alcohol (BAC) limits by driver">
      <g fontSize="10" fill={INK}>
        <rect x="30" y="45" width="70" height="70" rx="8" fill={BLUE} />
        <text x="65" y="80" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="800">0.08</text>
        <text x="65" y="130" textAnchor="middle">Age 21+</text>
        <rect x="125" y="45" width="70" height="70" rx="8" fill={ORANGE} />
        <text x="160" y="80" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="800">0.04</text>
        <text x="160" y="130" textAnchor="middle">Commercial</text>
        <rect x="220" y="45" width="70" height="70" rx="8" fill={RED} />
        <text x="255" y="80" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="800">0.01</text>
        <text x="255" y="130" textAnchor="middle">Under 21</text>
        <text x="160" y="162" textAnchor="middle">Legal BAC limit (%)</text>
      </g>
    </Frame>
  ),
  seatbelt: () => (
    <Frame label="Buckle your seat belt">
      <rect x="120" y="55" width="80" height="90" rx="10" fill="#c3ccd4" />
      <rect x="120" y="45" width="80" height="45" rx="10" fill="#d7dee4" />
      <path d="M150 60 L188 140" stroke={RED} strokeWidth="7" strokeLinecap="round" />
      <rect x="150" y="118" width="18" height="12" rx="2" fill="#4a4f55" transform="rotate(20 159 124)" />
      <text x="160" y="172" textAnchor="middle" fontSize="10" fill={INK}>Everyone must buckle up</text>
    </Frame>
  ),
  "child-seat": () => (
    <Frame label="Child passenger safety seats">
      <g fontSize="9" fill={INK}>
        <rect x="45" y="45" width="60" height="70" rx="10" fill={BLUE} />
        <circle cx="75" cy="70" r="9" fill="#dfe7ee" />
        <text x="75" y="132" textAnchor="middle">Under 2:</text>
        <text x="75" y="145" textAnchor="middle">rear-facing</text>
        <rect x="215" y="45" width="60" height="70" rx="10" fill={GREEN} />
        <circle cx="245" cy="66" r="9" fill="#dfe7ee" />
        <text x="245" y="132" textAnchor="middle">Under 8:</text>
        <text x="245" y="145" textAnchor="middle">car/booster seat</text>
        <text x="160" y="172" textAnchor="middle">Under 8 ride in the back seat</text>
      </g>
    </Frame>
  ),
  bicycle: () => (
    <Frame label="Give bicyclists at least 3 feet when passing">
      <rect x="0" y="70" width="320" height="80" fill={ROAD} />
      <line x1="0" y1="110" x2="320" y2="110" stroke="#fff" strokeDasharray="16 12" strokeWidth="3" />
      <Car x={90} y={95} rot={90} color={CAR} />
      <g transform="translate(230 130)" stroke={INK} strokeWidth="2.5" fill="none">
        <circle cx="-14" cy="8" r="9" />
        <circle cx="16" cy="8" r="9" />
        <path d="M-14 8 L2 8 L10 -6 L16 8 M2 8 L-4 -6 L6 -6" />
      </g>
      <line x1="200" y1="112" x2="200" y2="80" stroke={BLUE} strokeWidth="2" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="160" y="180" textAnchor="middle" fontSize="10" fill={INK}>Pass a bicyclist by at least 3 feet</text>
    </Frame>
  ),
  motorcycle: () => (
    <Frame label="Motorcycles are entitled to a full lane">
      <rect x="110" y="30" width="100" height="150" fill={ROAD} />
      <line x1="110" y1="30" x2="110" y2="180" stroke="#fff" strokeWidth="3" />
      <line x1="210" y1="30" x2="210" y2="180" stroke="#fff" strokeWidth="3" />
      <g transform="translate(160 105)" stroke={INK} strokeWidth="3" fill="none">
        <circle cx="-16" cy="14" r="11" />
        <circle cx="16" cy="14" r="11" />
        <path d="M-16 14 L4 14 L14 -2 M-6 -2 L10 -2" />
        <circle cx="8" cy="-8" r="5" fill={CAR} stroke="none" />
      </g>
      <text x="160" y="196" textAnchor="middle" fontSize="10" fill={INK}>Give a motorcycle the whole lane</text>
    </Frame>
  ),
  "truck-blindspot": () => (
    <Frame label="Large trucks have big blind spots (No-Zones)">
      <rect x="120" y="45" width="80" height="110" rx="6" fill={CAR} />
      <rect x="126" y="50" width="68" height="40" rx="4" fill="#dfe7ee" />
      <g fill={RED} opacity="0.35">
        <rect x="60" y="55" width="55" height="90" />
        <rect x="205" y="55" width="55" height="90" />
        <rect x="132" y="158" width="56" height="34" />
      </g>
      <text x="160" y="180" textAnchor="middle" fontSize="10" fill={INK}>Shaded areas = the driver cannot see you</text>
    </Frame>
  ),
  "no-phone": () => (
    <Frame label="No handheld phone while driving">
      <rect x="132" y="45" width="56" height="100" rx="10" fill="#2b2d33" />
      <rect x="138" y="55" width="44" height="70" rx="3" fill="#8fb8cc" />
      <circle cx="160" cy="135" r="4" fill="#8b9199" />
      <circle cx="160" cy="95" r="58" fill="none" stroke={RED} strokeWidth="8" opacity="0.85" />
      <line x1="120" y1="55" x2="200" y2="135" stroke={RED} strokeWidth="8" opacity="0.85" />
      <text x="160" y="180" textAnchor="middle" fontSize="10" fill={INK}>Hands-free only — no texting</text>
    </Frame>
  ),
  headlights: () => (
    <Frame label="Turn on headlights in low light">
      <rect x="110" y="70" width="110" height="55" rx="12" fill={CAR} />
      <rect x="128" y="60" width="70" height="30" rx="10" fill="#3a7fa0" />
      <circle cx="210" cy="112" r="7" fill="#fff7cf" />
      <path d="M217 112 L285 92 L285 132 Z" fill={YELLOW} opacity="0.5" />
      <circle cx="60" cy="45" r="14" fill={YELLOW} opacity="0.7" />
      <text x="160" y="160" textAnchor="middle" fontSize="10" fill={INK}>Lights on 30 min after sunset & when raining</text>
    </Frame>
  ),
  tires: () => (
    <Frame label="Keep tires properly inflated with good tread">
      <circle cx="160" cy="95" r="55" fill="#2b2d33" />
      <circle cx="160" cy="95" r="26" fill="#8b9199" />
      <g stroke="#4a4f55" strokeWidth="4">
        <line x1="160" y1="42" x2="160" y2="58" />
        <line x1="160" y1="132" x2="160" y2="148" />
        <line x1="107" y1="95" x2="123" y2="95" />
        <line x1="197" y1="95" x2="213" y2="95" />
        <line x1="122" y1="57" x2="133" y2="68" />
        <line x1="187" y1="122" x2="198" y2="133" />
        <line x1="198" y1="57" x2="187" y2="68" />
        <line x1="133" y1="122" x2="122" y2="133" />
      </g>
      <text x="160" y="176" textAnchor="middle" fontSize="10" fill={INK}>Check tread depth and tire pressure</text>
    </Frame>
  ),
  "insurance-minimums": () => (
    <Frame label="Carry proof of liability insurance">
      <rect x="55" y="45" width="210" height="95" rx="10" fill="#fff" stroke={BLUE} strokeWidth="3" />
      <rect x="55" y="45" width="210" height="24" rx="10" fill={BLUE} />
      <text x="160" y="62" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">AUTO INSURANCE</text>
      <g fontSize="10" fill={INK}>
        <text x="72" y="90">• Bodily injury — per person</text>
        <text x="72" y="108">• Bodily injury — per accident</text>
        <text x="72" y="126">• Property damage</text>
      </g>
      <text x="160" y="166" textAnchor="middle" fontSize="10" fill={INK}>Financial responsibility is required by law</text>
    </Frame>
  ),
  "rain-driving": () => (
    <Frame label="In rain: slow down and turn on headlights">
      <rect x="0" y="120" width="320" height="45" fill="#3f5560" />
      <Car x={160} y={120} rot={90} color={CAR} />
      <g stroke={BLUE} strokeWidth="2" opacity="0.7">
        <line x1="40" y1="30" x2="30" y2="55" />
        <line x1="90" y1="30" x2="80" y2="55" />
        <line x1="140" y1="30" x2="130" y2="55" />
        <line x1="190" y1="30" x2="180" y2="55" />
        <line x1="240" y1="30" x2="230" y2="55" />
        <line x1="290" y1="30" x2="280" y2="55" />
        <line x1="65" y1="70" x2="55" y2="95" />
        <line x1="165" y1="70" x2="155" y2="95" />
        <line x1="265" y1="70" x2="255" y2="95" />
      </g>
      <text x="160" y="186" textAnchor="middle" fontSize="10" fill={INK}>Wipers on = headlights on; slow down</text>
    </Frame>
  ),
  fog: () => (
    <Frame label="In fog, use low-beam headlights">
      <Car x={100} y={110} rot={90} color={CAR} />
      <path d="M124 96 L200 82 L200 100 Z" fill={YELLOW} opacity="0.45" />
      <g fill="#c7cdd3" opacity="0.75">
        <ellipse cx="200" cy="70" rx="70" ry="14" />
        <ellipse cx="230" cy="110" rx="75" ry="16" />
        <ellipse cx="190" cy="150" rx="70" ry="14" />
      </g>
      <text x="160" y="186" textAnchor="middle" fontSize="10" fill={INK}>Use low beams (not high) in fog</text>
    </Frame>
  ),
  skid: () => (
    <Frame label="In a skid, ease off and steer where you want to go">
      <rect x="0" y="80" width="320" height="50" fill={ROAD} />
      <Car x={150} y={105} rot={65} color={CAR} />
      <path d="M60 150 Q 150 120 250 70" fill="none" stroke={RED} strokeWidth="3" strokeDasharray="8 6" markerEnd="url(#arrowB)" />
      <ArrowDefs />
      <text x="160" y="176" textAnchor="middle" fontSize="10" fill={INK}>Ease off the gas; steer into the skid</text>
    </Frame>
  ),
  "license-card": () => (
    <Frame label="California driver license">
      <rect x="55" y="45" width="210" height="110" rx="12" fill="#eef2f5" stroke={BLUE} strokeWidth="3" />
      <rect x="55" y="45" width="210" height="26" rx="12" fill={BLUE} />
      <text x="160" y="63" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">CALIFORNIA · DRIVER LICENSE</text>
      <rect x="70" y="82" width="52" height="58" rx="4" fill="#c3ccd4" />
      <circle cx="96" cy="102" r="12" fill="#9aa0a6" />
      <path d="M80 138 q16 -22 32 0" fill="#9aa0a6" />
      <g fill="#8b9199">
        <rect x="135" y="88" width="110" height="9" rx="3" />
        <rect x="135" y="104" width="110" height="9" rx="3" />
        <rect x="135" y="120" width="70" height="9" rx="3" />
      </g>
    </Frame>
  ),
};

/** Ordered specific → broad. The first rule whose keyword appears in the
 *  (lower-cased) prompt selects that diagram. */
const KEYWORD_RULES: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["curb-parking", ["uphill", "downhill", "facing down", "facing up", "wheels toward", "wheels away", "park on a hill", "on a hill", "roll into", "roll downhill"]],
  ["parallel-parking", ["parallel park", "18 inches", "inches from the curb", "inches of the curb"]],
  ["no-parking-zone", ["fire hydrant", "never park", "may not park", "not park within", "cannot park", "no parking within", "block a driveway", "double park", "double-park", "park within"]],
  ["curb-colors", ["colored curb", "painted curb", "red curb", "blue curb", "yellow curb", "white curb", "green curb", "curb is painted", "curb painted", "curb mean", "curb indicates", "curb allows"]],
  ["school-bus", ["school bus", "stop-arm", "stop arm", "bus with flashing"]],
  ["roundabout", ["roundabout", "traffic circle", "rotary"]],
  ["four-way-stop", ["four-way", "4-way", "all-way", "all way stop", "at the same time", "same time at", "arrive at the same"]],
  ["t-intersection", ["t-intersection", "t intersection", "through road", "road ends", "ends at a", "dead-end", "dead end"]],
  ["left-turn-yield", ["turning left", "left turn", "unprotected left", "make a left"]],
  ["crosswalk", ["pedestrian", "crosswalk", "white cane", "guide dog", "blind person", "person crossing", "crossing guard", "someone is crossing"]],
  ["emergency-vehicle", ["emergency vehicle", "ambulance", "fire engine", "fire truck", "police car", "siren", "flashing red or"]],
  ["move-over", ["move over", "move-over", "tow truck", "caltrans", "highway worker", "stopped on the shoulder", "flashing amber"]],
  ["railroad-crossing", ["railroad", "train", "crossing gate", "the tracks", "grade crossing"]],
  ["freeway-merge", ["merge", "merging", "on-ramp", "on ramp", "entering the freeway", "entering a freeway", "acceleration lane"]],
  ["following-distance", ["following distance", "three-second", "three second", "3-second", "3 second", "seconds behind", "tailgat", "space cushion", "space ahead", "distance behind"]],
  ["hov-lane", ["carpool", "hov", "high-occupancy", "high occupancy", "diamond lane"]],
  ["two-way-left-turn", ["two-way left", "center left-turn", "center turn lane", "shared center", "center lane for"]],
  ["no-passing-lines", ["double yellow", "solid yellow", "broken yellow", "no-passing", "no passing", "pass another", "passing another", "safe to pass", "when passing", "may pass", "cross the yellow"]],
  ["lane-arrows", ["turn arrow", "arrow painted", "pavement arrow", "arrow in your lane", "left-turn arrow painted"]],
  ["traffic-light", ["red light", "yellow light", "green light", "green arrow", "red arrow", "flashing red", "flashing yellow", "steady red", "steady green", "solid green", "solid red", "traffic signal", "the signal", "signal light"]],
  ["lane-use",["keep right", "left lane", "right lane", "slower traffic", "which lane", "center lane", "changing lanes", "change lanes", "far right", "number of lanes", "correct lane"]],
  ["sign-colors", ["sign color", "color of a", "color of the", "yellow sign", "orange sign", "red sign", "green sign", "blue sign", "brown sign", "what color", "regulatory sign", "guide sign", "warning color"]],
  ["sign-shapes", ["octagon", "octagonal", "diamond-shaped", "diamond shaped", "pennant", "sign shape", "shape of", "shaped sign", "this sign mean", "what does this sign"]],
  ["school-zone", ["school zone", "school is in session", "children are present", "children present", "near a school"]],
  ["blind-intersection", ["blind intersection", "blind corner", "cannot see", "can't see", "obstructed view", "15 miles per hour"]],
  ["speed-limit-sign", ["speed limit", "maximum speed", "posted speed", "basic speed law", "too fast", "prima facie", "safe speed", "how fast"]],
  ["bac-limits", ["blood alcohol", "bac", "0.08", "0.04", "0.01", ".08 percent", "drunk", "intoxicated", "under the influence", "dui", "drinking", "alcohol", "drugs affect", "impaired"]],
  ["seatbelt", ["seat belt", "seatbelt", "safety belt", "buckle", "restrained by a belt"]],
  ["child-seat", ["car seat", "booster", "rear-facing", "rear facing", "forward-facing", "forward facing", "harness", "outgrown", "child restraint", "safety seat", "child passenger", "infant", "children under"]],
  ["bicycle", ["bicycle", "bicyclist", "cyclist", "bike lane", "three feet", "3 feet"]],
  ["motorcycle", ["motorcycle", "motorcyclist", "moped"]],
  ["truck-blindspot", ["large truck", "big rig", "tractor-trailer", "blind spot", "no-zone", "behind a truck", "large vehicle", "following a truck"]],
  ["no-phone", ["cell phone", "cellphone", "texting", "text message", "handheld", "mobile phone", "hands-free", "hands free", "talking on the phone", "using a phone", "wireless phone"]],
  ["headlights", ["headlight", "high beam", "low beam", "high-beam", "low-beam", "dim your", "turn on your lights", "parking lights", "use your lights", "bright lights"]],
  ["tires", ["tire", "tread", "blowout"]],
  ["insurance-minimums", ["insurance", "liability", "financial responsibility", "sr-1", "sr 22", "sr-22", "sr1", "minimum coverage", "proof of", "uninsured"]],
  ["fog", ["fog", "foggy"]],
  ["skid", ["skid", "sliding", "loss of traction", "spin out", "brakes lock", "start to slide"]],
  ["rain-driving", ["rain", "wet road", "wet pavement", "wet surface", "wiper", "slippery", "first rain", "snow", "ice", "icy"]],
  ["license-card", ["driver license", "driver's license", "provisional", "learner's permit", "instruction permit", "dmv office", "renew", "id card", "identification card", "points on your", "suspend", "revoke", "your license"]],
];

const CATEGORY_DEFAULT: Partial<Record<CategoryId, string>> = {
  "right-of-way": "yield-intersection",
  "signs-signals": "sign-shapes",
  "speed-limits": "speed-limit-sign",
  parking: "curb-colors",
  "lanes-passing": "lane-use",
  "dui-alcohol": "bac-limits",
  restraints: "seatbelt",
  "sharing-road": "bicycle",
  freeway: "freeway-merge",
  railroad: "railroad-crossing",
  emergencies: "emergency-vehicle",
  distracted: "no-phone",
  "vehicle-equipment": "headlights",
  insurance: "insurance-minimums",
  weather: "rain-driving",
  "licensing-misc": "license-card",
};

/** Every diagram id known to the library (used for validation/tests). */
export const DIAGRAM_IDS: ReadonlySet<string> = new Set(Object.keys(DIAGRAMS));

export function hasDiagram(id: string | undefined): boolean {
  return !!id && DIAGRAMS[id] !== undefined;
}

/**
 * Pick the best diagram for a question: an explicit `diagramId` wins, then a
 * keyword match on the prompt, then a per-category default. Returns undefined
 * only if none apply (or a referenced id is missing from the library).
 */
export function resolveDiagramId(q: {
  diagramId?: string;
  category: CategoryId;
  prompt: string;
}): string | undefined {
  if (q.diagramId && DIAGRAMS[q.diagramId]) return q.diagramId;

  const prompt = q.prompt.toLowerCase();
  for (const [id, keywords] of KEYWORD_RULES) {
    if (!DIAGRAMS[id]) continue;
    for (const kw of keywords) {
      if (prompt.includes(kw)) return id;
    }
  }

  const fallback = CATEGORY_DEFAULT[q.category];
  if (fallback && DIAGRAMS[fallback]) return fallback;
  return undefined;
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
