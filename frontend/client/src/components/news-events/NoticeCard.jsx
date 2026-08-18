const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const NoticeCard = ({ notice }) => {
  return (
    <div className="bg-white rounded-lg border border-ink/10 p-5 hover:shadow-sm transition">
      <div className="flex justify-between items-start gap-3">
        <h3 className="font-body font-semibold text-ink">{notice.title}</h3>
        <span className="font-body text-xs text-slate whitespace-nowrap">
          {formatDate(notice.date)}
        </span>
      </div>
      <p className="font-body text-sm text-charcoal mt-2">{notice.description}</p>
    </div>
  );
};

export default NoticeCard;