import { useEffect, useState, useCallback } from "react";
import { api } from "@/api/axios"; // Ajuste o caminho do seu axios
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Ajuste o caminho dos seus componentes UI

// ⭐️ Tipo para o detalhe retornado pelo endpoint /pokemon/:nameOrId ⭐️
interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

interface PokemonDetailModalProps {
  // O nome do Pokémon a ser buscado. Se for null, o modal está fechado.
  pokemonName: string | null;
  // Função para fechar o modal
  onClose: () => void;
}

export function PokemonDetailModal({
  pokemonName,
  onClose,
}: PokemonDetailModalProps) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  // Função para buscar os detalhes na sua API NestJS
  const fetchDetail = useCallback(async (name: string) => {
    setIsLoadingDetail(true);
    setDetail(null);
    try {
      const r = await api.get(`/pokemon/${name}`);
      setDetail(r.data);
    } catch (error) {
      console.error(`Erro ao buscar detalhes de ${name}:`, error);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // Efeito para acionar a busca de detalhes sempre que o pokemonName mudar (ou seja, quando o modal abrir)
  useEffect(() => {
    if (pokemonName) {
      fetchDetail(pokemonName);
    }
  }, [pokemonName, fetchDetail]);

  // Não renderiza nada se não houver Pokémon selecionado
  if (!pokemonName) return null;

  return (
    <Dialog open={!!pokemonName} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="capitalize text-2xl">
            {pokemonName}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            <span className="ml-2">Buscando detalhes...</span>
          </div>
        ) : detail ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              ID Nacional: **#{detail.id}**
            </p>

            <div className="border p-3 rounded">
              <h3 className="font-semibold mb-1">Estatísticas:</h3>
              <p>Altura: **{detail.height / 10} m**</p>
              <p>Peso: **{detail.weight / 10} kg**</p>
            </div>

            <div className="border p-3 rounded">
              <h3 className="font-semibold mb-1">Tipos:</h3>
              <div className="flex gap-2">
                {detail.types.map((t, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded capitalize"
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="border p-3 rounded">
              <h3 className="font-semibold mb-1">Habilidades:</h3>
              <ul className="list-disc list-inside text-sm">
                {detail.abilities.map((a, index) => (
                  <li key={index} className="capitalize">
                    {a.ability.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 h-40 flex items-center justify-center">
            Detalhes não encontrados.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
