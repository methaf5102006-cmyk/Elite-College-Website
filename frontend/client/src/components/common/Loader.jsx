const Loader = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-ink/20 border-t-gold rounded-full animate-spin"></div>
        <p className="font-body text-slate text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;