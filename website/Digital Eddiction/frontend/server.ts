import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// In-memory data store for server-backed state
let currentSession: any = {
  sessionId: "sess_demo_1",
  intention: "Study",
  goalTopic: "Linear Algebra & Machine Learning",
  durationMinutes: 45,
  sessionStartTime: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  status: "active",
};

let recordedActivities: any[] = [];
let brainBreakHistory: any[] = [];
let intentionalOverrides: Set<string> = new Set();

// 1. POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, primaryGoal } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      error: "Valid university email is required",
      validationErrors: { email: "Please enter a valid email address." },
    });
  }

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: "Full name is required",
      validationErrors: { name: "Please enter your full name." },
    });
  }

  const user = {
    id: "usr_" + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: "student",
    primaryGoal: primaryGoal || "Study",
    createdAt: new Date().toISOString(),
  };

  const token = `jwt_session_${Buffer.from(email).toString("base64")}_${Date.now()}`;

  return res.status(201).json({
    success: true,
    user,
    token,
    message: "Registration successful",
  });
});

// 2. POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
      validationErrors: { email: "Please enter a valid university email address." },
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long",
      validationErrors: { password: "Password must be at least 6 characters." },
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const userName = cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const user = {
    id: "usr_" + (cleanEmail === "alex.rivera@university.edu" ? "alex_rivera" : Date.now()),
    name: userName || "Alex Rivera",
    email: cleanEmail,
    role: "student",
    createdAt: new Date().toISOString(),
  };

  const token = `jwt_session_${Buffer.from(cleanEmail).toString("base64")}_${Date.now()}`;

  return res.json({
    success: true,
    user,
    token,
    expiresIn: rememberMe ? "30d" : "1d",
  });
});

// 3. POST /api/sessions (and /api/session alias)
const handleCreateSession = (req: express.Request, res: express.Response) => {
  const { sessionId, intention, durationMinutes, sessionStartTime, goalTopic, allowedExceptions } = req.body;

  if (!intention) {
    return res.status(400).json({
      success: false,
      error: "Intention category is required",
      validationErrors: { intention: "Please select an intention." },
    });
  }

  currentSession = {
    sessionId: sessionId || "sess_" + Date.now(),
    intention,
    goalTopic: goalTopic || intention,
    durationMinutes: Number(durationMinutes) || 45,
    sessionStartTime: sessionStartTime || new Date().toISOString(),
    allowedExceptions: allowedExceptions || [],
    status: "active",
  };

  return res.status(201).json({
    success: true,
    session: currentSession,
    message: "Focus session initiated",
  });
};

app.post("/api/sessions", handleCreateSession);
app.post("/api/session", handleCreateSession);

// 4. GET /api/dashboard
app.get("/api/dashboard", (_req, res) => {
  return res.json({
    wellnessScore: 78,
    wellnessDelta: 6,
    screenTimeHours: 3,
    screenTimeMinutes: 24,
    intentionalUsagePercent: 62,
    digitalDriftMinutes: 18,
    focusStreakDays: 13,
    insights: [
      "Your longest focused period was 42 minutes.",
      "Digital Drift decreased 18% compared with yesterday.",
      "Your strongest focus period is between 7 PM and 9 PM.",
    ],
    currentSession,
  });
});

// 5. GET /api/usage
app.get("/api/usage", (_req, res) => {
  return res.json([
    { category: "Study", minutes: 110, percentage: 54, color: "#059669" },
    { category: "Work", minutes: 45, percentage: 22, color: "#0d9488" },
    { category: "Social", minutes: 18, percentage: 9, color: "#f59e0b" },
    { category: "Entertainment", minutes: 20, percentage: 10, color: "#8b5cf6" },
    { category: "Other", minutes: 11, percentage: 5, color: "#71717a" },
  ]);
});

// 6. POST /api/activity
app.post("/api/activity", (req, res) => {
  const activity = req.body;

  if (!activity || !activity.appName) {
    return res.status(400).json({
      success: false,
      error: "Activity metadata is required",
    });
  }

  const recordedItem = {
    ...activity,
    id: activity.id || "act_" + Date.now(),
    receivedAt: new Date().toISOString(),
  };

  recordedActivities.unshift(recordedItem);
  if (recordedActivities.length > 100) {
    recordedActivities.pop();
  }

  return res.status(201).json({
    success: true,
    activity: recordedItem,
    recordedAt: recordedItem.receivedAt,
  });
});

// 7. GET /api/insights
app.get("/api/insights", (_req, res) => {
  return res.json([
    "Your longest focused period was 42 minutes.",
    "Digital Drift decreased 18% compared with yesterday.",
    "Your strongest focus period is between 7 PM and 9 PM.",
    "Taking 2-minute micro-breaks significantly lowers algorithmic feed drift.",
  ]);
});

