import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAbout, updateAbout } from '../../services/aboutService';
import ImageUploadField from '../../components/common/ImageUploadField';

const emptyForm = {
  intro: { heading: '', description: '' },
  mission: '',
  vision: '',
  history: { heading: '', description: '', milestones: [] },
  leadershipMessage: { name: '', designation: '', message: '', image: '' },
  coreValues: [],
};

const AboutManager = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAbout();
      if (data) {
        setForm({
          intro: { heading: data.intro?.heading || '', description: data.intro?.description || '' },
          mission: data.mission || '',
          vision: data.vision || '',
          history: {
            heading: data.history?.heading || '',
            description: data.history?.description || '',
            milestones: data.history?.milestones || [],
          },
          leadershipMessage: {
            name: data.leadershipMessage?.name || '',
            designation: data.leadershipMessage?.designation || '',
            message: data.leadershipMessage?.message || '',
            image: data.leadershipMessage?.image || '',
          },
          coreValues: data.coreValues || [],
        });
      }
    } catch (err) {
      toast.error('Failed to load About content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateAbout(form);
      toast.success('About page updated');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Milestone handlers ----------
  const addMilestone = () => {
    setForm({
      ...form,
      history: {
        ...form.history,
        milestones: [...form.history.milestones, { year: '', title: '', description: '' }],
      },
    });
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...form.history.milestones];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, history: { ...form.history, milestones: updated } });
  };

  const removeMilestone = (index) => {
    const updated = form.history.milestones.filter((_, i) => i !== index);
    setForm({ ...form, history: { ...form.history, milestones: updated } });
  };

  // ---------- Core Value handlers ----------
  const addCoreValue = () => {
    setForm({ ...form, coreValues: [...form.coreValues, { title: '', description: '', icon: '' }] });
  };

  const updateCoreValue = (index, field, value) => {
    const updated = [...form.coreValues];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, coreValues: updated });
  };

  const removeCoreValue = (index) => {
    setForm({ ...form, coreValues: form.coreValues.filter((_, i) => i !== index) });
  };

  const inputClass = "w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40";
  const labelClass = "font-body text-sm text-charcoal block mb-1";
  const sectionClass = "bg-white border border-ink/10 rounded-xl p-6 mb-6 space-y-4";
  const sectionTitleClass = "font-display text-lg text-ink mb-2";

  if (loading) return <p className="font-body text-slate mt-10">Loading About content...</p>;

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">About Page Management</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Intro */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Intro Section</h3>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              type="text"
              value={form.intro.heading}
              onChange={(e) => setForm({ ...form, intro: { ...form.intro, heading: e.target.value } })}
              placeholder="About EliteCollege"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.intro.description}
              onChange={(e) => setForm({ ...form, intro: { ...form.intro, description: e.target.value } })}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Mission &amp; Vision</h3>
          <div>
            <label className={labelClass}>Mission</label>
            <textarea
              value={form.mission}
              onChange={(e) => setForm({ ...form, mission: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Vision</label>
            <textarea
              value={form.vision}
              onChange={(e) => setForm({ ...form, vision: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        {/* History + Milestones */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>History / Timeline</h3>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              type="text"
              value={form.history.heading}
              onChange={(e) => setForm({ ...form, history: { ...form.history, heading: e.target.value } })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.history.description}
              onChange={(e) => setForm({ ...form, history: { ...form.history, description: e.target.value } })}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Milestones</label>
            {form.history.milestones.map((m, i) => (
              <div key={i} className="border border-ink/10 rounded-lg p-3 mb-3 space-y-2 bg-parchment/40">
                <div className="grid sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Year (e.g. 1988)"
                    value={m.year}
                    onChange={(e) => updateMilestone(i, 'year', e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={m.title}
                    onChange={(e) => updateMilestone(i, 'title', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={m.description || ''}
                  onChange={(e) => updateMilestone(i, 'description', e.target.value)}
                  rows={2}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(i)}
                  className="text-red-600 text-xs font-body hover:underline"
                >
                  Remove milestone
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              className="bg-ink/5 hover:bg-ink/10 text-ink text-sm font-body px-4 py-2 rounded-lg transition"
            >
              + Add Milestone
            </button>
          </div>
        </div>

        {/* Leadership Message */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Leadership Message</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={form.leadershipMessage.name}
                onChange={(e) => setForm({ ...form, leadershipMessage: { ...form.leadershipMessage, name: e.target.value } })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Designation</label>
              <input
                type="text"
                value={form.leadershipMessage.designation}
                onChange={(e) => setForm({ ...form, leadershipMessage: { ...form.leadershipMessage, designation: e.target.value } })}
                placeholder="e.g. Principal"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea
              value={form.leadershipMessage.message}
              onChange={(e) => setForm({ ...form, leadershipMessage: { ...form.leadershipMessage, message: e.target.value } })}
              rows={3}
              className={inputClass}
            />
          </div>
          <ImageUploadField
            label="Photo (optional)"
            value={form.leadershipMessage.image}
            onChange={(url) => setForm({ ...form, leadershipMessage: { ...form.leadershipMessage, image: url } })}
          />
        </div>

        {/* Core Values */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Core Values</h3>
          {form.coreValues.map((v, i) => (
            <div key={i} className="border border-ink/10 rounded-lg p-3 mb-3 space-y-2 bg-parchment/40">
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={v.title}
                  onChange={(e) => updateCoreValue(i, 'title', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Icon (react-icons/fi name, optional)"
                  value={v.icon || ''}
                  onChange={(e) => updateCoreValue(i, 'icon', e.target.value)}
                  className={inputClass}
                />
              </div>
              <textarea
                placeholder="Description"
                value={v.description}
                onChange={(e) => updateCoreValue(i, 'description', e.target.value)}
                rows={2}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeCoreValue(i)}
                className="text-red-600 text-xs font-body hover:underline"
              >
                Remove core value
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCoreValue}
            className="bg-ink/5 hover:bg-ink/10 text-ink text-sm font-body px-4 py-2 rounded-lg transition"
          >
            + Add Core Value
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save About Page'}
        </button>
      </form>
    </div>
  );
};

export default AboutManager;