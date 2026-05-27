import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Economy from "./pages/Economy";
import Moderation from "./pages/Moderation";
import Roles from "./pages/Roles";
import Logs from "./pages/Logs";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-white flex">

        {/* サイドバー */}
        <div className="w-64 bg-black border-r border-yellow-500 p-5">

          <h1 className="text-3xl font-bold text-yellow-400 mb-8">
            🍋 Lemonade
          </h1>

          <div className="space-y-3">

            <Link to="/">
              <button className="w-full text-left bg-zinc-900 hover:bg-yellow-500 hover:text-black transition rounded-xl p-3">
                🏠 Dashboard
              </button>
            </Link>

            <Link to="/economy">
              <button className="w-full text-left bg-zinc-900 hover:bg-yellow-500 hover:text-black transition rounded-xl p-3">
                💰 Economy
              </button>
            </Link>

            <Link to="/moderation">
              <button className="w-full text-left bg-zinc-900 hover:bg-yellow-500 hover:text-black transition rounded-xl p-3">
                🔨 Moderation
              </button>
            </Link>

            <Link to="/roles">
              <button className="w-full text-left bg-zinc-900 hover:bg-yellow-500 hover:text-black transition rounded-xl p-3">
                🎭 Roles
              </button>
            </Link>

            <Link to="/logs">
              <button className="w-full text-left bg-zinc-900 hover:bg-yellow-500 hover:text-black transition rounded-xl p-3">
                📜 Logs
              </button>
            </Link>

          </div>
        </div>

        {/* ページ */}
        <div className="flex-1 p-8">

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/economy" element={<Economy />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}