import { Card, CardContent } from "@/components/ui/card";

export function WeatherCards({ latest }: any) {
  if (!latest) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <Card>
        <CardContent className="pt-4">Temp: {latest.temperature}°C</CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">Umidade: {latest.humidity}%</CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          Pressão: {latest.pressure} hPa
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">Estação: {latest.stationId}</CardContent>
      </Card>
    </div>
  );
}
