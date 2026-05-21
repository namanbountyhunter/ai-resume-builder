'use client';

import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Groq from "groq-sdk";
import { pdf } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true
});

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    summary: "",
    experiences: [] as any[],
    education: [] as any[],
    skills: "",
    projects: [] as any[],
  });

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [improvingId, setImprovingId] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'creative'>('classic');

  // Default entries
  if (formData.experiences.length === 0) {
    setFormData(prev => ({ ...prev, experiences: [{ id: 1, company: "", role: "", duration: "", description: "" }] }));
  }
  if (formData.education.length === 0) {
    setFormData(prev => ({ ...prev, education: [{ id: 1, school: "", degree: "", year: "" }] }));
  }
  if (formData.projects.length === 0) {
    setFormData(prev => ({ ...prev, projects: [{ id: 1, title: "", description: "", tech: "" }] }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (arrayName: string, id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName as keyof typeof prev].map((item: any) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (arrayName: string) => {
    let newItem: any;
    if (arrayName === 'experiences') newItem = { id: Date.now(), company: "", role: "", duration: "", description: "" };
    else if (arrayName === 'education') newItem = { id: Date.now(), school: "", degree: "", year: "" };
    else newItem = { id: Date.now(), title: "", description: "", tech: "" };

    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName as keyof typeof prev] as any[]), newItem]
    }));
  };

  const generateSummary = async () => {
    if (!formData.fullName && !formData.headline) {
      alert("Please fill Name and Headline first");
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const prompt = `Write a strong professional resume summary (4-6 lines) for:\nName: ${formData.fullName || "Candidate"}\nHeadline: ${formData.headline || "Professional"}\nMake it compelling, achievement-oriented and ATS-friendly.`;
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 250,
      });
      const aiSummary = completion.choices[0]?.message?.content?.trim() || "";
      setFormData(prev => ({ ...prev, summary: aiSummary }));
    } catch (error) {
      alert("Failed to generate summary. Try again.");
    }
    setIsGeneratingSummary(false);
  };

  const improveBullet = async (id: number) => {
    const exp = formData.experiences.find(e => e.id === id);
    if (!exp?.description?.trim()) {
      alert("Please write something in the description first");
      return;
    }
    setImprovingId(id);
    try {
      const prompt = `Improve this resume bullet point. Make it more impactful and professional:\n\n"${exp.description}"\n\nReturn only the improved version.`;
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 150,
      });
      const improved = completion.choices[0]?.message?.content?.trim() || "";
      if (improved) handleArrayChange('experiences', id, 'description', improved);
    } catch (error) {
      alert("Failed to improve bullet. Try again.");
    }
    setImprovingId(null);
  };

  const downloadPDF = async () => {
    if (!formData.fullName) {
      alert("Please enter your full name first");
      return;
    }
    try {
      const blob = await pdf(<ResumePDF formData={formData} template={selectedTemplate} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to generate PDF");
    }
  };

  const templates = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'creative', name: 'Creative' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 bg-zinc-950 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="font-semibold">Untitled Resume</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2 text-sm border border-zinc-700 rounded-xl hover:bg-zinc-900">Save Draft</button>
          <button onClick={downloadPDF} className="px-6 py-2 bg-white text-black font-medium rounded-xl hover:bg-zinc-200">Download PDF</button>
          <UserButton />
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Form Sidebar */}
        <div className="w-2/5 border-r border-zinc-800 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Build Your Resume</h2>
            <div className="flex gap-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id as any)}
                  className={`px-4 py-1.5 text-sm rounded-xl border transition-all ${selectedTemplate === t.id ? 'bg-white text-black border-white' : 'border-zinc-700 hover:bg-zinc-900'}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3" />
              <input name="headline" value={formData.headline} onChange={handleChange} placeholder="Professional Headline" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3" />
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Professional Summary</h3>
              <button onClick={generateSummary} disabled={isGeneratingSummary} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-xl text-sm disabled:opacity-50">
                <Sparkles size={16} />
                {isGeneratingSummary ? <Loader2 size={16} className="animate-spin" /> : "Generate with AI"}
              </button>
            </div>
            <textarea name="summary" value={formData.summary} onChange={handleChange} rows={5} placeholder="Write a short professional summary..." className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3" />
          </div>

          {/* Experience */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Experience</h3>
              <button onClick={() => addItem('experiences')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm">+ Add</button>
            </div>
            {formData.experiences.map((exp) => (
              <div key={exp.id} className="mb-6 p-5 bg-zinc-900 border border-zinc-700 rounded-2xl space-y-3">
                <input placeholder="Company Name" value={exp.company} onChange={(e) => handleArrayChange('experiences', exp.id, 'company', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
                <input placeholder="Job Role" value={exp.role} onChange={(e) => handleArrayChange('experiences', exp.id, 'role', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
                <input placeholder="Duration" value={exp.duration} onChange={(e) => handleArrayChange('experiences', exp.id, 'duration', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
                <div className="relative">
                  <textarea placeholder="Achievements..." value={exp.description} onChange={(e) => handleArrayChange('experiences', exp.id, 'description', e.target.value)} rows={4} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3" />
                  <button onClick={() => improveBullet(exp.id)} disabled={improvingId === exp.id} className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50">
                    {improvingId === exp.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Improve with AI
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Education</h3>
              <button onClick={() => addItem('education')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm">+ Add</button>
            </div>
            {formData.education.map((edu) => (
              <div key={edu.id} className="mb-6 p-5 bg-zinc-900 border border-zinc-700 rounded-2xl space-y-3">
                <input placeholder="School / University" value={edu.school} onChange={(e) => handleArrayChange('education', edu.id, 'school', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
                <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', edu.id, 'degree', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
                <input placeholder="Year (e.g. 2020-2024)" value={edu.year} onChange={(e) => handleArrayChange('education', edu.id, 'year', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Projects</h3>
              <button onClick={() => addItem('projects')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm">+ Add Project</button>
            </div>
            {formData.projects.map((project) => (
              <div key={project.id} className="mb-6 p-5 bg-zinc-900 border border-zinc-700 rounded-2xl space-y-3">
                <input placeholder="Project Title" value={project.title} onChange={(e) => handleArrayChange('projects', project.id, 'title', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
                <textarea placeholder="Project Description" value={project.description} onChange={(e) => handleArrayChange('projects', project.id, 'description', e.target.value)} rows={3} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3" />
                <input placeholder="Technologies (React, Node.js, etc.)" value={project.tech} onChange={(e) => handleArrayChange('projects', project.id, 'tech', e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2" />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python, Tailwind, Leadership..." rows={4} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3" />
          </div>
        </div>

        {/* Live Preview - FIXED */}
        <div className="flex-1 p-12 bg-zinc-900 overflow-auto">
          <div className={`max-w-2xl mx-auto min-h-[700px] rounded-2xl shadow-2xl p-10 transition-all ${selectedTemplate === 'modern' ? 'bg-gradient-to-br from-zinc-50 to-white' : selectedTemplate === 'creative' ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-white'}`}>
            <div className="text-center border-b pb-8 mb-8">
              <h1 className="text-4xl font-bold text-black">{formData.fullName || "Your Name"}</h1>
              <p className="text-xl text-zinc-600 mt-1">{formData.headline}</p>
            </div>

            {formData.summary && (
              <div className="mb-10">
                <h3 className="uppercase text-xs tracking-widest font-semibold mb-3 text-black">Summary</h3>
                <p className="leading-relaxed text-zinc-700">{formData.summary}</p>
              </div>
            )}

            {formData.experiences.length > 0 && (
              <div className="mb-10">
                <h3 className="uppercase text-xs tracking-widest font-semibold mb-4 text-black">Experience</h3>
                {formData.experiences.map((exp: any, i: number) => (
                  <div key={i} className="mb-6">
                    <div className="font-semibold text-black">{exp.role}</div>
                    <div className="text-zinc-600">{exp.company} • {exp.duration}</div>
                    {exp.description && <p className="mt-2 text-zinc-700">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {formData.education.length > 0 && (
              <div className="mb-10">
                <h3 className="uppercase text-xs tracking-widest font-semibold mb-4 text-black">Education</h3>
                {formData.education.map((edu: any, i: number) => (
                  <div key={i} className="mb-4">
                    <div className="font-semibold text-black">{edu.degree}</div>
                    <div className="text-zinc-600">{edu.school} • {edu.year}</div>
                  </div>
                ))}
              </div>
            )}

            {formData.projects.length > 0 && (
              <div className="mb-10">
                <h3 className="uppercase text-xs tracking-widest font-semibold mb-4 text-black">Projects</h3>
                {formData.projects.map((proj: any, i: number) => (
                  <div key={i} className="mb-6">
                    <div className="font-semibold text-black">{proj.title}</div>
                    <div className="text-zinc-600 text-sm">{proj.tech}</div>
                    {proj.description && <p className="mt-2 text-zinc-700">{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {formData.skills && (
              <div>
                <h3 className="uppercase text-xs tracking-widest font-semibold mb-3 text-black">Skills</h3>
                <p className="text-zinc-700">{formData.skills}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}