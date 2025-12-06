import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { WeatherCards } from "../components/Weather/WeatherCards";
import { WeatherChart } from "../components/Weather/WeatherChart";
import { InsightsPanel } from "../components/Weather/InsightsPanel";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await api.get("/weather/logs?limit=200");
    setLogs(r.data);

    const i = await api.get("/weather/insights");
    setInsight(i.data);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-3">
        <Button
          onClick={() =>
            window.open("http://localhost:3000/api/weather/export.csv")
          }
        >
          Exportar CSV
        </Button>
        <Button
          onClick={() =>
            window.open("http://localhost:3000/api/weather/export.xlsx")
          }
        >
          Exportar XLSX
        </Button>
      </div>

      <WeatherCards latest={logs[0]} />
      <WeatherChart data={logs} />
      <InsightsPanel insights={insight} />
    </div>
  );
}
