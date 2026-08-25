export default function CategoryHeader({ category }) {
  return (
    <div className="mb-6 sm:mb-8 animate-fade-in">
      <div className="text-5xl sm:text-6xl mb-3 animate-float-emoji inline-block">
        {category.emoji}
      </div>
      <div>
        <div className="inline-flex items-center gap-1.5 bg-primary-soft/80 border border-primary-light/40 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary mb-3 shadow-xs">
          <span>{category.label}</span>
        </div>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary mb-2 leading-tight">
        {category.label}
      </h2>
      <p className="text-sm text-text-secondary leading-relaxed max-w-lg font-sans">
        {category.desc}
      </p>
    </div>
  );
}
