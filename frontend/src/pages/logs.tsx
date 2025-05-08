import { useEffect, useState } from "react";
import axios from "@/services/api";
import Layout from "@/components/Layout";
import PrivateRoute from "@/components/PrivateRoute";
import { ShieldAlert } from "lucide-react";

interface Log {
  id: number;
  acao: string;
  tabela: string;
  registroId: number;
  data: string;
  usuario: {
    nome: string;
  };
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axios.get("/logs");
        setLogs(response.data);
      } catch (error) {
        console.error("Erro ao buscar logs", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-6xl mx-auto py-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
            <ShieldAlert className="w-6 h-6" />
            Logs de Auditoria
          </h1>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              Nenhum log encontrado.
            </p>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Data</th>
                    <th className="px-6 py-3 text-left">Usuário</th>
                    <th className="px-6 py-3 text-left">Ação</th>
                    <th className="px-6 py-3 text-left">Tabela</th>
                    <th className="px-6 py-3 text-left">Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4">
                        {new Date(log.data).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {log.usuario?.nome || "Desconhecido"}
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        {log.acao}
                      </td>
                      <td className="px-6 py-4">{log.tabela}</td>
                      <td className="px-6 py-4">{log.registroId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Layout>
    </PrivateRoute>
  );
}