// 8. GET /api/progress
app.get("/api/progress", (_req, res) => {
  return res.json({
    wellnessScore: { previous: 72, current: 81, delta: 9 },
    digitalDrift: { previousMinutes: 35, currentMinutes: 20, deltaPercent: -43 },
    focusSessions: { previous: 4, current: 7, deltaPercent: 75 },
    focusStreakDays: 13,
    weeklyChart: [
      { day: "Mon", wellnessScore: 74, digitalDriftMinutes: 32, focusTimeMinutes: 140 },
      { day: "Tue", wellnessScore: 76, digitalDriftMinutes: 28, focusTimeMinutes: 165 },
      { day: "Wed", wellnessScore: 78, digitalDriftMinutes: 25, focusTimeMinutes: 190 },
      { day: "Thu", wellnessScore: 80, digitalDriftMinutes: 22, focusTimeMinutes: 210 },
      { day: "Fri", wellnessScore: 79, digitalDriftMinutes: 24, focusTimeMinutes: 180 },
      { day: "Sat", wellnessScore: 82, digitalDriftMinutes: 18, focusTimeMinutes: 150 },
      { day: "Sun", wellnessScore: 81, digitalDriftMinutes: 20, focusTimeMinutes: 175 },
    ],
    intentionalVsPassive: {
      intentionalPercent: 78,
      passivePercent: 22,
    },
    insights: [
      "Your focus is strongest between 7 PM and 9 PM.",
      "Your Digital Drift decreased compared with last week.",
      "You complete longer sessions when you take a short break after 30–40 minutes.",
    ],
    recommendation:
      "Tomorrow, try a 30-minute focused Study session followed by a 2-minute Brain Break.",
  });
});

// 9. POST /api/activity/intentional
app.post("/api/activity/intentional", (req, res) => {
  const { activityId, isAligned = true, reason = "User verified intentional activity" } = req.body;

  if (!activityId) {
    return res.status(400).json({
      success: false,
      error: "activityId is required",
    });
  }

  intentionalOverrides.add(activityId);

  return res.json({
    success: true,
    activityId,
    isAligned,
    reason,
    updatedAt: new Date().toISOString(),
  });
});

// 10. POST /api/brain-break/complete
app.post("/api/brain-break/complete", (req, res) => {
  const { activity, durationSeconds, rating } = req.body;

  const breakRecord = {
    id: "brk_" + Date.now(),
    activity: activity || "4-7-8 Breathing Calm Loop",
    durationSeconds: Number(durationSeconds) || 30,
    rating: Number(rating) || 5,
    completedAt: new Date().toISOString(),
    refreshedScore: 94,
  };

  brainBreakHistory.unshift(breakRecord);

  return res.status(201).json({
    success: true,
    breakRecord,
    completedAt: breakRecord.completedAt,
    refreshedScore: breakRecord.refreshedScore,
  });
});

