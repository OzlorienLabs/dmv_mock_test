import type { Question } from "@/lib/types";
import { rotate, URLS } from "./util";

/**
 * A broad catalog of California road signs (DL-37), grouped so that each
 * question's distractors come from the same family of signs. Each sign yields
 * two questions: name → meaning, and meaning → name. Meanings within a group
 * are kept distinct so distractors are never accidentally correct.
 */

interface Sign {
  name: string;
  meaning: string;
}

const regulatory: Sign[] = [
  { name: "Stop", meaning: "you must come to a complete stop" },
  { name: "Yield", meaning: "you must slow down and give the right-of-way" },
  { name: "Do Not Enter", meaning: "you must not enter the road ahead" },
  { name: "Wrong Way", meaning: "you are going against traffic and must turn around" },
  { name: "One Way", meaning: "traffic moves in only one direction" },
  { name: "No U-Turn", meaning: "U-turns are not permitted here" },
  { name: "No Left Turn", meaning: "left turns are not permitted here" },
  { name: "No Right Turn", meaning: "right turns are not permitted here" },
  { name: "No Turn on Red", meaning: "you may not turn while the light is red" },
  { name: "Keep Right", meaning: "you must keep to the right of a divider" },
  { name: "Speed Limit", meaning: "the maximum speed allowed in good conditions" },
  { name: "No Parking", meaning: "parking is not allowed at this location" },
];

const warnGeometry: Sign[] = [
  { name: "Curve Ahead", meaning: "the road ahead bends" },
  { name: "Winding Road", meaning: "the road ahead has several curves" },
  { name: "Merging Traffic", meaning: "traffic may merge onto your road" },
  { name: "Added Lane", meaning: "a new lane begins ahead" },
  { name: "Divided Highway Begins", meaning: "the road ahead becomes a divided highway" },
  { name: "Divided Highway Ends", meaning: "a divided highway is ending ahead" },
  { name: "Lane Ends", meaning: "a lane ahead is ending and traffic must merge" },
  { name: "Narrow Bridge", meaning: "the bridge ahead is narrow" },
  { name: "Steep Grade", meaning: "there is a steep downhill ahead" },
  { name: "Two-Way Traffic", meaning: "you are entering a road with two-way traffic" },
];

const warnCrossings: Sign[] = [
  { name: "Cross Road", meaning: "an intersection is ahead" },
  { name: "Side Road", meaning: "another road enters from the side ahead" },
  { name: "T-Intersection", meaning: "the road you are on ends ahead" },
  { name: "Roundabout Ahead", meaning: "a roundabout is ahead" },
  { name: "Signal Ahead", meaning: "a traffic signal is ahead" },
  { name: "Stop Ahead", meaning: "a stop sign is ahead" },
  { name: "Yield Ahead", meaning: "a yield sign is ahead" },
  { name: "Pedestrian Crossing", meaning: "watch for people crossing the road" },
  { name: "Bicycle Crossing", meaning: "watch for bicycles crossing" },
  { name: "Deer Crossing", meaning: "watch for animals crossing the road" },
  { name: "School Zone", meaning: "you are approaching a school area" },
];

const guideService: Sign[] = [
  { name: "Hospital", meaning: "a hospital is located nearby" },
  { name: "Rest Area", meaning: "a rest area is ahead" },
  { name: "Gas / Fuel", meaning: "fuel services are available nearby" },
  { name: "Lodging", meaning: "lodging is available nearby" },
  { name: "Food Services", meaning: "food services are available nearby" },
  { name: "Recreational Area", meaning: "a park or recreation site is nearby" },
  { name: "Route Marker", meaning: "it identifies the highway or route number" },
  { name: "Mile Marker", meaning: "it shows the distance along the highway" },
];

const construction: Sign[] = [
  { name: "Road Work Ahead", meaning: "construction work is ahead" },
  { name: "Flagger Ahead", meaning: "a flag person is directing traffic ahead" },
  { name: "Detour", meaning: "traffic is being rerouted ahead" },
  { name: "Lane Closed", meaning: "a lane ahead is closed" },
  { name: "Workers Present", meaning: "workers are on or near the road" },
  { name: "Reduced Speed Ahead", meaning: "a lower speed limit is coming up" },
];

function fromGroup(prefix: string, group: Sign[]): Question[] {
  const out: Question[] = [];
  group.forEach((s, i) => {
    const meaningOpts = rotate(
      [s.meaning, group[(i + 1) % group.length].meaning, group[(i + 2) % group.length].meaning],
      i,
    );
    out.push({
      id: `sc-${prefix}-mean-${i + 1}`,
      category: "signs-signals",
      prompt: `What does a “${s.name}” sign mean?`,
      options: meaningOpts.map((m) => capitalize(m)),
      correctIndex: meaningOpts.indexOf(s.meaning),
      explanation: `A “${s.name}” sign means ${s.meaning}.`,
      origin: "generated",
      sourceName: "Based on the CA road sign chart (DL-37)",
      sourceUrl: URLS.SIGNCHART,
    });

    const nameOpts = rotate(
      [s.name, group[(i + 1) % group.length].name, group[(i + 2) % group.length].name],
      i + 1,
    );
    out.push({
      id: `sc-${prefix}-which-${i + 1}`,
      category: "signs-signals",
      prompt: `Which sign matches this meaning: “${capitalize(s.meaning)}”?`,
      options: nameOpts,
      correctIndex: nameOpts.indexOf(s.name),
      explanation: `The “${s.name}” sign means ${s.meaning}.`,
      origin: "generated",
      sourceName: "Based on the CA road sign chart (DL-37)",
      sourceUrl: URLS.SIGNCHART,
    });
  });
  return out;
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

export const SIGN_CATALOG_QUESTIONS: Question[] = [
  ...fromGroup("reg", regulatory),
  ...fromGroup("wg", warnGeometry),
  ...fromGroup("wc", warnCrossings),
  ...fromGroup("gs", guideService),
  ...fromGroup("con", construction),
];
