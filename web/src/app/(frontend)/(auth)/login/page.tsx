import PiuPiwer from '@/components/svgs/piupiwer.png'
import LoginForm from './_components/LoginForm';
import Image from "next/image";

function LoginPage() {
  return ( 
    <main className="lg:h-screen flex">
      <div className="w-[55%] h-full flex flex-col gap-8 items-center justify-center">
        <LoginForm />
      </div>

      <div className="h-full w-[45%] flex flex-row justify-center items-center py-32">
        <div className="text-blue-500 flex gap-4" >
          <Image 
            src={PiuPiwer} 
            alt="Logo PiuPiwer" 
            className="w-auto h-auto"
          />
          <h1 className='font-bold text-[64px] items-center leading-none m-0 pt-16'>PiuPiwer</h1>
        </div>
      </div>
    </main>
   );
}

export default LoginPage;