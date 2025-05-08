import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/services/api";
import Layout from "@/components/Layout";
import PrivateRoute from "@/components/PrivateRoute";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo?: boolean;
}

const perfilSchema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 letras"),
    email: z.string().email("E-mail inválido"),
    senhaAtual: z.string().optional(),
    novaSenha: z
      .string()
      .min(9, "Nova senha deve ter no mínimo 9 caracteres")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.senhaAtual && !data.novaSenha) return false;
      return true;
    },
    {
      message: "Informe a nova senha ao preencher a senha atual",
      path: ["novaSenha"],
    }
  );

const cadastroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 letras"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(9, "Senha deve ter no mínimo 9 caracteres"),
});

type PerfilFormData = z.infer<typeof perfilSchema>;
type CadastroFormData = z.infer<typeof cadastroSchema>;

export default function ConfiguracoesPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const perfilForm = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
  });
  const cadastroForm = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const res = await axios.get("/usuarios/perfil");
        setUsuario(res.data);
        perfilForm.reset({ nome: res.data.nome, email: res.data.email });
        if (res.data.role === "MASTER") carregarUsuarios();
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert("Sessão expirada ou usuário inativo. Faça login novamente.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.error("Erro ao carregar perfil", error);
        }
      }
    }
    carregarPerfil();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await axios.get("/usuarios");
      setUsuarios(res.data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Acesso expirado ou não autorizado. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error("Erro ao carregar usuários", error);
      }
    }
  }

  async function atualizarPerfil(data: PerfilFormData) {
    try {
      await axios.put("/usuarios/perfil", data);
      alert("Perfil atualizado com sucesso!");
      perfilForm.reset({ ...data, senhaAtual: "", novaSenha: "" });
    } catch (error) {
      alert("Erro ao atualizar perfil");
      console.error(error);
    }
  }

  async function cadastrarNovoUsuario(data: CadastroFormData) {
    try {
      await axios.post("/usuarios", { ...data, role: "ADVOGADO" });
      alert("Novo usuário cadastrado com sucesso!");
      cadastroForm.reset();
      carregarUsuarios();
    } catch (error) {
      alert("Erro ao cadastrar usuário");
      console.error(error);
    }
  }

  async function alterarRole(id: number, novoRole: string) {
    try {
      await axios.put(`/usuarios/${id}`, { role: novoRole });
      alert("Função alterada com sucesso!");
      carregarUsuarios();
    } catch (error) {
      alert("Erro ao atualizar a função");
      console.error(error);
    }
  }

  async function alterarStatus(id: number, novoStatus: boolean) {
    try {
      await axios.put(`/usuarios/${id}`, { ativo: novoStatus });
      alert("Status atualizado com sucesso!");
      carregarUsuarios();
    } catch (error) {
      alert("Erro ao atualizar status");
      console.error(error);
    }
  }

  async function deletarUsuario(id: number) {
    const confirmacao = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmacao) return;

    try {
      await axios.delete(`/usuarios/${id}`);
      alert("Usuário excluído com sucesso!");
      carregarUsuarios();
    } catch (error) {
      alert("Erro ao excluir usuário");
      console.error(error);
    }
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-6xl mx-auto py-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Configurações da Conta
          </h1>

          <form
            onSubmit={perfilForm.handleSubmit(atualizarPerfil)}
            className="space-y-5 mb-10"
          >
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Nome
              </label>
              <input
                {...perfilForm.register("nome")}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              {perfilForm.formState.errors.nome && (
                <p className="text-red-500 text-sm">
                  {perfilForm.formState.errors.nome.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                E-mail
              </label>
              <input
                {...perfilForm.register("email")}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              {perfilForm.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {perfilForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Senha atual
              </label>
              <input
                type="password"
                {...perfilForm.register("senhaAtual")}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Nova senha
              </label>
              <input
                type="password"
                {...perfilForm.register("novaSenha")}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              {perfilForm.formState.errors.novaSenha && (
                <p className="text-red-500 text-sm">
                  {perfilForm.formState.errors.novaSenha.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Salvar alterações
            </button>
          </form>

          {usuario?.role === "MASTER" && (
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Cadastrar novo usuário
                </h2>
                <form
                  onSubmit={cadastroForm.handleSubmit(cadastrarNovoUsuario)}
                  className="space-y-4"
                >
                  <input
                    placeholder="Nome"
                    {...cadastroForm.register("nome")}
                    className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <input
                    placeholder="E-mail"
                    {...cadastroForm.register("email")}
                    className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    {...cadastroForm.register("senha")}
                    className="w-full p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Cadastrar usuário
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Usuários cadastrados
                </h2>
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                    <tr>
                      <th className="text-left p-3">Nome</th>
                      <th className="text-left p-3">E-mail</th>
                      <th className="text-left p-3">Função</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-center p-3">Alterar Função</th>
                      <th className="text-center p-3">Alterar Status</th>
                      <th className="text-center p-3">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-b dark:border-gray-600">
                        <td className="p-3 text-gray-800 dark:text-white">
                          {u.nome}
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">
                          {u.email}
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">
                          {u.role}
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">
                          {u.ativo ? "Ativo" : "Inativo"}
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={u.role}
                            onChange={(e) => alterarRole(u.id, e.target.value)}
                            className="p-2 border rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          >
                            <option value="MASTER">MASTER</option>
                            <option value="ADVOGADO">ADVOGADO</option>
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={u.ativo ? "true" : "false"}
                            onChange={(e) =>
                              alterarStatus(u.id, e.target.value === "true")
                            }
                            className="p-2 border rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          >
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => deletarUsuario(u.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </PrivateRoute>
  );
}
