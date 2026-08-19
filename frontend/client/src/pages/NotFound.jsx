import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-parchment">
      <div className="text-center max-w-md">
        <p className="font-display text-7xl sm:text-8xl text-ink/10 leading-none mb-2">404</p>
        <h1 className="font-display text-2xl sm:text-3xl text-ink mb-3">Page not found</h1>
        <p className="text-slate text-sm sm:text-base mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <NavLink
          to="/"
          className="inline-flex items-center px-6 py-3 bg-ink text-parchment text-sm font-medium tracking-wide hover:bg-ink-light transition-colors duration-200"
        >
          Back to Home
        </NavLink>
      </div>
    </section>
  );
};

export default NotFound;