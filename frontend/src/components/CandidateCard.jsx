import React from 'react';
import { Mail, Briefcase, FileText, Trash2, Calendar } from 'lucide-react';

const CandidateCard = ({ candidate, onDelete }) => {
  const { _id, name, email, skills, experience, bio, resumeUrl, createdAt } = candidate;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glow-card rounded-2xl p-6 flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Absolute top glowing line on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-500 to-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-400 transition-colors duration-300">
              {name}
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </span>
          </div>

          <span className="bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Briefcase className="h-3 w-3 text-brand-400" />
            {experience} yrs exp
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-5 line-clamp-3 leading-relaxed">
          {bio || "No biography provided."}
        </p>

        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Key Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-slate-850/80 hover:bg-brand-950/40 text-slate-300 hover:text-brand-300 text-xs px-2.5 py-1 rounded-lg border border-slate-800 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center mt-auto">
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Added {formattedDate}
        </span>

        <div className="flex items-center gap-2">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              title="View Resume"
            >
              <FileText className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={() => onDelete(_id)}
            className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/50 text-red-400 hover:text-red-300 border border-red-900/30 transition-colors"
            title="Delete Candidate"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
