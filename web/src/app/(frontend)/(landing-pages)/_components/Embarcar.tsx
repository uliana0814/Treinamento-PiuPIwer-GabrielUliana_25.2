'use client';

import Link from 'next/link';

function Embarcar({ isLogged }: { isLogged: boolean }) {
  return (
    <Link
      href={isLogged ? '/aprender' : '/cadastro'}
      className="text-blue-50 text-4xl button-lg border-blue-200 bg-blue-500 colorTransition hover:bg-blue-400"
    >
      {isLogged ? 'Continue Aprendendo' : 'Cadastro (exemplo)'}
    </Link>
  );
}

export default Embarcar;
