import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricHeaderCard } from "@/components/MetricHeaderCard";

export default async function Dashboard({ searchParams }: { searchParams: { days?: string } }) {
  const days = searchParams?.days || '1'; // Default: Hoje

  // Aqui no backend, buscaríamos os valores agregados via query

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
          <MetricHeaderCard title="Lucro Bruto (Profit)" value={1500} isCurrency trend="up" icon="profit" />
          <MetricHeaderCard title="Investido/Custo" value={1000} isCurrency icon="cost" />
          <MetricHeaderCard title="Valor de Conversão" value={2500} isCurrency icon="conversion" />
          <MetricHeaderCard title="Cliques" value={3400} icon="click" />
        </div>
      </div>
    </div>
  );
}
