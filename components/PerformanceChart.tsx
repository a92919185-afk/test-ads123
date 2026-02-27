"use client";

import { useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CampaignMetric {
    date: string;
    cost: number;
    conversion_value: number;
    profit: number;
}

interface PerformanceChartProps {
    metrics: CampaignMetric[];
}

export function PerformanceChart({ metrics }: PerformanceChartProps) {
    const chartData = useMemo(() => {
        // Group metrics by date
        const grouped = metrics.reduce((acc, curr) => {
            const dateKey = curr.date;
            if (!acc[dateKey]) {
                acc[dateKey] = {
                    date: dateKey,
                    cost: 0,
                    revenue: 0,
                    profit: 0,
                };
            }
            acc[dateKey].cost += Number(curr.cost) || 0;
            acc[dateKey].revenue += Number(curr.conversion_value) || 0;
            acc[dateKey].profit += Number(curr.profit) || 0;
            return acc;
        }, {} as Record<string, { date: string; cost: number; revenue: number; profit: number }>);

        // Convert to array and sort by date ascending
        return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    }, [metrics]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

    if (!chartData || chartData.length === 0) {
        return (
            <div className="h-64 w-full flex items-center justify-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
                <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    WAITING FOR PLOT DATA
                </p>
            </div>
        );
    }

    return (
        <div className="h-72 w-full mt-8 p-4 rounded-xl border border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
            <div className="mb-4">
                <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase">
                    Timeline de Performance Global
                </h2>
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(str) => {
                            try {
                                return format(parseISO(str), "dd MMM", { locale: ptBR });
                            } catch {
                                return str;
                            }
                        }}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#737373", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        tickFormatter={(val) => `R$ ${val}`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#737373", fontSize: 12 }}
                        width={70}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-xl">
                                        <p className="text-neutral-400 text-xs mb-2">
                                            {label ? format(parseISO(String(label)), "dd 'de' MMMM", { locale: ptBR }) : ''}
                                        </p>
                                        {payload.map((entry: { name: string; value: number; color: string }) => (
                                            <div key={entry.name} className="flex items-center gap-3 mb-1">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                <span className="text-xs text-neutral-300 font-medium w-16">
                                                    {entry.name === "revenue" && "Receita"}
                                                    {entry.name === "cost" && "Custo"}
                                                    {entry.name === "profit" && "Lucro"}
                                                </span>
                                                <span
                                                    className={`text-xs font-mono font-semibold ${entry.name === "profit"
                                                        ? entry.value >= 0
                                                            ? "text-emerald-400"
                                                            : "text-rose-400"
                                                        : "text-neutral-100"
                                                        }`}
                                                >
                                                    {formatCurrency(entry.value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="revenue"
                    />
                    <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCost)"
                        name="cost"
                    />
                    <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                        name="profit"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
