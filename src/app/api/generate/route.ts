import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { email, jobDescription, resumeText } = await req.json();

    if (!email || !jobDescription || !resumeText) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured. Set OPENAI_API_KEY env var." }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert cover letter writer. Write professional, compelling cover letters tailored to the specific job description and candidate's experience. Use a warm but professional tone. Include specific details from both the job description and resume. Format as a proper business letter without addresses — just the body paragraphs. Keep it to 3-4 paragraphs, roughly 300-400 words.",
        },
        {
          role: "user",
          content: `Write a cover letter for the following:\n\n**Job Description:**\n${jobDescription}\n\n**Candidate Resume/Experience:**\n${resumeText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const coverLetter = completion.choices[0]?.message?.content || "Failed to generate cover letter.";

    // Supabase storage (optional)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/generations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            email,
            job_description: jobDescription,
            resume_text: resumeText,
            cover_letter: coverLetter,
          }),
        });
      } catch {
        // Silently fail — DB storage is optional
      }
    }

    return NextResponse.json({ coverLetter });
  } catch (e: unknown) {
    console.error("Generation error:", e);
    return NextResponse.json({ error: "Failed to generate cover letter." }, { status: 500 });
  }
}
