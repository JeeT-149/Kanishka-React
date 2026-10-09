import type { Category } from "../../types/product";
import {
  IconFlame,
  IconLeaf,
  IconShieldCheck,
  IconClock,
  IconTruck,
} from "../common/Icons";

export interface ReassuranceRowsProps {
  category: Category;
}

export function ReassuranceRows({ category }: ReassuranceRowsProps) {
  const firstItem =
    category === "tea"
      ? { label: "Packed fresh to order", icon: IconLeaf }
      : category === "gear"
        ? { label: "Quality checked before dispatch", icon: IconShieldCheck }
        : { label: "Roasted to order", icon: IconFlame };

  const items = [
    firstItem,
    { label: "Ships in 1-2 working days", icon: IconClock },
    { label: "Free shipping across India", icon: IconTruck },
  ];

  return (
    <ul className="mt-6 space-y-2.5 border-t border-line/60 pt-5 text-xs text-mute">
      {items.map(({ label, icon: Icon }) => (
        <li key={label} className="flex items-center gap-2.5">
          <Icon width={16} height={16} className="shrink-0 text-accent" />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
