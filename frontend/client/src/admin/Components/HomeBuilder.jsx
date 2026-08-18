import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from '../../services/sectionService';
import ImageUploadField from '../../components/common/ImageUploadField';
import MultiImageUploadField from '../../components/common/MultiImageUploadField';

const TYPE_LABELS = {
  hero: 'Hero Banner',
  featureHighlights: 'Feature Highlights (cards)',
  directorMessage: "Director's Message",
  whyUs: 'Why Us (checklist)',
  achievements: 'Achievements',
  quickLinks: 'Quick Links',
  ourDepartments: 'Our Departments (auto — from Departments)',
  noticesSlider: 'Notices Slider (auto — from Notices)',
  statsCounter: 'Stats Counter (auto — from Notices/Events)',
  custom: 'Custom Block (free-form)',
};

const AUTO_TYPES = ['ourDepartments', 'noticesSlider', 'statsCounter'];

const EDITABLE_TYPES = Object.keys(TYPE_LABELS).filter((t) => !AUTO_TYPES.includes(t));

// ---------- line-based helpers ----------
const linesToArray = (str) => str.split('\n').map((s) => s.trim()).filter(Boolean);
const arrayToLines = (arr) => (arr || []).join('\n');

const linesToObjects = (str, keys) =>
  str
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const obj = {};
      keys.forEach((k, i) => (obj[k] = parts[i] || ''));
      return obj;
    });

const objectsToLines = (arr, keys) =>
  (arr || []).map((obj) => keys.map((k) => obj[k] || '').join(' | ')).join('\n');

// ---------- default content per type ----------
const defaultContentFor = (type) => {
  switch (type) {
    case 'hero':
      return { eyebrow: '', heading: '', description: '', images: [], buttonsText: '' };
    case 'featureHighlights':
      return { eyebrow: '', heading: '', items: [] };
    case 'directorMessage':
      return { eyebrow: '', message: '', image: '', name: '', designation: '', linkLabel: '', linkUrl: '' };
    case 'whyUs':
      return { eyebrow: '', heading: '', reasonsText: '', image: '' };
    case 'achievements':
      return {
        eyebrow: '', heading: '', description: '', imageLeft: '', imageRight: '',
        highlightTitle: '', highlightSubtitle: '', statsText: '',
      };
    case 'quickLinks':
      return { itemsText: '' };
    case 'custom':
      return { heading: '', text: '', image: '', buttonLabel: '', buttonUrl: '' };
    default:
      return {};
  }
};

// ---------- convert stored `content` -> flat editable form fields ----------
const contentToForm = (type, content = {}) => {
  switch (type) {
    case 'hero':
      return {
        eyebrow: content.eyebrow || '',
        heading: content.heading || '',
        description: content.description || '',
        images: content.images || (content.image ? [content.image] : []), // backward-compatible with old single-image data
        buttonsText: objectsToLines(content.buttons, ['label', 'link']),
      };
    case 'featureHighlights':
      return {
        eyebrow: content.eyebrow || '',
        heading: content.heading || '',
        items: content.items || [],
      };
    case 'directorMessage':
      return {
        eyebrow: content.eyebrow || '',
        message: content.message || '',
        image: content.image || '',
        name: content.name || '',
        designation: content.designation || '',
        linkLabel: content.linkLabel || '',
        linkUrl: content.linkUrl || '',
      };
    case 'whyUs':
      return {
        eyebrow: content.eyebrow || '',
        heading: content.heading || '',
        reasonsText: arrayToLines(content.reasons),
        image: content.image || '',
      };
    case 'achievements':
      return {
        eyebrow: content.eyebrow || '',
        heading: content.heading || '',
        description: content.description || '',
        imageLeft: content.imageLeft || '',
        imageRight: content.imageRight || '',
        highlightTitle: content.highlight?.title || '',
        highlightSubtitle: content.highlight?.subtitle || '',
        statsText: objectsToLines(content.stats, ['label', 'value']),
      };
    case 'quickLinks':
      return { itemsText: objectsToLines(content.items, ['label', 'description', 'icon', 'path']) };
    case 'custom':
      return {
        heading: content.heading || '',
        text: content.text || '',
        image: content.image || '',
        buttonLabel: content.buttonLabel || '',
        buttonUrl: content.buttonUrl || '',
      };
    default:
      return {};
  }
};

