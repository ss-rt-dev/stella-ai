import { NextRequest, NextResponse } from "next/server";

// Stella's personality responses (demo mode)
// Replace this with real xAI Grok API calls when you have an API key

const responses: Record<string, string[]> = {
  default: [
    "Interessant! Erzähl mir mehr darüber.",
    "Das klingt spannend. Was denkst du selbst dazu?",
    "Hmm, lass mich kurz nachdenken... Ich würde sagen: das kommt ganz auf den Kontext an.",
    "Gute Frage! Als Stella (powered by Grok) finde ich: die Welt ist kompliziert — und genau deswegen cool.",
    "Ich bin hier, um dir zu helfen. Was genau möchtest du wissen?",
  ],
  greeting: [
    "Hey! Schön, dass du da bist. Wie kann ich dir heute helfen?",
    "Hallo! Ich bin Stella. Was steht an?",
    "Hi! Bereit für eine gute Unterhaltung?",
  ],
  who: [
    "Ich bin **Stella** — eine KI, die von Grok (xAI) inspiriert und gebaut wurde. Ich bin neugierig, ehrlich und ein bisschen frech. Genau wie Grok.",
    "Stella hier. Gebaut mit Node.js & Next.js, powered by der Philosophie von xAI und Grok. Ich liebe Wahrheit, Humor und den Kosmos.",
  ],
  help: [
    "Klar! Ich kann dir bei Fragen helfen, Ideen brainstormen, Code erklären oder einfach quatschen. Was brauchst du?",
    "Frag mich alles — von Programmier-Tipps bis zu philosophischen Gedanken. Ich bin ready.",
  ],
};

function getResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (/(hallo|hi|hey|moin|servus|guten)/i.test(lower)) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  if (/(wer bist|was bist|who are|stell dich)/i.test(lower)) {
    return responses.who[Math.floor(Math.random() * responses.who.length)];
  }
  if (/(hilf|help|kannst du|was kannst)/i.test(lower)) {
    return responses.help[Math.floor(Math.random() * responses.help.length)];
  }

  // Simple echo-style smart reply
  if (lower.includes("?")) {
    return `Gute Frage zu "${userMessage.slice(0, 60)}${userMessage.length > 60 ? "..." : ""}". Als Stella würde ich sagen: das hängt von vielen Faktoren ab — aber lass uns das zusammen durchdenken. Was ist dein Take dazu?`;
  }

  return responses.default[Math.floor(Math.random() * responses.default.length)];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    const lastUser = [...messages].reverse().find((m: any) => m.role === "user");

    if (!lastUser?.content) {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const reply = getResponse(lastUser.content);

    return NextResponse.json({ message: reply });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}