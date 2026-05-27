export default function Dashboard() {

  const login = () => {
    window.location.href =
      "http://localhost:3000/auth/discord";
  };

  return (
    <div>

      <h1 className="text-5xl font-bold text-yellow-400">
        🍋 Dashboard
      </h1>

      <p className="text-zinc-400 mt-3 mb-8">
        LemonadeBot の管理パネル
      </p>

      <button
        onClick={login}
        className="
          bg-yellow-400
          hover:bg-yellow-300
          text-black
          font-bold
          px-6
          py-4
          rounded-2xl
          text-xl
          transition
        "
      >
        🔑 Discordでログイン
      </button>

    </div>
  );
}