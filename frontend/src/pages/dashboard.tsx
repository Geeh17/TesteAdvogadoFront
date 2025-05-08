import { useEffect, useState } from "react";
import axios from "@/services/api";
import Layout from "@/components/Layout";
import PrivateRoute from "@/components/PrivateRoute";
import { Users, ClipboardList, CalendarDays } from "lucide-react";
import BarChartComponent from "@/components/BarChart";
import PieChartComponent from "@/components/PieChart";

interface DashboardData {
  totalClientes: number;
  totalFichas: number;
  fichasPorMes: { mes: number; total: number }[];
}

interface ClientesPorMesData {
  mes: number;
  total: number;
}

interface RankingAdvogadosData {
  nome: string;
  total: number;
}

export default function HomePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [clientesPorMes, setClientesPorMes] = useState<ClientesPorMesData[]>(
    []
  );
  const [rankingAdvogados, setRankingAdvogados] = useState<
    RankingAdvogadosData[]
  >([]);

  useEffect(() => {
    axios.get("/dashboard").then((res) => setDashboard(res.data));
    axios
      .get("/dashboard/clientes-por-mes")
      .then((res) => setClientesPorMes(res.data));
    axios
      .get("/dashboard/ranking-advogados")
      .then((res) => setRankingAdvogados(res.data));
  }, []);

  return (
    <PrivateRoute>
      <Layout>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Painel Administrativo
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Total de Clientes"
            value={dashboard?.totalClientes || 0}
            icon={<Users className="w-6 h-6 text-white" />}
          />
          <Card
            title="Total de Fichas"
            value={dashboard?.totalFichas || 0}
            icon={<ClipboardList className="w-6 h-6 text-white" />}
          />
          <Card
            title="Fichas este mês"
            value={dashboard?.fichasPorMes?.[0]?.total || 0}
            icon={<CalendarDays className="w-6 h-6 text-white" />}
          />
        </div>

        <div className="mt-8 space-y-8">
          {dashboard?.fichasPorMes && (
            <BarChartComponent
              data={dashboard.fichasPorMes}
              titulo="Fichas Criadas por Mês"
            />
          )}
          {clientesPorMes.length > 0 && (
            <BarChartComponent
              data={clientesPorMes}
              titulo="Clientes Cadastrados por Mês"
            />
          )}
          {rankingAdvogados.length > 0 && (
            <PieChartComponent data={rankingAdvogados} />
          )}
        </div>
      </Layout>
    </PrivateRoute>
  );
}

interface CardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function Card({ title, value, icon }: CardProps) {
  return (
    <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-xl shadow-lg flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>
      <div className="bg-blue-800 dark:bg-blue-900 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
}
