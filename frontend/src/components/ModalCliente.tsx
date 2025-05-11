import { useEffect } from "react";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  dataAniversario?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Cliente, "id">) => void;
  cliente: Cliente | null;
}

const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 letras"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  endereco: z.string().min(5, "Endereço é obrigatório"),
  dataAniversario: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export default function ModalCliente({
  isOpen,
  onClose,
  onSubmit,
  cliente,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    shouldFocusError: false, // ✅ Corrige o erro de focus
  });

  useEffect(() => {
    if (cliente) {
      reset({
        nome: cliente.nome,
        cpf: cliente.cpf,
        telefone: cliente.telefone,
        endereco: cliente.endereco,
        dataAniversario: cliente.dataAniversario?.slice(0, 10) || "",
      });
    } else {
      reset({
        nome: "",
        cpf: "",
        telefone: "",
        endereco: "",
        dataAniversario: "",
      });
    }
  }, [cliente, reset]);

  function handleFormSubmit(data: ClienteFormData) {
    onSubmit(data as Omit<Cliente, "id">);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {cliente ? "Editar Cliente" : "Cadastrar Cliente"}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nome"
              {...register("nome")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <InputMask
                  mask="999.999.999-99"
                  placeholder="CPF"
                  {...field}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded"
                />
              )}
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <InputMask
                  mask="(99) 99999-9999"
                  placeholder="Telefone"
                  {...field}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded"
                />
              )}
            />
            {errors.telefone && (
              <p className="text-red-500 text-sm">{errors.telefone.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Endereço"
              {...register("endereco")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded"
            />
            {errors.endereco && (
              <p className="text-red-500 text-sm">{errors.endereco.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              Data de Aniversário
            </label>
            <input
              type="date"
              {...register("dataAniversario")}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
