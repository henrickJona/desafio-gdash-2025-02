import { useEffect, useState } from "react";
import { api } from "../api/axios"; // Ajuste o caminho do seu axios
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
// ⭐️ Importando o novo componente ⭐️
import { PokemonDetailModal } from "./../components/Pokemon/PokemonDetailModal";

// Tipos de dados
interface PokemonData {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export default function Explore() {
  const [data, setData] = useState<PokemonData | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // ⭐️ Novo estado para o Pokémon selecionado (usado para abrir o modal) ⭐️
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    api
      .get(`/pokemon?page=${page}`)
      .then((r) => {
        setData(r.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar Pokémons:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  // Função chamada ao clicar no card, define o nome e abre o modal.
  const handleCardClick = (name: string) => {
    setSelectedPokemon(name);
  };

  // Função para fechar o modal (passada como prop)
  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  // Lógica de desabilitação
  const hasPrevious = page > 1;
  const hasNext = !!data?.next;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4 font-semibold">Explorar Pokémons</h1>

      {/* Renderização Condicional: Loading ou Conteúdo */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.results?.length ? (
            data.results.map((p) => (
              // ⭐️ Adicionando o evento de clique no card ⭐️
              <div
                key={p.name}
                className="border rounded p-4 capitalize cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(p.name)}
              >
                <p className="font-medium">{p.name}</p>
              </div>
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">
              Nenhum Pokémon encontrado nesta página.
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!hasPrevious || isLoading}
        >
          Anterior
        </Button>

        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext || isLoading}
        >
          Próxima
        </Button>
      </div>

      {/* ⭐️ Renderização do Modal de Detalhes, passando o nome e o handler de fechar ⭐️ */}
      <PokemonDetailModal
        pokemonName={selectedPokemon}
        onClose={handleCloseModal}
      />
    </div>
  );
}
