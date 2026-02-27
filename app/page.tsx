import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricHeaderCard } from "@/components/MetricHeaderCard";
import { ProfitTable } from "@/components/ProfitTable";

export default async function Dashboard({ searchParams }: { searchParams: { days?: string } }) {
  const days = searchParams?.days || '1'; // Default: Hoje

  // MOCK de Exemplo: Aqui no backend, buscaríamos os valores do Supabase (await supabaseClient.from(...)
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">AdsMaster Dashboard</h1>
            <p className="text-gray-500">Métricas consolidadas e indicador isolado de lucro.</p>
          </div>
          <DashboardFilters currentFilter={days} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricHeaderCard title="Lucro Bruto (Profit)" value={1300} isCurrency trend="up" icon="profit" />
          <MetricHeaderCard title="Investido/Custo" value={1500} isCurrency icon="cost" />
          <MetricHeaderCard title="Valor de Conversão" value={2800} isCurrency icon="conversion" />
          <MetricHeaderCard title="Cliques Totais" value={550} icon="click" />
        </div>

        {/* Tabela de Campanhas Detalhada */}
        <ProfitTable metrics={mockMetrics} />
      </div>
    </div>
  );
}
