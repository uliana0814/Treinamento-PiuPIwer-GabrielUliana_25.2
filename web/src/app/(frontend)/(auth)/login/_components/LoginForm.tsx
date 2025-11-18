'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation" //

import LoginOptionals from "@/components/auth/LoginOptionals";
import RequiredTag from "@/components/base/input/RequiredTag";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';

const CredentialsButton = dynamic(() => import('@/components/auth/CredentialsButton'));
const ValidatedInput = dynamic(() => import('@/components/base/input/ValidatedInput'));

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/home",
      }, {
        onSuccess: () => {
            toast.success("Login realizado!");
            router.push("/home"); 
            router.refresh(); 
        },
        onError: (ctx) => {
            toast.error(ctx.error.message || "Erro ao fazer login");
            setLoading(false); 
        }
      });

    } catch (error) {
      toast.error('Erro: ' + String(error))
      setLoading(false);
    }
  };

  return ( 
    <div className="lg:w-[90%] xl:w-[80%]">
      <h2 className="font-bold text-[40px] text-center leading-12">Entre para ver o que seus amigos estão pensando!</h2>
      <form className="mt-6" onSubmit={handleSubmit}>
        <ValidatedInput 
          title="E-mail"
          placeholder="exemplo@piupiwer.com.br"
          name="email"
          type="email"
          value={email}
          setValue={setEmail}
          labelClassName='auth-label'
          inputClassName='auth-input'
          iconContainerClassName="auth-icon"
          required
        ><RequiredTag/></ValidatedInput>
        
        <ValidatedInput 
          title="Senha"
          placeholder="Insira sua senha"
          name="password"
          type="password"
          value={password}
          setValue={setPassword}
          overrideValidate={(val) => val.length >= 6}
          containerClassName="mt-4"
          labelClassName="auth-label"
          inputClassName="auth-input"
          iconContainerClassName="auth-icon"
          required
        ><RequiredTag/></ValidatedInput>

        <LoginOptionals />

        <CredentialsButton className="mt-6" disabled={loading}>Entrar</CredentialsButton>
      </form>
      
      <div className="flex items-center gap-4 py-5">
        <div className="flex-grow h-0.5 bg-gray-400" />
        <p className="text-gray-400 text-lg">ou</p>
        <div className="flex-grow h-0.5 bg-gray-400" />
      </div>

      <Link href='/cadastro' className="block w-fit mt-8 text-sm group">Ainda não tem uma conta? <span className="text-blue-500 colorTransition border-b border-transparent group-hover:border-blue-500">Cadastre-se</span></Link>
    </div>
   );
}

export default LoginForm;