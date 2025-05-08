import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/services/api";
import { useRouter } from "next/router";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setErro("");
    setLoading(true);

    try {
      const response = await axios.post("/login", data);
      localStorage.setItem("token", response.data.token);
      router.push("/home");
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.message || err?.response?.data?.erro || "";

      if (mensagem.includes("inativo")) {
        setErro(
          "Sua conta está inativa. Entre em contato com o administrador."
        );
      } else if (
        err?.response?.status === 401 ||
        mensagem.includes("inválidas")
      ) {
        setErro("E-mail ou senha incorretos.");
      } else {
        setErro("Erro ao tentar fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-login.png')" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6 text-center"
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="h-28 mx-auto mb-2"
          style={{ maxWidth: "180px" }}
        />

        {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Digite seu e-mail"
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            {...register("senha")}
            placeholder="Digite sua senha"
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.senha && (
            <p className="text-sm text-red-500 mt-1">{errors.senha.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-2 rounded-lg transition`}
        >
          {loading ? "⌛ Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
