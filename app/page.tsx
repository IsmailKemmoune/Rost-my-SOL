import RoastLogs from "@/components/composites/RoastLogs";
import UserWalletCard from "@/components/composites/UserWalletCard";

export default function RoastMySol() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden ">
      {/* Cyberpunk background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

        {/* Animated glowing circles */}
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse-medium"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-pink-600/10 rounded-full filter blur-3xl animate-pulse-fast"></div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Animated neon lines */}
        <div className="absolute left-0 right-0 h-[1px] top-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70 animate-neon-line"></div>
        <div className="absolute left-0 right-0 h-[1px] bottom-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70 animate-neon-line-delay"></div>
      </div>

      <main className="relative w-full">
        <div className="flex flex-col items-center justify-center ">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mb-2 animate-glitch">
              ROAST MY SOL
            </h1>
            <p className="text-pink-500 text-lg font-medium mt-2 italic">
              Connect to get roasted harder than an FTX investor
            </p>
          </div>

          <div className="relative flex flex-col gap-7 xl:flex-row xl:w-[80%]">
            <UserWalletCard />
            <RoastLogs />
          </div>
        </div>
      </main>
    </div>
  );
}