// Endpoint: AI Contextual Digital Drift Analysis
app.post("/api/analyze-activity", async (req, res) => {
  const {
    intention,
    goalTopic,
    appName,
    windowTitle,
    urlDomain,
    durationSeconds = 60,
    contextNotes = "",
  } = req.body;

  const ai = getGeminiClient();

  if (!ai) {
    // Graceful heuristic fallback if API key is not yet configured
    const isEducational =
      /tutorial|lecture|course|math|physics|code|github|docs|stack|notion|canvas|blackboard|coursera|khan|wikipedia|paper|pdf|research|chegg/i.test(
        `${appName} ${windowTitle} ${urlDomain}`
      );
    const isEntertainment =
      /tiktok|reels|shorts|memes|funny|game|twitch|netflix|anime|shopping|amazon|cart/i.test(
        `${appName} ${windowTitle} ${urlDomain}`
      );

    let isAligned = true;
    let driftLevel: "none" | "low" | "medium" | "high" = "none";
    let reasoning = `Activity appears aligned with your ${intention} session.`;

    if (intention === "Study" || intention === "Work" || intention === "Creative Work") {
      if (isEntertainment) {
        isAligned = false;
        driftLevel = durationSeconds > 180 ? "high" : "medium";
        reasoning = `Detected recreational activity (${appName}) while in a ${intention} session for "${goalTopic || intention}".`;
      } else if (isEducational) {
        isAligned = true;
        driftLevel = "none";
        reasoning = `Educational content detected on ${appName} aligning with your intention to ${intention}.`;
      }
    }

    return res.json({
      isAligned,
      alignmentConfidence: 0.88,
      driftLevel,
      category: isEntertainment ? "entertainment" : isEducational ? "educational" : "productive",
      contextualReasoning: reasoning,
      smartNudge: !isAligned
        ? {
            title: "Gentle Focus Check-in",
            message: `You set out to ${intention} on "${goalTopic || "your goals"}". Notice if ${appName} is serving that intention or leading into a rabbit hole.`,
            suggestionAction: "refocus",
            microStep: "Close or minimize this tab and take 3 deep breaths before returning to your study material.",
          }
        : null,
      suggestedBreakType: driftLevel === "high" ? "breathing" : "eye_reset",
    });
  }

  try {
    const prompt = `You are MindfulLoop's Contextual Digital Drift Analyzer for students.
Core Philosophy: NEVER label an app (like YouTube, Reddit, Instagram, Discord) as purely "bad" or "good". Analyze whether the specific content/activity aligns with the student's declared intention.
For example:
- YouTube watching "Linear Algebra 3Blue1Brown" while Intention = "Study" is ALIGNED (Educational).
- YouTube watching "Top 10 Gaming Clips" while Intention = "Study" is DIGITAL DRIFT (Entertainment).
- Figma browsing UI inspirations while Intention = "Creative Work" is ALIGNED.
- Reddit reading r/learnpython while Intention = "Study" is ALIGNED.

User Session Context:
- Declared Intention: "${intention}"
- Session Goal/Topic: "${goalTopic || "General Focus"}"
- Current App / Platform: "${appName}"
- Tab / Window Title: "${windowTitle}"
- URL / Domain: "${urlDomain}"
- Time Spent on this activity: ${Math.round(durationSeconds / 60)} minutes
- User Note / Whitelist: "${contextNotes}"

Analyze this activity contextually and return JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAligned: {
              type: Type.BOOLEAN,
              description: "Whether this activity aligns with the user's declared intention and goal.",
            },
            alignmentConfidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0.0 and 1.0.",
            },
            driftLevel: {
              type: Type.STRING,
              enum: ["none", "low", "medium", "high"],
              description: "Severity of digital drift.",
            },
            category: {
              type: Type.STRING,
              enum: [
                "educational",
                "productive",
                "research",
                "communication",
                "entertainment",
                "social_media",
                "gaming",
                "shopping",
                "other",
              ],
              description: "Contextual category of the current activity.",
            },
            contextualReasoning: {
              type: Type.STRING,
              description: "Warm, non-judgmental explanation of why this activity is or is not aligned.",
            },
            smartNudge: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                message: { type: Type.STRING },
                suggestionAction: {
                  type: Type.STRING,
                  enum: ["continue", "take_break", "refocus", "switch_task"],
                },
                microStep: { type: Type.STRING },
              },
            },
            suggestedBreakType: {
              type: Type.STRING,
              enum: ["breathing", "eye_reset", "stretch", "mindful_reset", "puzzle"],
            },
          },
          required: [
            "isAligned",
            "alignmentConfidence",
            "driftLevel",
            "category",
            "contextualReasoning",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error) {
    console.error("Gemini activity analysis error:", error);
    return res.status(500).json({
      error: "Activity analysis failed",
      fallback: true,
    });
  }
});

// Endpoint: AI Smart Nudge Generation
app.post("/api/generate-nudge", async (req, res) => {
  const { intention, goalTopic, appName, driftReason, nudgeStyle = "empathetic" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      title: "Mindful Pause",
      message: `You intended to ${intention} on "${goalTopic || "your priorities"}". How is your energy right now?`,
      microStep: "Take 2 intentional breaths and write down your next single action step.",
      style: nudgeStyle,
    });
  }

  try {
    const prompt = `Write a brief, encouraging, non-shaming Smart Nudge for a student experiencing digital drift.
- Intention: ${intention}
- Goal: ${goalTopic || "Focused session"}
- App drifting on: ${appName}
- Drift context: ${driftReason || "Recreational diversion"}
- Tone: ${nudgeStyle} (calm, respectful, supportive, student-friendly)

Respond in JSON format with title, message (1-2 sentences), and microStep (a 10-second actionable transition).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            message: { type: Type.STRING },
            microStep: { type: Type.STRING },
          },
          required: ["title", "message", "microStep"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err) {
    console.error("Nudge generation error:", err);
    return res.status(500).json({ error: "Failed to generate nudge" });
  }
});

// Endpoint: AI Personalized Wellness Coach Insights
app.post("/api/generate-insights", async (req, res) => {
  const { sessionSummary, userProfile } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      overallHealthScore: 84,
      keyObservation: "You maintain strong deep-work streaks in morning study sessions.",
      actionableHabits: [
        "Schedule intentional 10-minute social media windows rather than checking intermittently.",
        "Use 4-7-8 breathing when transitioning from research reading to synthesis writing.",
        "Set an explicit 25-minute Pomodoro intention when starting YouTube tutorials to prevent autoplay drift.",
      ],
      weeklyAffirmation: "Productivity isn't about avoiding screens; it's about making each screen minute intentional.",
    });
  }

  try {
    const prompt = `You are MindfulLoop's Digital Wellness Coach for students.
Analyze this user's weekly intentional technology telemetry:
Session Data: ${JSON.stringify(sessionSummary || {})}
Student Profile: ${JSON.stringify(userProfile || {})}

Provide a holistic, data-driven, encouraging student wellness assessment in JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallHealthScore: { type: Type.NUMBER },
            keyObservation: { type: Type.STRING },
            actionableHabits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            weeklyAffirmation: { type: Type.STRING },
          },
          required: ["overallHealthScore", "keyObservation", "actionableHabits", "weeklyAffirmation"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err) {
    console.error("Insights generation error:", err);
    return res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MindfulLoop server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
