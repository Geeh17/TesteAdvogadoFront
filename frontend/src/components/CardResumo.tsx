interface CardResumoProps {
  titulo: string;
  valor: number | string;
  cor?: string;
}

export default function CardResumo({
  titulo,
  valor,
  cor = "bg-white",
}: CardResumoProps) {
  return (
    <div className={`p-6 rounded-xl shadow-md ${cor} text-center`}>
      <h3 className="text-gray-600 text-sm font-medium">{titulo}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-2">{valor}</p>
    </div>
  );
}
