import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricHeaderCard } from "@/components/MetricHeaderCard";
import { ProfitTable } from "@/components/ProfitTable";
import { PerformanceChart } from "@/components/PerformanceChart";
import { supabase } from "@/utils/supabase";
import { subDays, format } from "date-fns";

export const dynamic = 'force-dynamic'; // Prevent static generation errors on Vercel
export const revalidate = 0;

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const params = await searchParams;
  const days = params?.days || '1';

  // Calculate the start date based on the selected filter
  const daysNum = parseInt(days, 10);
  const startDate = format(subDays(new Date(), daysNum), 'yyyy-MM-dd');

  // Fetch real data from Supabase
  const { data: metrics, error } = await supabase
    .from('campaign_metrics')
    .select(`
      *,
      account:accounts(
        name,
        google_ads_account_id
      )
    `)
    .gte('date', startDate)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching metrics:', error);
  }

  const campaignMetrics = metrics || [];

  // Calculate Aggregates
  const totalProfit = campaignMetrics.reduce((acc: number, curr: any) => acc + (Number(curr.profit) || 0), 0);
  const totalCost = campaignMetrics.reduce((acc: number, curr: any) => acc + (Number(curr.cost) || 0), 0);
  const totalRevenue = campaignMetrics.reduce((acc: number, curr: any) => acc + (Number(curr.conversion_value) || 0), 0);
  const totalClicks = campaignMetrics.reduce((acc: number, curr: any) => acc + (Number(curr.clicks) || 0), 0);

  // Simple trend logic for demo (comparing to a static baseline or just showing up if profit > 0)
  const profitTrend = totalProfit > 0 ? "up" : "down";

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      <div className="mx-auto max-w-7xl p-8">

        {/* Header Section */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end border-b border-neutral-900 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">AdsMaster</h1>
            </div>
            <p className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
              Consolidated Profit Terminal
            </p>
          </div>
          <DashboardFilters currentFilter={days} />
        </div>

        {/* Cards Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricHeaderCard
            title="NET PROFIT"
            value={totalProfit}
            isCurrency
            trend={profitTrend}
            icon="profit"
          />
          <MetricHeaderCard
            title="TOTAL AD SPEND"
            value={totalCost}
            isCurrency
            icon="cost"
          />
          <MetricHeaderCard
            title="GROSS REVENUE"
            value={totalRevenue}
            isCurrency
            icon="conversion"
          />
          <MetricHeaderCard
            title="TOTAL CLICKS"
            value={totalClicks}
            icon="click"
          />
        </div>

        {/* Chart Section */}
        <PerformanceChart metrics={campaignMetrics} />

        {/* Table Section */}
        <ProfitTable metrics={campaignMetrics} />

        {campaignMetrics.length === 0 && !error && (
          <div className="mt-12 text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
              [ NO DATA TELEMETRY DETECTED IN SELECTED RANGE ]
            </p>
            <p className="text-neutral-700 text-xs mt-2">
              Awaiting payload from Google Ads Script...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
