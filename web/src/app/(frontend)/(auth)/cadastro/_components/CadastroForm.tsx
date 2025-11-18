'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

import PasswordRequirement from "./PasswordRequirement";
import RequiredTag from "@/components/base/input/RequiredTag";
import { hasLowercase, hasMinLength, hasNumber, hasUppercase, validatePassword, validateConfirmPassword } from "@/utils";

import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

import dynamic from 'next/dynamic';

const CredentialsButton = dynamic(() => import('@/components/auth/CredentialsButton'));
const ValidatedInput = dynamic(() => import('@/components/base/input/ValidatedInput'));

function CadastroForm() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        setLoading(false); 
        return;
      }

      if (!validatePassword(password)) {
        toast.error("A senha não atende aos requisitos mínimos");
        setLoading(false); 
        return;
      }

      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/home", 
      });

      if (result.error) {
        if (result.error.message?.includes('already exists') || result.error.message?.includes('duplicate')) {
          toast.error("Este email ou nome de usuário já está cadastrado");
        } else {
          toast.error(result.error.message || "Erro inesperado");
        }
        setLoading(false); 
      } else {
        toast.success(`Bem-vindo(a), ${name}!`);
        router.push('/home'); 
        router.refresh();
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      
      if (error instanceof Error) {
        toast.error(error.message ?? "Erro inesperado");
      } else {
        toast.error("Erro inesperado");
      }

      setLoading(false);
    } 
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return ( 
    <div className="flex items-center justify-center bg-blue-500">
      <div className="p-10 m-10 border border-slate-200 rounded-2xl bg-white">
        <h2 className="font-bold text-[40px] text-center leading-12 p-2">Conectando a comunidade Poli!</h2>

        <form className="" onSubmit={handleCredentialsSubmit}>
          <div className="flex flex-col gap-4">
            
            <ValidatedInput
              title="Nome"
              placeholder="Insira seu nome completo"
              name="name"
              type="text"
              value={name}
              setValue={setName}
              labelClassName='auth-label'
              inputClassName='auth-input'
              iconContainerClassName="auth-icon"
              required
            ><RequiredTag/></ValidatedInput>

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
              overrideValidate={validatePassword}
              labelClassName="auth-label"
              inputClassName="auth-input"
              iconContainerClassName="auth-icon"
              required
            ><RequiredTag/></ValidatedInput>

            <ValidatedInput
              title="Confirmar Senha"
              placeholder="Confirme sua senha"
              name="confirmPassword"
              type="password"
              dependencies={[password]}
              value={confirmPassword}
              setValue={setConfirmPassword}
              overrideValidate={(val) => validateConfirmPassword(val, password)}
              labelClassName="auth-label"
              inputClassName="auth-input"
              iconContainerClassName="auth-icon"
              required
            ><RequiredTag/></ValidatedInput>
            
            <p>
              Senha deve ter pelo menos:
              <PasswordRequirement 
                text="1 letra maiúscula"
                validateFunction={() => hasUppercase(password)}
              />
              <PasswordRequirement 
                text="1 letra minúscula"
                validateFunction={() => hasLowercase(password)}
              />
              <PasswordRequirement 
                text="1 número"
                validateFunction={() => hasNumber(password)}
              />
              <PasswordRequirement 
                text="8 caracteres"
                validateFunction={() => hasMinLength(password)}
              />
            </p>
          </div>
          <CredentialsButton disabled={loading} className="mt-6">
            {loading ? "Criando conta..." : "Cadastrar"}
          </CredentialsButton>
        </form>
        
        <Link href='/login' className="block w-fit mt-8 text-sm group">Já tem uma conta? <span className="text-blue-500 colorTransition border-b border-transparent group-hover:border-blue-500">Login</span></Link>
      </div>
    </div>
   );
}

export default CadastroForm;