/**
 * WCAG Success Criteria Mapping
 * Maps axe-core tag names to human-readable WCAG criteria
 */

export const wcagLevelLabels: Record<string, string> = {
  wcag2a: "WCAG 2.0 A",
  wcag2aa: "WCAG 2.0 AA",
  wcag2aaa: "WCAG 2.0 AAA",
  wcag21a: "WCAG 2.1 A",
  wcag21aa: "WCAG 2.1 AA",
  wcag22a: "WCAG 2.2 A",
  wcag22aa: "WCAG 2.2 AA",
};

export const wcagSuccessCriteria: Record<string, string> = {
  // 1.1 Text Alternatives
  wcag111: "1.1.1 Non-text Content",

  // 1.2 Time-based Media
  wcag121: "1.2.1 Audio-only and Video-only (Prerecorded)",
  wcag122: "1.2.2 Captions (Prerecorded)",
  wcag123: "1.2.3 Audio Description or Media Alternative (Prerecorded)",
  wcag124: "1.2.4 Captions (Live)",
  wcag125: "1.2.5 Audio Description (Prerecorded)",
  wcag126: "1.2.6 Sign Language (Prerecorded)",
  wcag127: "1.2.7 Extended Audio Description (Prerecorded)",
  wcag128: "1.2.8 Media Alternative (Prerecorded)",
  wcag129: "1.2.9 Audio-only (Live)",

  // 1.3 Adaptable
  wcag131: "1.3.1 Info and Relationships",
  wcag132: "1.3.2 Meaningful Sequence",
  wcag133: "1.3.3 Sensory Characteristics",
  wcag134: "1.3.4 Orientation",
  wcag135: "1.3.5 Identify Input Purpose",
  wcag136: "1.3.6 Identify Purpose",

  // 1.4 Distinguishable
  wcag141: "1.4.1 Use of Color",
  wcag142: "1.4.2 Audio Control",
  wcag143: "1.4.3 Contrast (Minimum)",
  wcag144: "1.4.4 Resize Text",
  wcag145: "1.4.5 Images of Text",
  wcag146: "1.4.6 Contrast (Enhanced)",
  wcag147: "1.4.7 Low or No Background Audio",
  wcag148: "1.4.8 Visual Presentation",
  wcag149: "1.4.9 Images of Text (No Exception)",
  wcag1410: "1.4.10 Reflow",
  wcag1411: "1.4.11 Non-text Contrast",
  wcag1412: "1.4.12 Text Spacing",
  wcag1413: "1.4.13 Content on Hover or Focus",

  // 2.1 Keyboard Accessible
  wcag211: "2.1.1 Keyboard",
  wcag212: "2.1.2 No Keyboard Trap",
  wcag213: "2.1.3 Keyboard (No Exception)",
  wcag214: "2.1.4 Character Key Shortcuts",

  // 2.2 Enough Time
  wcag221: "2.2.1 Timing Adjustable",
  wcag222: "2.2.2 Pause, Stop, Hide",
  wcag223: "2.2.3 No Timing",
  wcag224: "2.2.4 Interruptions",
  wcag225: "2.2.5 Re-authenticating",
  wcag226: "2.2.6 Timeouts",

  // 2.3 Seizures and Physical Reactions
  wcag231: "2.3.1 Three Flashes or Below Threshold",
  wcag232: "2.3.2 Three Flashes",
  wcag233: "2.3.3 Animation from Interactions",

  // 2.4 Navigable
  wcag241: "2.4.1 Bypass Blocks",
  wcag242: "2.4.2 Page Titled",
  wcag243: "2.4.3 Focus Order",
  wcag244: "2.4.4 Link Purpose (In Context)",
  wcag245: "2.4.5 Multiple Ways",
  wcag246: "2.4.6 Headings and Labels",
  wcag247: "2.4.7 Focus Visible",
  wcag248: "2.4.8 Location",
  wcag249: "2.4.9 Link Purpose (Link Only)",
  wcag2410: "2.4.10 Section Headings",
  wcag2411: "2.4.11 Focus Not Obscured (Minimum)",
  wcag2412: "2.4.12 Focus Not Obscured (Enhanced)",
  wcag2413: "2.4.13 Focus Appearance",

  // 2.5 Input Modalities
  wcag251: "2.5.1 Pointer Gestures",
  wcag252: "2.5.2 Pointer Cancellation",
  wcag253: "2.5.3 Label in Name",
  wcag254: "2.5.4 Motion Actuation",
  wcag255: "2.5.5 Target Size (Enhanced)",
  wcag256: "2.5.6 Concurrent Input Mechanisms",
  wcag257: "2.5.7 Dragging Movements",
  wcag258: "2.5.8 Target Size (Minimum)",

  // 3.1 Readable
  wcag311: "3.1.1 Language of Page",
  wcag312: "3.1.2 Language of Parts",
  wcag313: "3.1.3 Unusual Words",
  wcag314: "3.1.4 Abbreviations",
  wcag315: "3.1.5 Reading Level",
  wcag316: "3.1.6 Pronunciation",

  // 3.2 Predictable
  wcag321: "3.2.1 On Focus",
  wcag322: "3.2.2 On Input",
  wcag323: "3.2.3 Consistent Navigation",
  wcag324: "3.2.4 Consistent Identification",
  wcag325: "3.2.5 Change on Request",
  wcag326: "3.2.6 Consistent Help",

  // 3.3 Input Assistance
  wcag331: "3.3.1 Error Identification",
  wcag332: "3.3.2 Labels or Instructions",
  wcag333: "3.3.3 Error Suggestion",
  wcag334: "3.3.4 Error Prevention (Legal, Financial, Data)",
  wcag335: "3.3.5 Help",
  wcag336: "3.3.6 Error Prevention (All)",
  wcag337: "3.3.7 Redundant Entry",
  wcag338: "3.3.8 Accessible Authentication (Minimum)",
  wcag339: "3.3.9 Accessible Authentication (Enhanced)",

  // 4.1 Compatible
  wcag411: "4.1.1 Parsing (Obsolete)",
  wcag412: "4.1.2 Name, Role, Value",
  wcag413: "4.1.3 Status Messages",
};

export interface ParsedWcagTags {
  levels: string[]; // e.g., ["WCAG 2.0 A", "WCAG 2.1 AA"]
  criteria: string[]; // e.g., ["1.1.1 Non-text Content", "1.3.1 Info and Relationships"]
}

/**
 * Parse and format WCAG tags from axe-core results
 */
export function parseWcagTags(tags: string[]): ParsedWcagTags {
  const levels: string[] = [];
  const criteria: string[] = [];

  for (const tag of tags) {
    const lowerTag = tag.toLowerCase();

    // Check if it's a level tag
    if (wcagLevelLabels[lowerTag]) {
      levels.push(wcagLevelLabels[lowerTag]);
    }
    // Check if it's a success criterion tag
    else if (wcagSuccessCriteria[lowerTag]) {
      criteria.push(wcagSuccessCriteria[lowerTag]);
    }
  }

  // Sort levels by version and conformance level
  levels.sort();

  return { levels, criteria };
}
