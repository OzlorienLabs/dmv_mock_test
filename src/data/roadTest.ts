/**
 * Road-test (DL-80 "Driving Performance Evaluation") study content.
 *
 * Grounded in the public DL-80 score sheet and the California Driver Handbook.
 * This is a study guide — the actual behind-the-wheel test is scored by an
 * examiner, not by this app. Verify details at https://www.dmv.ca.gov/portal/file/dl80-pdf/.
 */

export interface PreDriveControl {
  control: string;
  note: string;
}

export interface Maneuver {
  id: string;
  title: string;
  /** What the examiner is watching for. */
  lookFor: string[];
  /** Frequently-scored mistakes to avoid. */
  commonErrors: string[];
}

/** Controls the examiner may ask you to identify/operate before driving. */
export const PRE_DRIVE_CONTROLS: PreDriveControl[] = [
  { control: "Turn signals", note: "Show the left and right turn signals." },
  { control: "Hand signals", note: "Left turn (arm straight out), right turn (arm up), stop/slow (arm down)." },
  { control: "Headlights", note: "Low beam and high beam." },
  { control: "Windshield wipers", note: "Turn them on." },
  { control: "Defroster / defogger", note: "Front windshield (and rear, if equipped)." },
  { control: "Emergency / hazard flashers", note: "Turn them on and off." },
  { control: "Horn", note: "Sound it briefly." },
  { control: "Parking (emergency) brake", note: "Set and release it." },
  { control: "Foot brake", note: "Brake lights must work." },
  { control: "Windows", note: "Both front windows must roll down so you can give hand signals." },
];

/** Scored driving maneuvers and skills. */
export const MANEUVERS: Maneuver[] = [
  {
    id: "backing",
    title: "Backing up",
    lookFor: [
      "Back up slowly and smoothly, about three car lengths.",
      "Look back over your right shoulder through the rear window (not just the mirror).",
      "Keep the vehicle a steady distance from the curb.",
      "Control speed with the brake, not just by lifting off the gas.",
    ],
    commonErrors: [
      "Relying only on mirrors or the backup camera.",
      "Backing too fast or jerky.",
      "Hitting or drifting away from the curb.",
    ],
  },
  {
    id: "intersections",
    title: "Intersections",
    lookFor: [
      "Scan left–right–left as you approach.",
      "Come to a complete stop behind the limit line or crosswalk.",
      "Yield the right-of-way correctly and don't block the crosswalk.",
      "Proceed only when it is clearly safe.",
    ],
    commonErrors: [
      "Rolling ('California') stops.",
      "Stopping past the limit line or in the crosswalk.",
      "Not looking both ways / failing to yield.",
    ],
  },
  {
    id: "turns",
    title: "Turns",
    lookFor: [
      "Signal at least 100 feet before the turn.",
      "Be in the correct lane and slow down before turning.",
      "Turn into the nearest correct lane.",
      "Check for pedestrians and bicyclists.",
    ],
    commonErrors: [
      "Turning too wide or too sharp / into the wrong lane.",
      "Forgetting to signal or signaling too late.",
      "Entering the turn too fast.",
    ],
  },
  {
    id: "lane-changes",
    title: "Lane changes & merging",
    lookFor: [
      "Signal, check mirrors, then look over your shoulder for the blind spot.",
      "Change one lane at a time, smoothly.",
      "Keep pace with traffic and leave a safe gap.",
    ],
    commonErrors: [
      "No shoulder (blind-spot) check.",
      "Abrupt moves or cutting off other drivers.",
      "Changing speed too much while merging.",
    ],
  },
  {
    id: "lane-position",
    title: "Lane position & steering",
    lookFor: [
      "Keep the vehicle centered in your lane.",
      "Steer smoothly with both hands on the wheel.",
      "Hold a steady path without drifting.",
    ],
    commonErrors: [
      "Drifting or straddling lane lines.",
      "Hugging the curb or the center line.",
      "Over-correcting or jerky steering.",
    ],
  },
  {
    id: "speed",
    title: "Speed control",
    lookFor: [
      "Obey speed limits and adjust to traffic, weather, and road conditions.",
      "Accelerate and brake smoothly.",
      "Don't drive so slowly that you impede traffic.",
    ],
    commonErrors: [
      "Driving too fast or too slow for conditions.",
      "Hard, jerky stops or riding the brake.",
    ],
  },
  {
    id: "spacing",
    title: "Following distance & spacing",
    lookFor: [
      "Keep at least a 3-second following distance.",
      "At a stop, leave enough space to see the rear tires of the car ahead.",
    ],
    commonErrors: ["Following too closely.", "Stopping too close to the vehicle ahead."],
  },
  {
    id: "observation",
    title: "Observation & mirrors",
    lookFor: [
      "Check mirrors regularly and before slowing, stopping, or turning.",
      "Keep scanning far ahead and to the sides.",
    ],
    commonErrors: ["Not checking mirrors before braking or turning.", "Fixating on one spot."],
  },
  {
    id: "city-driving",
    title: "Business & residential driving",
    lookFor: [
      "Watch for pedestrians, parked cars, and cars pulling out of driveways.",
      "Obey all signs and signals; cover the brake near hazards.",
    ],
    commonErrors: ["Missing a sign or signal.", "Not anticipating pedestrians or opening doors."],
  },
];

/** Critical driving errors — any one can end the test (automatic fail). */
export const CRITICAL_ERRORS: string[] = [
  "The examiner has to take physical or verbal action to avoid a collision.",
  "Striking or hitting a curb, object, vehicle, or pedestrian.",
  "Disobeying a traffic sign, signal, or law.",
  "Speeding or driving dangerously for the conditions.",
  "Required equipment (lights, signals, wipers, horn, brakes) doesn't work — the test may not even start.",
  "Refusing to follow the examiner's instructions.",
];

/** Make sure all of this is true before your appointment. */
export const BEFORE_YOU_GO: string[] = [
  "Valid appointment and your permit or license.",
  "Current proof of insurance and registration for the vehicle.",
  "Working headlights, brake lights, turn signals, and hazard lights.",
  "Working horn, windshield wipers, and a clean, undamaged windshield.",
  "Good tires, working brakes, mirrors, and seat belts for everyone.",
  "Both front windows roll down and all doors open from inside and out.",
  "No warning lights showing on the dashboard.",
];
