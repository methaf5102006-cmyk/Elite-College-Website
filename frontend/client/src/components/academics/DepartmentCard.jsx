import { useState } from 'react';
import CourseList from './CourseList';

const DepartmentCard = ({ department, courses }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-6 text-left"
      >
        <div>
          <h3 className="font-display text-xl text-ink">{department.name}</h3>
          {department.hod && (
            <p className="font-body text-sm text-slate mt-1">HOD: {department.hod}</p>
          )}
        </div>
        <span className="font-display text-gold text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="px-6 pb-6">
          {department.description && (
            <p className="font-body text-charcoal text-sm mb-2">{department.description}</p>
          )}
          <CourseList courses={courses} />
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;