// ---------- convert flat form fields -> stored `content` shape ----------
const formToContent = (type, form) => {
  switch (type) {
    case 'hero':
      return {
        eyebrow: form.eyebrow,
        heading: form.heading,
        description: form.description,
        images: form.images || [],
        buttons: linesToObjects(form.buttonsText, ['label', 'link']),
      };
    case 'featureHighlights':
      return {
        eyebrow: form.eyebrow,
        heading: form.heading,
        items: form.items || [],
      };
    case 'directorMessage':
      return {
        eyebrow: form.eyebrow,
        message: form.message,
        image: form.image,
        name: form.name,
        designation: form.designation,
        linkLabel: form.linkLabel,
        linkUrl: form.linkUrl,
      };
    case 'whyUs':
      return {
        eyebrow: form.eyebrow,
        heading: form.heading,
        reasons: linesToArray(form.reasonsText),
        image: form.image,
      };
    case 'achievements':
      return {
        eyebrow: form.eyebrow,
        heading: form.heading,
        description: form.description,
        imageLeft: form.imageLeft,
        imageRight: form.imageRight,
        highlight: form.highlightTitle
          ? { title: form.highlightTitle, subtitle: form.highlightSubtitle }
          : null,
        stats: linesToObjects(form.statsText, ['label', 'value']),
      };
    case 'quickLinks':
      return { items: linesToObjects(form.itemsText, ['label', 'description', 'icon', 'path']) };
    case 'custom':
      return {
        heading: form.heading,
        text: form.text,
        image: form.image,
        buttonLabel: form.buttonLabel,
        buttonUrl: form.buttonUrl,
      };
    default:
      return {};
  }
};

const inputClass = "w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "font-body text-sm text-charcoal block mb-1";
const hintClass = "font-body text-xs text-slate/70 mb-1";

