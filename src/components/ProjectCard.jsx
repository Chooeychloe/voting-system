function ProjectCard({ project, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className={`w-full overflow-hidden rounded-xl border-2 bg-white text-left transition ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`}
    >
      {/* Project Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            onError={(event) => {
              event.currentTarget.src = "/projects/placeholder.jpg";
            }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image available
          </div>
        )}

        {selected && (
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-md">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="p-6">
        <p className="text-sm font-medium text-blue-600">
          {project.group}
        </p>

        <h3 className="mt-1 text-xl font-bold text-gray-900">
          {project.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {project.description}
        </p>

        <div className="mt-5 flex items-center gap-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              selected
                ? "border-blue-600 bg-blue-600"
                : "border-gray-300"
            }`}
          >
            {selected && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>

          <span
            className={`text-sm font-medium ${
              selected ? "text-blue-700" : "text-gray-500"
            }`}
          >
            {selected ? "Selected" : "Select this project"}
          </span>
        </div>
      </div>
    </button>
  );
}

export default ProjectCard;