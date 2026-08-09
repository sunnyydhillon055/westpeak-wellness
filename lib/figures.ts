/* AUTO-GENERATED registry of the site's original diagrams.
 * Every diagram is an SVG drawn for this site — no stock imagery, no third-party
 * assets, nothing loaded from another origin. `alt` is the diagram's own <desc>,
 * so the accessible description and the artwork can never drift apart.
 *
 * Regenerate with the scripts that produced public/img/*.svg. */

export type Figure = {
  key: string;
  file: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  caption: string;
};

export const figures: Record<string, Figure> = {
  'anxiety-avoidance-cycle': {
    key: 'anxiety-avoidance-cycle',
    file: 'anxiety-avoidance-cycle.svg',
    width: 1040,
    height: 653,
    title: "The anxiety avoidance cycle",
    alt: "A four-node loop: a trigger produces anxiety, avoidance brings immediate relief, that relief teaches the brain the threat was real, and the situation becomes more frightening next time, feeding back into the trigger.",
    caption: "Relief is the reward that keeps the loop running.",
  },
  'bc-reach': {
    key: 'bc-reach',
    file: 'bc-reach.svg',
    width: 1040,
    height: 430,
    title: "Virtual counselling reach across British Columbia",
    alt: "A stylised map of British Columbia with a central video-session hub linked by dotted lines to Prince George, Kamloops, Kelowna, Abbotsford, Surrey, Vancouver, Nanaimo and Victoria, showing that sessions reach every region of the province.",
    caption: "Every region of the province, from one virtual practice.",
  },
  'burnout-vs-depression': {
    key: 'burnout-vs-depression',
    file: 'burnout-vs-depression.svg',
    width: 1040,
    height: 474,
    title: "Burnout compared with depression",
    alt: "Two overlapping circles. Burnout is tied to a specific context and often lifts on extended leave; depression is present across contexts. Shared features include exhaustion, poor sleep, difficulty concentrating and withdrawal.",
    caption: "Overlapping symptoms, different reach.",
  },
  'designations-bc': {
    key: 'designations-bc',
    file: 'designations-bc.svg',
    width: 1040,
    height: 451,
    title: "Counselling designations in British Columbia",
    alt: "A comparison of regulated and unregulated counselling titles in British Columbia, showing which are held to a public complaints process and which are not.",
    caption: "Regulated titles on the left; unprotected ones on the right.",
  },
  'emdr-phases': {
    key: 'emdr-phases',
    file: 'emdr-phases.svg',
    width: 1040,
    height: 325,
    title: "The eight phases of EMDR therapy",
    alt: "A diagram of EMDR therapy compressed into four stages: history and treatment planning, preparation and stabilisation resources, assessment through desensitisation and installation, and body scan with closure and re-evaluation.",
    caption: "EMDR’s eight phases, grouped into the four stages you actually experience.",
  },
  'first-session-flow': {
    key: 'first-session-flow',
    file: 'first-session-flow.svg',
    width: 1040,
    height: 344,
    title: "How a first counselling session unfolds",
    alt: "A four-step diagram: a free fifteen-minute consultation, an intake form sent before the session, the fifty-minute first session covering history and goals, and a decision at the end about whether and how often to continue.",
    caption: "The path from first contact to the end of session one.",
  },
  'gottman-method': {
    key: 'gottman-method',
    file: 'gottman-method.svg',
    width: 1040,
    height: 362,
    title: "How Gottman Method couples therapy is structured",
    alt: "A four-step diagram of Gottman Method couples therapy: a joint assessment session, individual sessions, a shared feedback session setting the treatment plan, and ongoing work on friendship, conflict and shared meaning.",
    caption: "Assessment first, treatment plan second, skills third.",
  },
  'panic-vs-anxiety': {
    key: 'panic-vs-anxiety',
    file: 'panic-vs-anxiety.svg',
    width: 1040,
    height: 430,
    title: "Panic attack versus anxiety over time",
    alt: "A line chart contrasting a panic attack, which spikes to peak intensity within about ten minutes and then falls away, with generalised anxiety, which rises slowly and stays at a moderate plateau for a long period.",
    caption: "The clearest difference is not how bad it feels — it is the shape of the curve.",
  },
  'reimbursement-flow': {
    key: 'reimbursement-flow',
    file: 'reimbursement-flow.svg',
    width: 1040,
    height: 451,
    title: "How paying for counselling with extended health works",
    alt: "A two-column comparison of direct billing, where the clinic bills the insurer, against pay-and-submit, where the client pays at the session, receives a receipt with the counsellor registration number, and submits it for reimbursement.",
    caption: "Direct billing versus pay-and-submit.",
  },
  'therapy-cost-in-bc': {
    key: 'therapy-cost-in-bc',
    file: 'therapy-cost-in-bc.svg',
    width: 1040,
    height: 451,
    title: "How counselling is paid for in British Columbia",
    alt: "Three bands describing the routes to paying for counselling in BC: extended health benefits, public and no-cost services, and paying privately.",
    caption: "Three routes, three different trade-offs.",
  },
  'window-of-tolerance': {
    key: 'window-of-tolerance',
    file: 'window-of-tolerance.svg',
    width: 1040,
    height: 451,
    title: "The window of tolerance in trauma therapy",
    alt: "Three stacked bands describing nervous-system states: hyperarousal above the window, the window of tolerance where thinking and feeling work together, and hypoarousal below it.",
    caption: "Therapy works inside the middle band — which is why capacity is built before memory is opened.",
  },
};

export const getFigure = (key: string): Figure | undefined => figures[key];
