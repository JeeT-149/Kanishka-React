import { CATEGORIES, type Category } from "../../types/product";

export interface CategoryPillsProps {
  activeCategory: Category | "all";
  onSelectCategory: (category: Category | "all") => void;
}

export function CategoryPills({
  activeCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="no-scrollbar -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-0.5"
    >
      {CATEGORIES.map((item) => {
        const isSelected = activeCategory === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelectCategory(item.id)}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition active:scale-[0.97] ${
              isSelected
                ? "border-accent bg-accent text-white"
                : "border-line bg-card text-ink hover:border-ink/40"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
