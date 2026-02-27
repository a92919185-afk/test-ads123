import Link from 'next/link';

interface DashboardFiltersProps {
    currentFilter: string;
}

export function DashboardFilters({ currentFilter }: DashboardFiltersProps) {
    const filters = [
        { label: 'Hoje', value: '1' },
        { label: 'Últimos 7 dias', value: '7' },
        { label: 'Últimos 30 dias', value: '30' },
    ];

    return (
        <div className="flex gap-2">
            {filters.map((filter) => (
                <Link
                    key={filter.value}
                    href={`/?days=${filter.value}`}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${currentFilter === filter.value
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    {filter.label}
                </Link>
            ))}
        </div>
    );
}