// ---------- form fields per type ----------
const FormFields = ({ type, form, setForm }) => {
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setImage = (key) => (url) => setForm({ ...form, [key]: url });

  if (type === 'hero') {
    return (
      <>
        <div><label className={labelClass}>Eyebrow (small text above heading)</label><input className={inputClass} value={form.eyebrow} onChange={set('eyebrow')} /></div>
        <div><label className={labelClass}>Heading</label><input className={inputClass} value={form.heading} onChange={set('heading')} /></div>
        <div><label className={labelClass}>Description</label><textarea rows={3} className={inputClass} value={form.description} onChange={set('description')} /></div>
        <MultiImageUploadField
          label="Background Images (slideshow)"
          value={form.images}
          onChange={(images) => setForm({ ...form, images })}
        />
        <div>
          <label className={labelClass}>Buttons</label>
          <p className={hintClass}>Format: Label | Link (one per line, e.g. "Apply for Admission | /admissions")</p>
          <textarea rows={3} className={inputClass} value={form.buttonsText} onChange={set('buttonsText')} />
        </div>
      </>
    );
  }

  if (type === 'featureHighlights') {
    const items = form.items || [];

    const updateItem = (index, key, val) => {
      const updated = [...items];
      updated[index] = { ...updated[index], [key]: val };
      setForm({ ...form, items: updated });
    };

    const addItem = () => {
      setForm({ ...form, items: [...items, { title: '', description: '', image: '', icon: '', link: '' }] });
    };

    const removeItem = (index) => {
      setForm({ ...form, items: items.filter((_, i) => i !== index) });
    };

    // Move a card up (direction -1) or down (direction 1) within the items array
    const moveItem = (index, direction) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= items.length) return;
      const updated = [...items];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      setForm({ ...form, items: updated });
    };

    return (
      <div>
        <div className="mb-4">
          <label className={labelClass}>Eyebrow (small text above heading, optional)</label>
          <input
            className={inputClass}
            value={form.eyebrow}
            onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Heading</label>
          <input
            className={inputClass}
            placeholder="e.g. Our Projects"
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />
        </div>

        <label className={labelClass}>Cards</label>
        <p className={hintClass}>Har card ke liye image, title, description aur (optional) link add karein. Use ▲▼ to change the order cards appear on the site.</p>

        <div className="space-y-4 mt-2">
          {items.map((item, index) => (
            <div key={index} className="border border-ink/10 rounded-lg p-4 space-y-3 relative">
              <div className="absolute top-3 right-3 flex items-center gap-3">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs leading-none"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs leading-none"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-ink/50 hover:text-ink underline"
                >
                  Remove
                </button>
              </div>

              <p className="font-body text-xs text-slate/50">Card {index + 1}</p>

              <ImageUploadField
                label="Image"
                value={item.image}
                onChange={(url) => updateItem(index, 'image', url)}
              />

              <div>
                <label className={labelClass}>Title</label>
                <input
                  className={inputClass}
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Description (optional)</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Link (optional)</label>
                <input
                  className={inputClass}
                  placeholder="e.g. /departments/boys-campus"
                  value={item.link}
                  onChange={(e) => updateItem(index, 'link', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 bg-ink/5 hover:bg-ink/10 text-ink text-sm font-body px-4 py-2 rounded-lg transition"
        >
          + Add Card
        </button>
      </div>
    );
  }

  if (type === 'directorMessage') {
    return (
      <>
        <div><label className={labelClass}>Eyebrow</label><input className={inputClass} value={form.eyebrow} onChange={set('eyebrow')} /></div>
        <div><label className={labelClass}>Message / Quote</label><textarea rows={4} className={inputClass} value={form.message} onChange={set('message')} /></div>
        <ImageUploadField label="Photo" value={form.image} onChange={setImage('image')} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Name</label><input className={inputClass} value={form.name} onChange={set('name')} /></div>
          <div><label className={labelClass}>Designation</label><input className={inputClass} value={form.designation} onChange={set('designation')} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Link Button Label (optional)</label><input className={inputClass} value={form.linkLabel} onChange={set('linkLabel')} /></div>
          <div><label className={labelClass}>Link URL (optional)</label><input className={inputClass} value={form.linkUrl} onChange={set('linkUrl')} /></div>
        </div>
      </>
    );
  }

  if (type === 'whyUs') {
    return (
      <>
        <div><label className={labelClass}>Eyebrow</label><input className={inputClass} value={form.eyebrow} onChange={set('eyebrow')} /></div>
        <div><label className={labelClass}>Heading</label><input className={inputClass} value={form.heading} onChange={set('heading')} /></div>
        <div>
          <label className={labelClass}>Reasons</label>
          <p className={hintClass}>One per line</p>
          <textarea rows={5} className={inputClass} value={form.reasonsText} onChange={set('reasonsText')} />
        </div>
        <ImageUploadField label="Image" value={form.image} onChange={setImage('image')} />
      </>
    );
  }

  if (type === 'achievements') {
    return (
      <>
        <div><label className={labelClass}>Eyebrow</label><input className={inputClass} value={form.eyebrow} onChange={set('eyebrow')} /></div>
        <div><label className={labelClass}>Heading</label><input className={inputClass} value={form.heading} onChange={set('heading')} /></div>
        <div><label className={labelClass}>Description</label><textarea rows={3} className={inputClass} value={form.description} onChange={set('description')} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUploadField label="Left Image" value={form.imageLeft} onChange={setImage('imageLeft')} />
          <ImageUploadField label="Right Image" value={form.imageRight} onChange={setImage('imageRight')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Highlight Title (optional)</label><input className={inputClass} value={form.highlightTitle} onChange={set('highlightTitle')} placeholder="e.g. Arifa Imran — 3rd Position" /></div>
          <div><label className={labelClass}>Highlight Subtitle (optional)</label><input className={inputClass} value={form.highlightSubtitle} onChange={set('highlightSubtitle')} /></div>
        </div>
        <div>
          <label className={labelClass}>Stats</label>
          <p className={hintClass}>Format: Label | Value (one per line, e.g. "Graduates | 200+")</p>
          <textarea rows={4} className={inputClass} value={form.statsText} onChange={set('statsText')} />
        </div>
      </>
    );
  }

  if (type === 'quickLinks') {
    return (
      <div>
        <label className={labelClass}>Links</label>
        <p className={hintClass}>Format: Label | Description | Icon | Path (one per line, e.g. "Academics | Departments & courses | FiBookOpen | /academics")</p>
        <textarea rows={5} className={inputClass} value={form.itemsText} onChange={set('itemsText')} />
      </div>
    );
  }

  if (type === 'custom') {
    return (
      <>
        <div><label className={labelClass}>Heading</label><input className={inputClass} value={form.heading} onChange={set('heading')} /></div>
        <div><label className={labelClass}>Text</label><textarea rows={4} className={inputClass} value={form.text} onChange={set('text')} /></div>
        <ImageUploadField label="Image (optional)" value={form.image} onChange={setImage('image')} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Button Label (optional)</label><input className={inputClass} value={form.buttonLabel} onChange={set('buttonLabel')} /></div>
          <div><label className={labelClass}>Button URL (optional)</label><input className={inputClass} value={form.buttonUrl} onChange={set('buttonUrl')} /></div>
        </div>
      </>
    );
  }

  return null;
};

const HomeBuilder = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedType, setSelectedType] = useState('hero');
  const [form, setForm] = useState(defaultContentFor('hero'));
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSections(true); // all=true, includes inactive
      setSections(data);
    } catch (err) {
      toast.error('Failed to load home sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = (type = 'hero') => {
    setSelectedType(type);
    setForm(defaultContentFor(type));
    setEditingId(null);
  };

  const handleTypeChange = (e) => {
    resetForm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const content = formToContent(selectedType, form);
      if (editingId) {
        await updateSection(editingId, { type: selectedType, content });
        toast.success('Section updated');
      } else {
        await createSection({ type: selectedType, content, order: sections.length });
        toast.success('Section added');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (section) => {
    setSelectedType(section.type);
    setForm(contentToForm(section.type, section.content));
    setEditingId(section._id);
    window.scrollTo({ top: document.getElementById('section-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await deleteSection(id);
      toast.success('Section deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleToggleActive = async (section) => {
    try {
      await updateSection(section._id, { isActive: !section.isActive });
      fetchData();
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const move = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setSections(reordered);
    try {
      await reorderSections(reordered.map((s) => s._id));
    } catch (err) {
      toast.error('Failed to reorder');
      fetchData();
    }
  };

  const isEditableType = (type) => !AUTO_TYPES.includes(type);

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Home Page Builder</h2>
      <p className="font-body text-sm text-slate mb-6">
        Add, edit, reorder, or hide sections on the home page. "Auto" sections (Departments, Notices, Stats) pull their content automatically from their own modules.
      </p>

      {/* ---------- Add / Edit Form ---------- */}
      <form id="section-form" onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <h3 className="font-display text-lg text-ink">{editingId ? 'Edit Section' : 'Add New Section'}</h3>

        <div>
          <label className={labelClass}>Section Type</label>
          <select value={selectedType} onChange={handleTypeChange} disabled={!!editingId} className={inputClass}>
            {EDITABLE_TYPES.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <FormFields type={selectedType} form={form} setForm={setForm} />

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60">
            {submitting ? 'Saving...' : editingId ? 'Update Section' : 'Add Section'}
          </button>
          {editingId && (
            <button type="button" onClick={() => resetForm()} className="bg-white border border-ink/20 text-ink font-body px-6 py-2.5 rounded-lg hover:bg-parchment transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---------- Also allow adding "auto" sections (no form needed) ---------- */}
      <div className="bg-white border border-ink/10 rounded-xl p-6 mb-8">
        <h3 className="font-display text-lg text-ink mb-3">Add Auto Section</h3>
        <p className="font-body text-xs text-slate/70 mb-3">These sections show content automatically — no form needed.</p>
        <div className="flex flex-wrap gap-2">
          {AUTO_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={async () => {
                try {
                  await createSection({ type: t, content: {}, order: sections.length });
                  toast.success(`${TYPE_LABELS[t]} added`);
                  fetchData();
                } catch (err) {
                  toast.error(err?.response?.data?.message || 'Failed to add');
                }
              }}
              className="bg-ink/5 hover:bg-ink/10 text-ink text-sm font-body px-4 py-2 rounded-lg transition"
            >
              + {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Sections List ---------- */}
      {loading ? (
        <p className="font-body text-slate">Loading sections...</p>
      ) : sections.length === 0 ? (
        <p className="font-body text-slate">No sections yet. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={section._id} className="bg-white border border-ink/10 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs">▲</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === sections.length - 1} className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs">▼</button>
                </div>
                <div>
                  <h3 className="font-display text-base text-ink">{TYPE_LABELS[section.type] || section.type}</h3>
                  <p className="font-body text-xs text-slate/70">
                    {section.isActive ? 'Visible on site' : 'Hidden'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(section)}
                  className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition"
                >
                  {section.isActive ? 'Hide' : 'Show'}
                </button>
                {isEditableType(section.type) && (
                  <button
                    onClick={() => handleEdit(section)}
                    className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(section._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-body px-3 py-1.5 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeBuilder;