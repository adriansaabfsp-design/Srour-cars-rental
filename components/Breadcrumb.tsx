import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-[11px] sm:tracking-[0.2em]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <svg className="h-2.5 w-2.5 text-gray-900/20 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-900/40 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-navy truncate max-w-[160px] sm:max-w-none">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
