import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function WeatherChart({ data }: any) {
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#0ea5e9" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
