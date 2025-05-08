import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/services/api";

interface ModalAndamentoProps {
  fichaId: number;
  onClose: () => void;
  onAdd: (novo: any) => void;
}

const andamentoSchema = z.object({
  descricao: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres"),
});

type AndamentoFormData = z.infer<typeof andamentoSchema>;

export default function ModalAndamento({
  fichaId,
  onClose,
  onAdd,
}: ModalAndamentoProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AndamentoFormData>({
    resolver: zodResolver(andamentoSchema),
  });

  async function onSubmit(data: AndamentoFormData) {
    try {
      const res = await axios.post("/andamentos", {
        fichaId,
        ...data,
      });
      onAdd(res.data);
      reset();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar andamento", error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Novo Andamento
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              {...register("descricao")}
              className="w-full p-3 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              placeholder="Descreva o andamento"
              rows={4}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500 mt-1">
                {errors.descricao.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
