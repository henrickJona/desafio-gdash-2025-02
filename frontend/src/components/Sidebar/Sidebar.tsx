import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Compass, Users } from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Explorar", href: "/explore", icon: Compass },
  { name: "Usuários", href: "/users", icon: Users },
];

export default function Sidebar() {
  const location = useLocation();

  // Agora o estado é controlado automaticamente pelo tamanho da tela
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    function handleResize() {
      setIsOpen(window.innerWidth >= 1024); // >= 1024px → aberto
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Largura baseada no estado automático
  const widthClass = isOpen ? "w-64" : "w-20";

  const bgColorClass = "bg-slate-100 text-slate-700";

  return (
    <nav
      className={`flex-shrink-0 ${widthClass} ${bgColorClass} shadow-lg transition-all duration-300 relative h-screen rounded-r-lg`}
    >
      {/* Removido o botão — sidebar agora é automática */}
      <div className="p-4 flex justify-center" />

      <ul className="space-y-2 p-4 pt-0">
        {navigationItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.href}
              className={`flex items-center p-3 rounded-lg transition-colors group 
                ${isOpen ? "space-x-3" : "justify-center"}
                ${
                  location.pathname === item.href
                    ? "bg-blue-500/20 font-semibold text-blue-600"
                    : "hover:bg-slate-300 text-slate-700"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {isOpen && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
