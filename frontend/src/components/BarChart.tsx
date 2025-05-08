import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface BarChartProps {
  data: { mes: number; total: number }[];
  titulo: string;
}

export default function BarChartComponent({ data, titulo }: BarChartProps) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
        {titulo}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="mes"
            stroke="#666"
            tick={{ fill: "#333" }}
            tickLine={{ stroke: "#ccc" }}
            axisLine={{ stroke: "#ccc" }}
          />
          <YAxis
            stroke="#666"
            tick={{ fill: "#333" }}
            tickLine={{ stroke: "#ccc" }}
            axisLine={{ stroke: "#ccc" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              color: "#fff",
              borderRadius: 8,
              border: "none",
            }}
            labelStyle={{ color: "#93c5fd" }}
          />
          <Bar dataKey="total" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
