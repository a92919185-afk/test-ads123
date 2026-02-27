interface CampaignMetric {
    id: string;
    campaign_name: string;
    budget?: number;
    status?: string;
    impressions?: number;
    clicks: number;
    cost: number;
    conversions?: number;
    conversion_value: number;
    profit: number;
    search_absolute_top_impression_share?: number;
    search_top_impression_share?: number;
    search_impression_share?: number;
    target_cpa?: number;
    avg_target_cpa?: number;
    date: string;
}

interface ProfitTableProps {
    metrics: CampaignMetric[];
}

export function ProfitTable({ metrics }: ProfitTableProps) {
    return (
        <div className="mt-8 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
            <div className="border-b border-neutral-800 bg-neutral-900/40 px-6 py-5">
                <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase">Live Operations</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-neutral-900/20">
                        <tr>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase border-b border-neutral-800">Campanha</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Orçamento</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-center border-b border-neutral-800">Status</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Cliques/Conv.</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Impr.</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Cliques</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">CPC méd.</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Custo</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">% Impr. (1ª pos)</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">% Impr. (sup)</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Parc. Impr. Seg.</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Conversões</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Custo/Conv.</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">Valor Conv.</th>
                            <th className="px-5 py-4 text-[10px] font-bold tracking-widest text-neutral-100 uppercase text-right border-b border-neutral-800">Lucro Net</th>
                            <th className="px-5 py-4 text-[10px] font-bold tracking-widest text-neutral-100 uppercase text-right border-b border-neutral-800">ROI %</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">CPA des.</th>
                            <th className="px-5 py-4 text-[10px] font-semibold tracking-widest text-neutral-500 uppercase text-right border-b border-neutral-800">CPA md. des.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                        {metrics.map((metric) => {
                            const formatCurrency = (val: number) =>
                                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

                            const formatDecimal = (val: number) =>
                                new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

                            const formatPercent = (val: number) =>
                                new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(val / 100);

                            const isProfitable = metric.profit > 0;

                            // Calculations
                            const clicksPerConv = metric.conversions && metric.conversions > 0 ? (metric.clicks / metric.conversions) : 0;
                            const avgCpc = metric.clicks > 0 ? (metric.cost / metric.clicks) : 0;
                            const costPerConv = metric.conversions && metric.conversions > 0 ? (metric.cost / metric.conversions) : 0;
                            const roiPercent = metric.cost > 0 ? (metric.profit / metric.cost) * 100 : 0;

                            return (
                                <tr key={metric.id} className="transition-colors hover:bg-neutral-800/30 group">
                                    <td className="px-5 py-3 font-mono text-xs text-neutral-300 group-hover:text-white transition-colors">{metric.campaign_name}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.budget ? formatCurrency(metric.budget) : '-'}</td>
                                    <td className="px-5 py-3 text-center text-xs">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">{metric.status || 'UNKNOWN'}</span>
                                    </td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{formatDecimal(clicksPerConv)}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.impressions ? new Intl.NumberFormat('pt-BR').format(metric.impressions) : '-'}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{new Intl.NumberFormat('pt-BR').format(metric.clicks)}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{formatCurrency(avgCpc)}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-rose-400/80">{formatCurrency(metric.cost)}</td>

                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.search_absolute_top_impression_share ? formatPercent(metric.search_absolute_top_impression_share) : '-'}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.search_top_impression_share ? formatPercent(metric.search_top_impression_share) : '-'}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.search_impression_share ? formatPercent(metric.search_impression_share) : '-'}</td>

                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.conversions ? formatDecimal(metric.conversions) : '-'}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{formatCurrency(costPerConv)}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-emerald-400/80">{formatCurrency(metric.conversion_value)}</td>

                                    <td className={`px-5 py-3 text-right font-mono text-xs font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {isProfitable ? '+' : ''}{formatCurrency(metric.profit)}
                                    </td>
                                    <td className={`px-5 py-3 text-right font-mono text-xs font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {formatPercent(roiPercent)}
                                    </td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.target_cpa ? formatCurrency(metric.target_cpa) : '-'}</td>
                                    <td className="px-5 py-3 text-right font-mono text-xs text-neutral-400">{metric.avg_target_cpa ? formatCurrency(metric.avg_target_cpa) : '-'}</td>
                                </tr>
                            );
                        })}

                        {metrics.length === 0 && (
                            <tr>
                                <td colSpan={18} className="px-6 py-12 text-center text-neutral-600 font-mono text-xs border-t border-neutral-800">
                                    [  Awaiting telemetry data from Ads Engine  ]
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
