import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "@/services/api";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  CalendarClock,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

interface Usuario {
  nome: string;
  email: string;
  role: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const res = await axios.get("/usuarios/perfil");
        setUsuario(res.data);
      } catch (error) {
        console.error("Erro ao carregar usuário", error);
      }
    }
    carregarUsuario();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  }

  return (
    <div className="flex min-h-screen relative bg-gray-100 dark:bg-gray-900">
      {/* Botão do menu mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        {!menuAberto && (
          <button onClick={() => setMenuAberto(true)} aria-label="Abrir menu">
            <Menu size={24} className="text-white dark:text-gray-200" />
          </button>
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          menuAberto
            ? "fixed inset-0 z-50 bg-blue-800 dark:bg-gray-800 p-6"
            : "hidden"
        } sm:relative sm:flex sm:flex-col sm:w-64 sm:p-6 sm:bg-blue-800 dark:sm:bg-gray-800 text-white h-full`}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between mb-6 sm:hidden">
          <button onClick={() => setMenuAberto(false)} aria-label="Fechar menu">
            <X size={24} />
          </button>
          <button onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Header desktop */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/home")}
            className="text-xl font-bold text-white"
          >
            📚 <span className="hidden md:inline">Advotech</span>
          </button>
          <button onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {usuario && (
          <div className="text-sm border-b border-blue-700 dark:border-gray-700 pb-4 mb-4">
            <p className="font-medium">{usuario.nome}</p>
            <p className="text-blue-200 text-xs">{usuario.email}</p>
            <p className="text-blue-300 italic text-xs">{usuario.role}</p>
          </div>
        )}

        <nav className="flex flex-col space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/clientes"
            className="flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded"
          >
            <Users className="w-5 h-5" />
            Clientes
          </Link>
          <Link
            href="/fichas"
            className="flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded"
          >
            <FileText className="w-5 h-5" />
            Fichas
          </Link>
          <Link
            href="/agenda"
            className="flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded"
          >
            <CalendarClock className="w-5 h-5" />
            Agenda
          </Link>
          {usuario?.role === "MASTER" && (
            <>
              <Link
                href="/configuracoes"
                className="flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded"
              >
                <Settings className="w-5 h-5" />
                Cadastro de usuário
              </Link>
              <Link
                href="/logs"
                className="flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded"
              >
                <FileText className="w-5 h-5" />
                Logs de Auditoria
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white flex items-center gap-2 justify-center"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 w-full overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
