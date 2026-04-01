export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          AyresIoT v2.0
        </h1>
        <p className="text-xl text-gray-300">
          El núcleo híbrido (Next.js + Firebase + SQL) está listo para despegar.
        </p>
      </div>
    </main>
  );
}
