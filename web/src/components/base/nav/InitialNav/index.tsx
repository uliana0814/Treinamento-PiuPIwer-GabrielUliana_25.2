'use client'
import Link from "next/link";
import NavbarLogo from "../NavbarLogo";
import { LogOut, LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function LandingPagesNav({ isLogged }: { isLogged: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); 
          router.refresh(); 
        },
      },
    });
  };

  return ( 
    <nav className="w-full py-6 px-8 flex items-center justify-between">
      <div className="text-blue-500">
        <NavbarLogo isH2 />
      </div>

      <ul className="flex items-center gap-4 text-lg"> {/* Ajustei o texto base para text-lg */}
        {isLogged ? (
          <div className="flex items-center gap-4 ml-8">
            <li>
              <button 
                onClick={handleLogout} 
                className="border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-bold cursor-pointer"
              >
                <LogOut size={18} /> Sair
              </button>
            </li>
          </div>
        )
        : (
          <>
            <li className="ml-8">
              <Link 
                href='/login' 
                className="px-8 py-2 rounded-full border border-black text-black font-bold hover:bg-gray-100 transition-colors"
              >
                Entrar
              </Link>
            </li>
            <li>
              <Link 
                href='/cadastro' 
                className="px-8 py-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
              >
                Cadastrar
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
   );
}

export default LandingPagesNav;