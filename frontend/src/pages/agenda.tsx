import { useEffect, useState } from "react";
import axios from "@/services/api";
import Layout from "@/components/Layout";
import PrivateRoute from "@/components/PrivateRoute";
import { Trash2 } from "lucide-react";

interface Compromisso {
  id: number;
  titulo: string;
  descricao?: string;
  dataHora: string;
  tipo: "AUDIENCIA" | "REUNIAO" | "PRAZO";
}

export default function AgendaPage() {
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [tipo, setTipo] = useState("AUDIENCIA");
  const [filtroTipo, setFiltroTipo] = useState("");

  useEffect(() => {
    buscarCompromissos();
  }, []);

  async function buscarCompromissos() {
    try {
      const res = await axios.get("/compromissos");
      setCompromissos(res.data);
    } catch (err) {
      console.error("Erro ao buscar compromissos", err);
    }
  }

  async function criarCompromisso(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token JWT não encontrado.");
        return;
      }

      const res = await axios.post(
        "/compromissos",
        {
          titulo,
          descricao,
          dataHora,
          tipo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompromissos((prev) => [...prev, res.data]);
      setTitulo("");
      setDescricao("");
      setDataHora("");
      setTipo("AUDIENCIA");
    } catch (err) {
      console.error("Erro ao criar compromisso", err);
    }
  }

  async function excluirCompromisso(id: number) {
    try {
      await axios.delete(`/compromissos/${id}`);
      setCompromissos((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erro ao excluir compromisso", err);
    }
  }

  const compromissosFiltrados = filtroTipo
    ? compromissos.filter((c) => c.tipo === filtroTipo)
    : compromissos;

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-4xl mx-auto py-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Agenda
          </h1>

          <form
            onSubmit={criarCompromisso}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow space-y-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Título
              </label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 
                           dark:bg-gray-800 dark:text-white dark:border-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-white">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 
                           dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium dark:text-white">
                  Data e Hora
                </label>
                <input
                  type="datetime-local"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 
                             dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">
                  Tipo
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 
                             dark:bg-gray-800 dark:text-white dark:border-gray-700"
                >
                  <option value="AUDIENCIA">Audiência</option>
                  <option value="REUNIAO">Reunião</option>
                  <option value="PRAZO">Prazo</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Criar Compromisso
            </button>
          </form>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-white">
              Filtrar por tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full md:w-1/3 p-2 border rounded-lg bg-white text-gray-900 
                         dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="">Todos</option>
              <option value="AUDIENCIA">Audiência</option>
              <option value="REUNIAO">Reunião</option>
              <option value="PRAZO">Prazo</option>
            </select>
          </div>

          {compromissosFiltrados.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              Nenhum compromisso encontrado.
            </p>
          ) : (
            <ul className="space-y-4">
              {compromissosFiltrados.map((c) => (
                <li
                  key={c.id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">
                      {c.titulo}
                    </h3>
                    {c.descricao && (
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {c.descricao}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(c.dataHora).toLocaleString()} -{" "}
                      <span className="uppercase">{c.tipo}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => excluirCompromisso(c.id)}
                    className="text-red-600 hover:text-red-800 mt-1"
                    title="Excluir compromisso"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Layout>
    </PrivateRoute>
  );
}
