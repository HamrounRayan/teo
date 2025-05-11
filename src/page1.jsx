"use client"

import { BitcoinAnimation } from "./bitcoin-animation"


export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#050b18]">
      {/* Animation de fond */}
      <div className="absolute inset-0 z-0">
        <BitcoinAnimation />
      </div>

      {/* Contenu central */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Cryptography</span>{" "}
            
          </h1>
          <p className="mb-8 max-w-md text-lg text-gray-300">
            Découvrez la puissance de la cryptographie et la blockchain derrière . 
          </p>
     <button
            className="rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-3 text-lg font-semibold text-white shadow-lg transition duration-300 hover:shadow-xl"
            onClick={() => window.location.href = "./login"}
            >
            Get Started
     </button>
        </div>
      </div>
    </main>
  )
}
