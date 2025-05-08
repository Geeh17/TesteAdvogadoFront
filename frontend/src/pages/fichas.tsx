import { useEffect, useState } from "react";
import axios from "@/services/api";
import Layout from "@/components/Layout";
import PrivateRoute from "@/components/PrivateRoute";
import ModalAndamento from "@/components/ModalAndamento";
import { CalendarDays, FileDown, Trash } from "lucide-react";

interface Cliente {
  id: number;
  nome: string;
}

interface Ficha {
  id: number;
  descricao: string;
  data: string;
}

export default function FichasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(
    null
  );
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [descricao, setDescricao] = useState("");

  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  const [buscaNome, setBuscaNome] = useState("");
  const [sugestoes, setSugestoes] = useState<Cliente[]>([]);

  const [andamentos, setAndamentos] = useState<any[]>([]);
  const [fichaSelecionada, setFichaSelecionada] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    axios.get("/clientes").then((res) => setClientes(res.data));
  }, []);

  useEffect(() => {
    if (clienteSelecionado) {
      axios
        .get(`/fichas/${clienteSelecionado}`)
        .then((res) => setFichas(res.data));
    } else {
      setFichas([]);
    }
  }, [clienteSelecionado]);

  useEffect(() => {
    if (buscaNome.trim() === "") {
      setSugestoes([]);
    } else {
      const termo = buscaNome.toLowerCase();
      const filtrados = clientes.filter((c) =>
        c.nome.toLowerCase().includes(termo)
      );
      setSugestoes(filtrados);
    }
  }, [buscaNome, clientes]);

  function selecionarCliente(id: number, nome: string) {
    setClienteSelecionado(id);
    setBuscaNome(nome);
    setSugestoes([]);
  }

  async function criarFicha(e: React.FormEvent) {
    e.preventDefault();
    if (!clienteSelecionado || !descricao.trim()) return;

    try {
      const res = await axios.post(`/fichas/${clienteSelecionado}`, {
        descricao,
      });
      setFichas((prev) => [res.data, ...prev]);
      setDescricao("");
    } catch (err) {
      console.error("Erro ao criar ficha", err);
    }
  }

  async function baixarPdf(fichaId: number) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/fichas/${fichaId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ficha-${fichaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erro ao baixar PDF", err);
    }
  }

  async function buscarAndamentos(fichaId: number) {
    try {
      const res = await axios.get(`/andamentos/${fichaId}`);
      setAndamentos(res.data);
      setFichaSelecionada(fichaId);
      setMostrarModal(true);
    } catch (err) {
      console.error("Erro ao buscar andamentos", err);
    }
  }

  async function deletarAndamento(id: number) {
    try {
      await axios.delete(`/andamentos/${id}`);
      setAndamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erro ao deletar andamento", err);
    }
  }

  const fichasFiltradas = fichas.filter((ficha) => {
    const dataFicha = new Date(ficha.data);
    const correspondeDescricao = ficha.descricao
      .toLowerCase()
      .includes(filtroDescricao.toLowerCase());
    const correspondeAno = filtroAno
      ? dataFicha.getFullYear().toString() === filtroAno
      : true;
    const correspondeMes = filtroMes
      ? (dataFicha.getMonth() + 1).toString().padStart(2, "0") === filtroMes
      : true;
    return correspondeDescricao && correspondeAno && correspondeMes;
  });

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-5xl mx-auto py-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Fichas Jurídicas
          </h1>

          {/* Campo de busca de cliente */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Buscar cliente
            </label>
            <input
              type="text"
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
              placeholder="Digite o nome do cliente..."
              className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            {sugestoes.length > 0 && (
              <ul className="border border-gray-200 dark:border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto bg-white dark:bg-gray-800 shadow z-10 relative">
                {sugestoes.map((cliente) => (
                  <li
                    key={cliente.id}
                    onClick={() => selecionarCliente(cliente.id, cliente.nome)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {cliente.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!clienteSelecionado ? (
            <p className="text-gray-600 dark:text-gray-300 italic">
              Favor buscar e selecionar um cliente para ver seu histórico.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-700 dark:text-white mb-4">
                Total de fichas:{" "}
                <span className="font-semibold">{fichasFiltradas.length}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Buscar por descrição..."
                  value={filtroDescricao}
                  onChange={(e) => setFiltroDescricao(e.target.value)}
                  className="p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
                <input
                  type="number"
                  placeholder="Ano (ex: 2024)"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(e.target.value)}
                  className="p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
                <input
                  type="number"
                  placeholder="Mês (ex: 04)"
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>

              <form onSubmit={criarFicha} className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Descrição da ficha
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    rows={4}
                    placeholder="Descreva o atendimento"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Criar Ficha
                </button>
              </form>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Fichas encontradas
                </h2>
                {fichasFiltradas.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-300">
                    Nenhuma ficha encontrada.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {fichasFiltradas.map((ficha) => (
                      <li
                        key={ficha.id}
                        className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium dark:text-white">
                              {ficha.descricao}
                            </p>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(ficha.data).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={() => baixarPdf(ficha.id)}
                              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                            >
                              <FileDown className="w-4 h-4" /> PDF
                            </button>
                            <button
                              onClick={() => buscarAndamentos(ficha.id)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Ver Andamentos
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {mostrarModal && fichaSelecionada !== null && (
          <ModalAndamento
            fichaId={fichaSelecionada}
            onClose={() => {
              setMostrarModal(false);
              setFichaSelecionada(null);
            }}
            onAdd={(novo) => setAndamentos((prev) => [novo, ...prev])}
          />
        )}

        {andamentos.length > 0 && (
          <div className="max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              Andamentos da ficha #{fichaSelecionada}
            </h3>
            <ul className="space-y-3">
              {andamentos.map((a) => (
                <li
                  key={a.id}
                  className="border-b dark:border-gray-600 pb-2 flex justify-between items-start"
                >
                  <div>
                    <p className="text-sm text-gray-800 dark:text-white">
                      {a.descricao}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(a.data).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deletarAndamento(a.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir andamento"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Layout>
    </PrivateRoute>
  );
}
