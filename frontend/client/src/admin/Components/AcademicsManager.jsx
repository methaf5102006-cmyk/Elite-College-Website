import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../../services/departmentService';
import {
  getShortCourses,
  createShortCourse,
  updateShortCourse,
  deleteShortCourse
} from '../../services/shortCourseService';
import ImageUploadField from '../../components/common/ImageUploadField';

const emptyDept = {
  name: '', slug: '', shortName: '', icon: 'FiBook', category: 'undergraduate',
  tagline: '', description: '', duration: '', affiliation: '', hod: '',
  objectives: '', coreAreas: '', whyChoose: '', careers: '', furtherPathways: '', eligibility: '',
  // NEW fields
  meritCriteria: '', specializationNote: '', specializationTracks: '', courses: '', image: ''
};

const emptyCourse = {
  title: '', slug: '', icon: 'FiCode', duration: '', description: '', topics: ''
};

// helper: textarea (newline separated) <-> array
const toArray = (str) => str.split('\n').map((s) => s.trim()).filter(Boolean);
const toText = (arr) => (arr || []).join('\n');

const AcademicsManager = () => {
  const [tab, setTab] = useState('departments'); // 'departments' | 'courses'

  // Departments state
  const [departments, setDepartments] = useState([]);
  const [deptForm, setDeptForm] = useState(emptyDept);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [deptSubmitting, setDeptSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Drag-and-drop state (which index is currently being dragged)
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Short Courses state
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseSubmitting, setCourseSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [deptData, courseData] = await Promise.all([getDepartments(), getShortCourses()]);
      setDepartments(deptData);
      setCourses(courseData);
    } catch (err) {
      toast.error('Failed to load academics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ---------- Department handlers ----------
  const resetDeptForm = () => {
    setDeptForm(emptyDept);
    setEditingDeptId(null);
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      setDeptSubmitting(true);
      const payload = {
        ...deptForm,
        objectives: toArray(deptForm.objectives),
        coreAreas: toArray(deptForm.coreAreas),
        whyChoose: toArray(deptForm.whyChoose),
        careers: toArray(deptForm.careers),
        furtherPathways: toArray(deptForm.furtherPathways),
        eligibility: toArray(deptForm.eligibility),
        // NEW
        specializationTracks: toArray(deptForm.specializationTracks),
        courses: toArray(deptForm.courses),
      };
      if (editingDeptId) {
        await updateDepartment(editingDeptId, payload);
        toast.success('Department updated');
      } else {
        await createDepartment(payload);
        toast.success('Department added');
      }
      resetDeptForm();
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setDeptSubmitting(false);
    }
  };

  const handleDeptEdit = (dept) => {
    setEditingDeptId(dept._id);
    setDeptForm({
      name: dept.name || '', slug: dept.slug || '', shortName: dept.shortName || '',
      icon: dept.icon || 'FiBook', category: dept.category || 'undergraduate',
      tagline: dept.tagline || '', description: dept.description || '', duration: dept.duration || '',
      affiliation: dept.affiliation || '', hod: dept.hod || '',
      objectives: toText(dept.objectives), coreAreas: toText(dept.coreAreas),
      whyChoose: toText(dept.whyChoose), careers: toText(dept.careers),
      furtherPathways: toText(dept.furtherPathways), eligibility: toText(dept.eligibility),
      // NEW
      meritCriteria: dept.meritCriteria || '',
      specializationNote: dept.specializationNote || '',
      specializationTracks: toText(dept.specializationTracks),
      courses: toText(dept.courses),
      image: dept.image || '',
    });
    window.scrollTo({ top: document.getElementById('dept-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDeptDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await deleteDepartment(id);
      toast.success('Department deleted');
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // ---------- Drag-and-drop reorder handlers ----------
  const handleDragStart = (index) => (e) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index) => (e) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // required to allow dropping
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDrop = (dropIndex) => async (e) => {
    e.preventDefault();
    const dragIndex = dragIndexRef.current;
    setDragOverIndex(null);
    dragIndexRef.current = null;

    if (dragIndex === null || dragIndex === dropIndex) return;

    const original = departments;
    const reordered = [...departments];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    setDepartments(reordered); // update UI immediately

    // Only departments whose index actually changed need a backend update
    const changed = reordered
      .map((dept, i) => ({ dept, i }))
      .filter(({ dept, i }) => original[i]?._id !== dept._id);

    // Persist new order to backend — send updates ONE AT A TIME (not Promise.all)
    // to avoid tripping the server's rate limiter (429 Too Many Requests)
    try {
      setReordering(true);
      for (const { dept, i } of changed) {
        await updateDepartment(dept._id, { order: i });
      }
      toast.success('Order updated');
    } catch (err) {
      toast.error('Failed to save new order');
      fetchAll(); // revert to server state if save failed
    } finally {
      setReordering(false);
    }
  };

  // ---------- Short Course handlers ----------
  const resetCourseForm = () => {
    setCourseForm(emptyCourse);
    setEditingCourseId(null);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      setCourseSubmitting(true);
      const payload = { ...courseForm, topics: toArray(courseForm.topics) };
      if (editingCourseId) {
        await updateShortCourse(editingCourseId, payload);
        toast.success('Course updated');
      } else {
        await createShortCourse(payload);
        toast.success('Course added');
      }
      resetCourseForm();
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setCourseSubmitting(false);
    }
  };

  const handleCourseEdit = (course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title || '', slug: course.slug || '', icon: course.icon || 'FiCode',
      duration: course.duration || '', description: course.description || '',
      topics: toText(course.topics),
    });
    window.scrollTo({ top: document.getElementById('course-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleCourseDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteShortCourse(id);
      toast.success('Course deleted');
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const inputClass = "w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40";
  const labelClass = "font-body text-sm text-charcoal block mb-1";

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Academics Management</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('departments')}
          className={`px-4 py-2 rounded-lg text-sm font-body transition ${tab === 'departments' ? 'bg-ink text-parchment' : 'bg-white border border-ink/20 text-ink'}`}
        >
          Departments (Undergrad / Intermediate)
        </button>
        <button
          onClick={() => setTab('courses')}
          className={`px-4 py-2 rounded-lg text-sm font-body transition ${tab === 'courses' ? 'bg-ink text-parchment' : 'bg-white border border-ink/20 text-ink'}`}
        >
          Computer Courses
        </button>
      </div>

      {/* ---------------- DEPARTMENTS TAB ---------------- */}
      {tab === 'departments' && (
        <>
          <form id="dept-form" onSubmit={handleDeptSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input type="text" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Slug (unique, e.g. computer-science)</label>
                <input type="text" value={deptForm.slug} onChange={(e) => setDeptForm({ ...deptForm, slug: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Short Name</label>
                <input type="text" value={deptForm.shortName} onChange={(e) => setDeptForm({ ...deptForm, shortName: e.target.value })} required className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select value={deptForm.category} onChange={(e) => setDeptForm({ ...deptForm, category: e.target.value })} required className={inputClass}>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Icon (react-icons/fi name)</label>
                <input type="text" value={deptForm.icon} onChange={(e) => setDeptForm({ ...deptForm, icon: e.target.value })} placeholder="e.g. FiCpu" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <input type="text" value={deptForm.duration} onChange={(e) => setDeptForm({ ...deptForm, duration: e.target.value })} placeholder="e.g. 4 Years" className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Affiliation</label>
                <input type="text" value={deptForm.affiliation} onChange={(e) => setDeptForm({ ...deptForm, affiliation: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>HOD</label>
                <input type="text" value={deptForm.hod} onChange={(e) => setDeptForm({ ...deptForm, hod: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Merit Criteria (e.g. 50%)</label>
                <input type="text" value={deptForm.meritCriteria} onChange={(e) => setDeptForm({ ...deptForm, meritCriteria: e.target.value })} placeholder="e.g. 50%" className={inputClass} />
              </div>
            </div>

            <ImageUploadField
              label="Department Image (shown on homepage card)"
              value={deptForm.image}
              onChange={(url) => setDeptForm({ ...deptForm, image: url })}
            />

            <div>
              <label className={labelClass}>Tagline</label>
              <input type="text" value={deptForm.tagline} onChange={(e) => setDeptForm({ ...deptForm, tagline: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} rows={3} className={inputClass} />
            </div>

            {/* Specialization tracks — e.g. BS CS: choose a track from 5th semester */}
            <div className="border border-gold/30 bg-gold/5 rounded-lg p-4 space-y-3">
              <p className="font-body text-xs text-ink/70">
                Use this if the program splits into specializations after some semesters (e.g. BS CS → AI / Data Science / IT / CS / Software Engineering from 5th semester). Leave empty if not applicable.
              </p>
              <div>
                <label className={labelClass}>Specialization Note</label>
                <input
                  type="text"
                  value={deptForm.specializationNote}
                  onChange={(e) => setDeptForm({ ...deptForm, specializationNote: e.target.value })}
                  placeholder="e.g. First 4 semesters are the same for all students; choose a track from the 5th semester."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Specialization Tracks (one per line)</label>
                <textarea
                  value={deptForm.specializationTracks}
                  onChange={(e) => setDeptForm({ ...deptForm, specializationTracks: e.target.value })}
                  rows={3}
                  placeholder={'Artificial Intelligence (AI)\nData Science\nInformation Technology (IT)\nComputer Science (CS)\nSoftware Engineering (SE)'}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Objectives (one per line)</label>
                <textarea value={deptForm.objectives} onChange={(e) => setDeptForm({ ...deptForm, objectives: e.target.value })} rows={3} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Core Areas (one per line)</label>
                <textarea value={deptForm.coreAreas} onChange={(e) => setDeptForm({ ...deptForm, coreAreas: e.target.value })} rows={3} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Why Choose (one per line)</label>
                <textarea value={deptForm.whyChoose} onChange={(e) => setDeptForm({ ...deptForm, whyChoose: e.target.value })} rows={3} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Careers (one per line)</label>
                <textarea value={deptForm.careers} onChange={(e) => setDeptForm({ ...deptForm, careers: e.target.value })} rows={3} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Further Pathways (one per line)</label>
                <textarea value={deptForm.furtherPathways} onChange={(e) => setDeptForm({ ...deptForm, furtherPathways: e.target.value })} rows={3} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Eligibility (one per line)</label>
                <textarea value={deptForm.eligibility} onChange={(e) => setDeptForm({ ...deptForm, eligibility: e.target.value })} rows={3} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Courses (one per line) — also used for sub-courses, e.g. ADP: English, Psychology, CS, Commerce</label>
                <textarea value={deptForm.courses} onChange={(e) => setDeptForm({ ...deptForm, courses: e.target.value })} rows={3} className={inputClass} />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={deptSubmitting} className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60">
                {deptSubmitting ? 'Saving...' : editingDeptId ? 'Update Department' : 'Add Department'}
              </button>
              {editingDeptId && (
                <button type="button" onClick={resetDeptForm} className="bg-white border border-ink/20 text-ink font-body px-6 py-2.5 rounded-lg hover:bg-parchment transition">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {loading ? (
            <p className="font-body text-slate">Loading departments...</p>
          ) : departments.length === 0 ? (
            <p className="font-body text-slate">No departments yet.</p>
          ) : (
            <>
              <p className="font-body text-xs text-slate/70 mb-3">
                Drag a card by its ⠿ handle to reorder departments. {reordering && '(saving order...)'}
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {departments.map((dept, index) => (
                  <div
                    key={dept._id}
                    draggable
                    onDragStart={handleDragStart(index)}
                    onDragEnter={handleDragEnter(index)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white border rounded-lg p-4 cursor-grab active:cursor-grabbing transition ${
                      dragOverIndex === index ? 'border-gold border-2 bg-gold/5' : 'border-ink/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display text-base text-ink">{dept.name}</h3>
                      <span className="text-ink/30 text-sm select-none" title="Drag to reorder">⠿</span>
                    </div>
                    <p className="font-body text-xs text-slate mb-1">{dept.category}</p>
                    <p className="font-body text-xs text-slate/70 mb-3">{dept.duration}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleDeptEdit(dept)} className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition">Edit</button>
                      <button onClick={() => handleDeptDelete(dept._id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-body px-3 py-1.5 rounded-md transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ---------------- COMPUTER COURSES TAB (ShortCourse model) ---------------- */}
      {tab === 'courses' && (
        <>
          <form id="course-form" onSubmit={handleCourseSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Title</label>
                <input type="text" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Slug (unique)</label>
                <input type="text" value={courseForm.slug} onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Icon (react-icons/fi name)</label>
                <input type="text" value={courseForm.icon} onChange={(e) => setCourseForm({ ...courseForm, icon: e.target.value })} placeholder="e.g. FiCode" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Duration</label>
              <input type="text" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} required placeholder="e.g. 3 Months" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows={3} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Topics (one per line)</label>
              <textarea value={courseForm.topics} onChange={(e) => setCourseForm({ ...courseForm, topics: e.target.value })} rows={3} className={inputClass} />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={courseSubmitting} className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60">
                {courseSubmitting ? 'Saving...' : editingCourseId ? 'Update Course' : 'Add Course'}
              </button>
              {editingCourseId && (
                <button type="button" onClick={resetCourseForm} className="bg-white border border-ink/20 text-ink font-body px-6 py-2.5 rounded-lg hover:bg-parchment transition">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {loading ? (
            <p className="font-body text-slate">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="font-body text-slate">No courses yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course._id} className="bg-white border border-ink/10 rounded-lg p-4">
                  <h3 className="font-display text-base text-ink mb-1">{course.title}</h3>
                  <p className="font-body text-xs text-slate mb-3">{course.duration}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleCourseEdit(course)} className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition">Edit</button>
                    <button onClick={() => handleCourseDelete(course._id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-body px-3 py-1.5 rounded-md transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AcademicsManager;