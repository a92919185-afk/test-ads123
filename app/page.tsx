import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricHeaderCard } from "@/components/MetricHeaderCard";
import { ProfitTable } from "@/components/ProfitTable";

export default async function Dashboard({ searchParams }: { searchParams: { days?: string } }) {
  const days = await searchParams?.days || '1'; // Await because Next.js 15 searchParams is a Promise

  // MOCK de Exemplo
  const mockMetrics = [
    {
      id: "1",
      campaign_name: "[SEARCH] Produtos High-Ticket",
      cost: 500,
      conversion_value: 2000,
      profit: 1500,
      clicks: 120,
      date: "2026-02-27"
    },
    {
      id: "2",
      campaign_name: "[PMAX] Fundo de Funil",
      cost: 1000,
      conversion_value: 800,
      profit: -200,
      clicks: 430,
      date: "2026-02-27"
    },
    {
      id: "3",
      campaign_name: "[DISPLAY] Remarketing Abandonados",
      cost: 150,
      conversion_value: 950,
      profit: 800,
      clicks: 890,
      date: "2026-02-27"
    }
  ];

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
          <MetricHeaderCard title="NET PROFIT" value={2100} isCurrency trend="up" icon="profit" />
          <MetricHeaderCard title="TOTAL AD SPEND" value={1650} isCurrency icon="cost" />
          <MetricHeaderCard title="GROSS REVENUE" value={3750} isCurrency icon="conversion" />
          <MetricHeaderCard title="TOTAL CLICKS" value={1440} icon="click" />
        </div>

        {/* Table Section */}
        <ProfitTable metrics={mockMetrics} />
      </div>
    </div>
  );
}
