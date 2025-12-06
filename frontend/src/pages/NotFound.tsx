import { Link } from "react-router-dom"; // Assumindo que você usa react-router-dom
import { Button } from "@/components/ui/button"; // Componente Button que você usa

/**
 * Componente que exibe uma página de erro 404 (Não Encontrado).
 * @param backToLink O link para onde o botão "Voltar" deve apontar (ex: "/")
 */
interface NotFoundProps {
  backToLink?: string;
}

export default function NotFound({ backToLink = "/" }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
      {/* 🚨 Código de Erro Grande */}
      <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest mb-4">
        404
      </h1>

      {/* ⚠️ Mensagem Principal */}
      <div className="bg-orange-500 px-2 text-sm rounded rotate-12 absolute text-white font-semibold">
        Página Não Encontrada
      </div>

      {/* 💬 Explicação */}
      <p className="mt-5 text-xl text-gray-600 max-w-md">
        Ops! Parece que a página que você está procurando não existe ou foi
        movida.
      </p>

      {/* 🏠 Botão de Ação */}
      <Link to={backToLink} className="mt-8">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 transition duration-150"
        >
          Voltar para o Início
        </Button>
      </Link>
    </div>
  );
}
