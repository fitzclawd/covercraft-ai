"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const generate = async () => {
    if (!email || !jobDesc || !resume) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    setCoverLetter("");
    setUnlocked(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, jobDescription: jobDesc, resumeText: resume }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCoverLetter(data.coverLetter);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const preview = coverLetter.split(/\s+/).slice(0, 100).join(" ");
  const hasMore = coverLetter.split(/\s+/).length > 100;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          CoverCraft AI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Paste your resume &amp; job description. Get a tailored, professional cover letter in seconds.
        </p>
      </section>

      {/* How it works */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { step: "1", icon: "📋", title: "Paste Details", desc: "Add the job description and your resume or experience summary." },
          { step: "2", icon: "⚡", title: "AI Generates", desc: "Our AI crafts a tailored cover letter matching you to the role." },
          { step: "3", icon: "🚀", title: "Download & Apply", desc: "Unlock the full letter and use it in your next application." },
        ].map((item) => (
          <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Generator Form */}
      <section id="generate" className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Generate Your Cover Letter</h2>
        {error && <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-lg p-3 mb-4">{error}</div>}

        <label className="block mb-1 text-sm text-gray-400">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block mb-1 text-sm text-gray-400">Job Description</label>
        <textarea
          rows={6}
          placeholder="Paste the full job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
        />

        <label className="block mb-1 text-sm text-gray-400">Your Resume / Experience</label>
        <textarea
          rows={6}
          placeholder="Paste your resume text or a summary of your experience..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
        />

        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </section>

      {/* Result */}
      {coverLetter && (
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Your Cover Letter</h2>
          <div className="relative">
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {unlocked ? coverLetter : preview}
            </div>
            {hasMore && !unlocked && (
              <div className="relative mt-0">
                <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
                <div className="text-center pt-6 border-t border-gray-800">
                  <p className="text-gray-400 mb-3">This is a preview. Unlock the full cover letter below.</p>
                  <button
                    onClick={() => setUnlocked(true)}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 px-8 rounded-lg transition-all"
                  >
                    Unlock Full Letter — $4.99
                  </button>
                  <p className="text-xs text-gray-600 mt-2">Payment integration coming soon. Click to preview full letter.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="text-center mb-16">
        <h2 className="text-2xl font-bold mb-2">Simple Pricing</h2>
        <p className="text-gray-400 mb-6">One cover letter, one price. No subscriptions.</p>
        <div className="inline-block bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="text-5xl font-bold mb-1">$4.99</div>
          <div className="text-gray-400 mb-4">per cover letter</div>
          <ul className="text-left text-sm text-gray-300 space-y-2">
            <li>✅ AI-tailored to the job description</li>
            <li>✅ Professional tone &amp; formatting</li>
            <li>✅ Instant delivery</li>
            <li>✅ Unlimited revisions (coming soon)</li>
          </ul>
        </div>
      </section>

      <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-800">
        © 2026 CoverCraft AI. Built with Next.js &amp; OpenAI.
      </footer>
    </main>
  );
}
