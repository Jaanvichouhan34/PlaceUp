const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const FALLBACK_PLAN = [
  { id: '1', dayNumber: 1, topic: 'Arrays and Hashing Basics', duration: 120, category: 'DSA' },
  { id: '2', dayNumber: 1, topic: 'Percentage & Profit Loss', duration: 60, category: 'Aptitude' },
  { id: '3', dayNumber: 2, topic: 'Linked List Implementation', duration: 90, category: 'DSA' },
  { id: '4', dayNumber: 2, topic: 'HTML Semantic Tags & SEO', duration: 60, category: 'Web Dev' },
  { id: '5', dayNumber: 3, topic: 'Stack and Queue Operations', duration: 90, category: 'DSA' },
  { id: '6', dayNumber: 3, topic: 'Logical Reasoning: Blood Relations', duration: 60, category: 'Aptitude' },
  { id: '7', dayNumber: 4, topic: 'Binary Search Algorithms', duration: 120, category: 'DSA' },
  { id: '8', dayNumber: 4, topic: 'CSS Flexbox & Grid Masterclass', duration: 90, category: 'Web Dev' },
  { id: '9', dayNumber: 5, topic: 'Strings and Pattern Matching', duration: 90, category: 'DSA' },
  { id: '10', dayNumber: 5, topic: 'Resume Action Verbs & Formatting', duration: 45, category: 'Resume' },
  { id: '11', dayNumber: 6, topic: 'Tree Traversal (DFS/BFS)', duration: 120, category: 'DSA' },
  { id: '12', dayNumber: 6, topic: 'Mock Interview: Behavioral Questions', duration: 60, category: 'Communication' },
  { id: '13', dayNumber: 7, topic: 'Weekly Review & Problem Solving', duration: 120, category: 'DSA' },
];

const callGroqAPI = async (prompt) => {
  if (!GROQ_API_KEY) {
    throw new Error("Missing Groq API Key");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generatePlan = async (data) => {
  try {
    const prompt = `You are a placement prep expert for Indian B.Tech students. Generate a week-by-week JSON study plan. 
    Target companies: ${data.companies.join(', ')}. 
    Days left: ${data.daysRemaining}. 
    Hours per day: ${data.hoursPerDay}. 
    Weak areas: ${data.weakAreas.join(', ')}. 
    Skill level: ${data.skillLevel}. 
    IMPORTANT: The difficulty MUST scale with skill level. 
    - Beginner: Focus on fundamentals, syntax, and basic patterns (e.g., "Intro to Pointers", "Basic HTML tags").
    - Intermediate: Focus on standard problems, optimization, and real-world projects (e.g., "Binary Search on Answer", "CSS Flexbox layouts").
    - Strong: Focus on advanced topics, hard-level problems, system design, and deep dives (e.g., "Segment Trees", "Microservices Architecture", "Advanced OS Threading").
    Split tasks across DSA, Aptitude, Web Dev, Communication, Resume. 
    Each task must have: id (unique string), topic, duration in mins, category, dayNumber. 
    Return only valid JSON as an array of tasks, no explanation, no markdown.`;

    const text = await callGroqAPI(prompt);
    
    // Clean JSON string in case AI adds markdown code blocks
    let cleanJson = text.replace(/```json|```/g, "").trim();
    // Sometimes Llama models might leave text before or after the array. Let's try to extract array safely.
    const arrayStart = cleanJson.indexOf('[');
    const arrayEnd = cleanJson.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      cleanJson = cleanJson.substring(arrayStart, arrayEnd + 1);
    }

    const plan = JSON.parse(cleanJson);
    
    return { plan, isFallback: false };
  } catch (error) {
    console.error("Groq API Error:", error);
    return { plan: FALLBACK_PLAN, isFallback: true };
  }
};

export const getDailyMotivation = async (companies, daysLeft) => {
  try {
    const prompt = `Write a powerful 2-line motivational message for a B.Tech student targeting ${companies.join(', ')} with ${daysLeft} days left for placement. Be direct, energetic, and genuine. No fluff.`;
    
    const text = await callGroqAPI(prompt);
    return text.trim().replace(/"/g, ''); // Remove quotes if added by the model
  } catch (error) {
    return "The harder you work for something, the greater you'll feel when you achieve it.";
  }
};

export const rescheduleTasks = async (missedTasks, daysLeft, currentDay) => {
  try {
    const prompt = `The user missed these tasks today (Day ${currentDay}): ${JSON.stringify(missedTasks)}. 
    Days remaining in plan: ${daysLeft}. 
    Redistribute these tasks across the next 3 days (Day ${currentDay + 1} to Day ${currentDay + 3}) without overloading any single day. 
    Return updated tasks JSON only (array of task objects), no explanation.`;

    const text = await callGroqAPI(prompt);
    let cleanJson = text.replace(/```json|```/g, "").trim();
    const arrayStart = cleanJson.indexOf('[');
    const arrayEnd = cleanJson.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      cleanJson = cleanJson.substring(arrayStart, arrayEnd + 1);
    }
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Reschedule API Error:", error);
    return null;
  }
};
