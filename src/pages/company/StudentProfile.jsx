import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudent, requestInterview } from "../../services/api";
import CompanyLayout from "./CompanyLayout";
import LevelBadge from "../../components/LevelBadge";
import DimBar from "../../components/DimBar";
import Icon from "../../components/Icon";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested]   = useState(false);

  useEffect(() => { getStudent(id).then(setStudent); }, [id]);

  const handleRequest = async () => {
    setRequesting(true);
    try {
      await requestInterview({ student_id: id, role_id: "general", message: "We'd love to connect!" });
      setRequested(true);
    } finally {
      setRequesting(false);
    }
  };

  if (!student) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-2 border-outline-variant border-t-secondary rounded-full animate-spin" />
        </div>
      </CompanyLayout>
    );
  }

  const dims = [
    { label: "Clarity",    value: student.clarity_avg    || student.grit_score },
    { label: "Persuasion", value: student.persuasion_avg || student.grit_score },
    { label: "Structure",  value: student.structure_avg  || student.grit_score },
    { label: "Confidence", value: student.confidence_avg || student.grit_score },
    { label: "Relevance",  value: student.relevance_avg  || student.grit_score },
  ];

  return (
    <CompanyLayout>
      <div className="max-w-[900px] mx-auto p-gutter">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-inter text-label-md">
          <Icon name="arrow_back" size={20} /> Back to candidates
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Left — profile card */}
          <div className="space-y-4">
            <div className="card p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center font-bold text-primary text-2xl mb-4">
                {student.name?.split(" ").map((n) => n[0]).join("")}
              </div>
              <h1 className="font-hanken font-bold text-primary text-headline-md">{student.name}</h1>
              <p className="font-inter text-body-md text-on-surface-variant mt-1">{student.college}</p>
              <p className="font-inter text-label-md text-on-surface-variant">{student.city}</p>
              <div className="flex justify-center mt-3">
                <LevelBadge level={student.level} />
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant flex justify-around">
                <div className="text-center">
                  <p className="font-hanken font-bold text-primary text-headline-md">{Math.round(student.grit_score)}</p>
                  <p className="font-inter text-label-sm text-on-surface-variant">Grit Score</p>
                </div>
                <div className="text-center">
                  <p className="font-hanken font-bold text-primary text-headline-md">{student.streak || 0}🔥</p>
                  <p className="font-inter text-label-sm text-on-surface-variant">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="font-hanken font-bold text-primary text-headline-md">
                    {student.submissions_count || 0}
                  </p>
                  <p className="font-inter text-label-sm text-on-surface-variant">Proofs Done</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            {requested ? (
              <div className="card p-4 text-center">
                <Icon name="check_circle" fill size={32} className="text-secondary mx-auto mb-2" />
                <p className="font-hanken font-semibold text-primary">Interview Requested!</p>
                <p className="font-inter text-label-md text-on-surface-variant mt-1">We'll notify the candidate.</p>
              </div>
            ) : (
              <button onClick={handleRequest} disabled={requesting} className="btn-primary w-full py-4 text-body-md">
                {requesting
                  ? <span className="w-5 h-5 border-2 border-on-secondary/40 border-t-on-secondary rounded-full animate-spin" />
                  : <><Icon name="handshake" /> Request Interview</>}
              </button>
            )}

            <a href={`/candidate/${student.username}`} target="_blank" rel="noopener noreferrer"
              className="btn-ghost w-full py-3 text-label-md flex items-center justify-center gap-2 border border-outline-variant rounded-lg">
              <Icon name="open_in_new" size={18} /> Evidence Locker
            </a>
          </div>

          {/* Right — skills + sessions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Grit breakdown */}
            <div className="card p-6">
              <h2 className="font-hanken font-semibold text-headline-md text-primary mb-4">Grit Score Breakdown</h2>
              <div className="space-y-3">
                {dims.map((d) => <DimBar key={d.label} {...d} />)}
              </div>
            </div>

            {/* Recent sessions */}
            {(student.recent_sessions || []).length > 0 && (
              <div className="card p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant">
                  <h2 className="font-hanken font-semibold text-headline-md text-on-surface">Recent Sessions</h2>
                </div>
                <div className="divide-y divide-outline-variant">
                  {student.recent_sessions.slice(0, 6).map((s) => (
                    <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center shrink-0">
                        <Icon name="mic" size={16} className="text-on-secondary-container" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter font-semibold text-on-surface text-body-md">
                          {s.task_id?.replace("pp-", "PP ")}
                        </p>
                        {s.highlight && (
                          <p className="font-inter text-label-md text-on-surface-variant truncate">{s.highlight}</p>
                        )}
                      </div>
                      <span className="badge-teal shrink-0">{Math.round(s.grit_score)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
