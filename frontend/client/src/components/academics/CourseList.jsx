const CourseList = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <p className="font-body text-slate text-sm italic mt-3">
        Nothing is add in this department.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-parchment/60 border border-ink/10 rounded-lg p-4"
        >
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h4 className="font-body font-semibold text-ink">{course.courseName}</h4>
            <span className="font-body text-xs bg-gold/20 text-gold-dark px-2 py-1 rounded-full">
              {course.duration}
            </span>
          </div>
          {course.eligibility && (
            <p className="font-body text-sm text-slate mt-1">
              <span className="font-medium">Eligibility:</span> {course.eligibility}
            </p>
          )}
          {course.description && (
            <p className="font-body text-sm text-charcoal mt-2">{course.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseList;