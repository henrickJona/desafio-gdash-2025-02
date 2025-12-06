import { Card, CardContent } from "@/components/ui/card";
// ⭐️ Importando os ícones do Lucide React ⭐️
import { Thermometer, Droplet, CloudFog, MapPin } from "lucide-react";

export function WeatherCards({ latest }: any) {
  if (!latest) return null; // ⭐️ Classes para Hover e Transição ⭐️

  const cardHoverClasses =
    "transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-blue-400 hover:border-blue-500";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <Card className={cardHoverClasses}>
        <CardContent className="flex items-center justify-between pt-4">
          <div>
            <p className="text-sm text-gray-500">Temperatura</p>
            <span className="text-2xl font-bold">{latest.temperature}°C</span>
          </div>
          <Thermometer className="w-8 h-8 text-red-500" />
        </CardContent>
      </Card>
      <Card className={cardHoverClasses}>
        <CardContent className="flex items-center justify-between pt-4">
          <div>
            <p className="text-sm text-gray-500">Umidade</p>
            <span className="text-2xl font-bold">{latest.humidity}%</span>
          </div>
          <Droplet className="w-8 h-8 text-blue-500" />
        </CardContent>
      </Card>
      <Card className={cardHoverClasses}>
        <CardContent className="flex items-center justify-between pt-4">
          <div>
            <p className="text-sm text-gray-500">Pressão</p>
            <span className="text-2xl font-bold">{latest.pressure} hPa</span>
          </div>
          <CloudFog className="w-8 h-8 text-gray-700" />
        </CardContent>
      </Card>
      <Card className={cardHoverClasses}>
        <CardContent className="flex items-center justify-between pt-4">
          <div>
            <p className="text-sm text-gray-500">Estação</p>
            <span className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
              {latest.stationId}
            </span>
          </div>
          <MapPin className="w-8 h-8 text-green-600" />
        </CardContent>
      </Card>
    </div>
  );
}
