import Link from 'next/link';

interface DashboardFiltersProps {
    currentFilter: string;
}

export function DashboardFilters({ currentFilter }: DashboardFiltersProps) {
    const filters = [
        { label: 'Hoje', value: '1' },
        { label: '7 D', value: '7' },
        { label: '30 D', value: '30' },
    ];

    return (
        <div className="flex gap-2 bg-neutral-900/50 p-1.5 rounded-lg border border-neutral-800">
            {filters.map((filter) => {
                const isActive = currentFilter === filter.value;
                return (
                    <Link
                        key={filter.value}
                        href={`/?days=${filter.value}`}
                        // Important next/link optimization for App Router to refresh props:
                        prefetch={true}
                        className={`
                            rounded-md px-4 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200
                            ${isActive
                                ? 'bg-neutral-800 text-neutral-100 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-neutral-700'
                                : 'bg-transparent text-neutral-500 hover:text-neutral-300 border border-transparent'
                            }
                        `}
                    >
                        {filter.label}
                    </Link>
                );
            })}
        </div>
    );
}
