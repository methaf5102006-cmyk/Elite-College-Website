import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getSiteSettings, updateSiteSettings } from '../../services/siteSettingsService';
import ImageUploadField from '../../components/common/ImageUploadField';

const emptyForm = {
  logo: '',
  collegeName: '',
  tagline: '',
  address: '',
  phone: '',
  email: '',
  facebookUrl: '',
  instagramUrl: '',
  navLinksText: '',
  footerBlurb: '',
  footerQuickLinksText: '',
  footerResourcesText: '',
  copyrightText: '',
};

// ---------- Nav links: "Label | Path | SubLabel1:SubPath1, SubLabel2:SubPath2" ----------
const navLinksToText = (navLinks = []) =>
  navLinks
    .map((link) => {
      let line = `${link.label} | ${link.path}`;
      if (link.dropdown && link.dropdown.length) {
        const subs = link.dropdown.map((d) => `${d.label}:${d.path}`).join(', ');
        line += ` | ${subs}`;
      }
      return line;
    })
    .join('\n');

const textToNavLinks = (text) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const label = parts[0] || '';
      const path = parts[1] || '';
      const dropdown = [];
      if (parts[2]) {
        parts[2].split(',').forEach((pair) => {
          const [dLabel, dPath] = pair.split(':').map((s) => s.trim());
          if (dLabel && dPath) dropdown.push({ label: dLabel, path: dPath });
        });
      }
      return { label, path, dropdown };
    });

// ---------- Footer links: "Label | Path" ----------
const footerLinksToText = (links = []) =>
  links.map((l) => `${l.label} | ${l.path}`).join('\n');

const textToFooterLinks = (text) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, path] = line.split('|').map((p) => (p || '').trim());
      return { label: label || '', path: path || '' };
    });

const inputClass = "w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "font-body text-sm text-charcoal block mb-1";
const hintClass = "font-body text-xs text-slate/70 mb-1";

const SiteSettingsManager = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSiteSettings();
      setForm({
        logo: data.logo || '',
        collegeName: data.collegeName || '',
        tagline: data.tagline || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        facebookUrl: data.facebookUrl || '',
        instagramUrl: data.instagramUrl || '',
        navLinksText: navLinksToText(data.navLinks),
        footerBlurb: data.footerBlurb || '',
        footerQuickLinksText: footerLinksToText(data.footerQuickLinks),
        footerResourcesText: footerLinksToText(data.footerResources),
        copyrightText: data.copyrightText || '',
      });
    } catch (err) {
      toast.error('Failed to load site settings');
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
      setSaving(true);
      const payload = {
        logo: form.logo,
        collegeName: form.collegeName,
        tagline: form.tagline,
        address: form.address,
        phone: form.phone,
        email: form.email,
        facebookUrl: form.facebookUrl,
        instagramUrl: form.instagramUrl,
        navLinks: textToNavLinks(form.navLinksText),
        footerBlurb: form.footerBlurb,
        footerQuickLinks: textToFooterLinks(form.footerQuickLinksText),
        footerResources: textToFooterLinks(form.footerResourcesText),
        copyrightText: form.copyrightText,
      };
      await updateSiteSettings(payload);
      toast.success('Site settings saved');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setImage = (key) => (url) => setForm({ ...form, [key]: url });

  if (loading) return <p className="font-body text-slate mt-10">Loading site settings...</p>;

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-2">Header &amp; Footer Settings</h2>
      <p className="font-body text-sm text-slate mb-6">
        Edit the logo, contact info, social links, navigation menu, and footer content shown across the whole site.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6 space-y-8">

        {/* ---------- HEADER SECTION ---------- */}
        <div>
          <h3 className="font-display text-lg text-ink mb-4">Header</h3>
          <div className="space-y-4">
            <ImageUploadField label="Logo" value={form.logo} onChange={setImage('logo')} />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>College Name</label>
                <input className={inputClass} value={form.collegeName} onChange={set('collegeName')} />
              </div>
              <div>
                <label className={labelClass}>Tagline (e.g. City name)</label>
                <input className={inputClass} value={form.tagline} onChange={set('tagline')} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input className={inputClass} value={form.address} onChange={set('address')} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input className={inputClass} value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} value={form.email} onChange={set('email')} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Facebook URL</label>
                <input className={inputClass} value={form.facebookUrl} onChange={set('facebookUrl')} placeholder="https://www.facebook.com/..." />
              </div>
              <div>
                <label className={labelClass}>Instagram URL</label>
                <input className={inputClass} value={form.instagramUrl} onChange={set('instagramUrl')} placeholder="https://www.instagram.com/..." />
              </div>
            </div>

            <div>
              <label className={labelClass}>Navigation Menu</label>
              <p className={hintClass}>
                Format: <strong>Label | Path</strong> — add dropdown items after a third " | " separated by commas, each as <strong>SubLabel:SubPath</strong>.
                <br />
                Example: <code>Academics | /academics | Faculty:/faculty, Departments:/academics?category=undergraduate</code>
                <br />
                One menu item per line.
              </p>
              <textarea rows={7} className={inputClass} value={form.navLinksText} onChange={set('navLinksText')} />
            </div>
          </div>
        </div>

        <hr className="border-ink/10" />

        {/* ---------- FOOTER SECTION ---------- */}
        <div>
          <h3 className="font-display text-lg text-ink mb-4">Footer</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Footer Blurb (short text under logo)</label>
              <textarea rows={2} className={inputClass} value={form.footerBlurb} onChange={set('footerBlurb')} />
            </div>

            <div>
              <label className={labelClass}>Quick Links</label>
              <p className={hintClass}>Format: Label | Path (one per line)</p>
              <textarea rows={5} className={inputClass} value={form.footerQuickLinksText} onChange={set('footerQuickLinksText')} />
            </div>

            <div>
              <label className={labelClass}>Resources</label>
              <p className={hintClass}>Format: Label | Path (one per line)</p>
              <textarea rows={4} className={inputClass} value={form.footerResourcesText} onChange={set('footerResourcesText')} />
            </div>

            <div>
              <label className={labelClass}>Copyright Text (shown after the year, e.g. "© 2026 ___")</label>
              <input className={inputClass} value={form.copyrightText} onChange={set('copyrightText')} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SiteSettingsManager;