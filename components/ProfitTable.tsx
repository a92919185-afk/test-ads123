interface CampaignMetric {
    id: string;
    campaign_name: string;
    cost: number;
    conversion_value: number;
    profit: number;
    clicks: number;
    date: string;
}

interface ProfitTableProps {
    metrics: CampaignMetric[];
}

export function ProfitTable({ metrics }: ProfitTableProps) {
    return (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h2 className="text-lg font-semibold text-gray-900">Performance de Campanhas</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Campanha</th>
                            <th className="px-6 py-4 font-medium text-right">Cliques</th>
                            <th className="px-6 py-4 font-medium text-right">Custo</th>
                            <th className="px-6 py-4 font-medium text-right">Conv. Value</th>
                            <th className="px-6 py-4 font-medium text-right">Lucro</th>
                            <th className="px-6 py-4 font-medium text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {metrics.map((metric) => {
                            const formatCurrency = (val: number) =>
                                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

                            const isProfitable = metric.profit > 0;

                            return (
                                <tr key={metric.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{metric.campaign_name}</td>
                                    <td className="px-6 py-4 text-right">{metric.clicks}</td>
                                    <td className="px-6 py-4 text-right">{formatCurrency(metric.cost)}</td>
                                    <td className="px-6 py-4 text-right">{formatCurrency(metric.conversion_value)}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${isProfitable ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {isProfitable ? '+' : ''}{formatCurrency(metric.profit)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isProfitable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {isProfitable ? 'Lucro' : 'Prejuízo'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Linha de Totalizador se Metrics Estiver Vazio (Mock Inicial) */}
                        {metrics.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Nenhum dado capturado ainda. Configure seu Ads Script.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
