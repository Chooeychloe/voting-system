import { useState } from "react";

function ProjectCard({ project, selected, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false);
  const members = Array.isArray(project.members)
    ? project.members
    : typeof project.members === "string"
      ? project.members.split(/\r?\n/).map((name) => name.trim()).filter(Boolean)
      : [];
  return (
    <article
      className={`project-card flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white text-left transition duration-200 ${
        selected
          ? "border-blue-500 ring-4 ring-blue-100"
          : "border-slate-200 hover:border-blue-200"
      }`}
    >
      {/* Project Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 sm:h-56">
        {project.image && !imageFailed ? (
          <img
            src={project.image}
            alt={`${project.title} project`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-slate-100 text-blue-700" aria-label="Project image unavailable">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-10 w-10" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5 8.25 11l3.75 4 2.25-2.5L21 20H3v-3.5ZM7.5 7.5h.01M3 4.5h18v16H3v-16Z" />
            </svg>
            <span className="text-sm font-medium">Project preview</span>
          </div>
        )}

        {selected && (
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-md">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
       
        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
          {project.title}
        </h3>

        {project.description && <p className="mt-2 text-sm leading-6 text-slate-500">{project.description}</p>}

        {members.length > 0 && (
          <div className="mt-5 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Group members</p>
            <ul className="mt-2 grid min-w-0 grid-cols-1 gap-1.5">
              {members.map((member, index) => (
                <li key={`${member}-${index}`} className="flex min-w-0 items-start gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-medium leading-5 text-slate-700 ring-1 ring-slate-100">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span className="min-w-0 break-words">{member}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelect(project)}
          aria-pressed={selected}
          className={`mt-6 flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${selected ? "bg-blue-50 text-blue-800 ring-1 ring-blue-200" : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-800"}`}
        >
          {selected ? (
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42.005l-3.8-3.75a1 1 0 0 1 1.406-1.423l3.09 3.049 6.494-6.55a1 1 0 0 1 1.424-.005Z" clipRule="evenodd" /></svg>
          ) : (
            <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-current" />
          )}
          {selected ? "Selected for your vote" : "Choose this project"}
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;
