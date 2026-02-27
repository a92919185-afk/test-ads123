import { ArrowDownRight, ArrowUpRight, Megaphone, Pointer } from 'lucide-react';

interface MetricHeaderCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    isCurrency?: boolean;
    trend?: 'up' | 'down' | 'neutral';
    icon: 'click' | 'cost' | 'profit' | 'conversion';
}

export function MetricHeaderCard({ title, value, subValue, isCurrency, trend, icon }: MetricHeaderCardProps) {
    const getIcon = () => {
        switch (icon) {
            case 'click': return <Pointer className="h-5 w-5 text-gray-400" />;
            case 'cost': return <ArrowDownRight className="h-5 w-5 text-red-500" />;
            case 'profit': return <ArrowUpRight className="h-5 w-5 text-emerald-500" />;
            case 'conversion': return <Megaphone className="h-5 w-5 text-blue-500" />;
        }
    };

    const formattedValue = isCurrency
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
        : new Intl.NumberFormat('pt-BR').format(Number(value));

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="rounded-md bg-gray-50 p-2">{getIcon()}</div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <h3 className={`text-2xl font-bold ${trend === 'down' ? 'text-red-600' : trend === 'up' ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {formattedValue}
                </h3>
                {subValue && (
                    <span className="text-sm font-medium text-gray-500">
                        {subValue}
                    </span>
                )}
            </div>
        </div>
    );
}
