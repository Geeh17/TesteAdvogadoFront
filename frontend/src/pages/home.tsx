import Layout from "@/components/Layout";
import PrivateRoute from "@/components/PrivateRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

export default function HomePage() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalFichas, setTotalFichas] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<
    { mes: string; fichas: number }[]
  >([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(
    new Date()
  );
  const [ranking, setRanking] = useState<{ nome: string; total: number }[]>([]);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const dashboardRes = await axios.get("/dashboard");

        setTotalClientes(dashboardRes.data.totalClientes);
        setTotalFichas(dashboardRes.data.totalFichas);

        setDadosGrafico(
          dashboardRes.data.fichasPorMes.map(
            (item: { mes: number; total: number }) => ({
              mes: new Date(2024, item.mes - 1).toLocaleString("pt-BR", {
                month: "short",
              }),
              fichas: item.total,
            })
          )
        );

        if (dashboardRes.data.rankingComNomes) {
          setRanking(dashboardRes.data.rankingComNomes);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    }

    carregarDashboard();
  }, []);

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-7xl mx-auto py-10 px-4">
          {/* 🔧 Ajuste de padding à esquerda no mobile */}
          <div className="px-4 sm:px-0">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
              Sistema de Gestão Jurídica Integrada
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Link href="/clientes">
              <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  Clientes
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Gerencie seus clientes cadastrados.
                </p>
              </div>
            </Link>
            <Link href="/fichas">
              <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  Fichas
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Visualize e edite as fichas vinculadas aos clientes.
                </p>
              </div>
            </Link>
            <Link href="/configuracoes">
              <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  Meu Perfil
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Atualize seus dados e configurações.
                </p>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <h2 className="font-semibold dark:text-white mb-4">Resumo</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg">
                  <p>Total de Clientes</p>
                  <h3 className="text-2xl font-bold">{totalClientes}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg">
                  <p>Total de Fichas</p>
                  <h3 className="text-2xl font-bold">{totalFichas}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <h2 className="font-semibold dark:text-white mb-4">
                Fichas por Mês
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosGrafico}>
                  <XAxis dataKey="mes" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="fichas" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {ranking.length > 0 && (
            <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-lg mb-10">
              <h2 className="font-semibold dark:text-white mb-4">
                Ranking de Advogados
              </h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {ranking.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {index + 1}. {item.nome}
                    </span>
                    <span>{item.total} clientes</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-lg">
            <h2 className="font-semibold dark:text-white mb-4">Calendário</h2>
            <DatePicker
              locale="pt-BR"
              selected={dataSelecionada}
              onChange={(date: Date | null) => setDataSelecionada(date)}
              inline
              calendarStartDay={0}
            />
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
}
