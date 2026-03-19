import { Link, Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex bg-blue-50 min-h-screen">
      
      {/* Sidebar */}
      <aside className="flex flex-col bg-blue-600 p-4 w-64 text-white">
        <h1 className="mb-6 font-bold text-2xl">Game Builder</h1>

        <nav className="flex flex-col gap-3">
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-lg text-left"
          >
            Dashboard
          </Link>

          <Link
            to="/create"
            className="hover:bg-blue-500 px-3 py-2 rounded-lg text-left"
          >
            Create Game
          </Link>
        </nav>

        <div className="mt-auto">
          <button className="bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-lg w-full">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
          <Outlet />
      </main>
    </div>
  )
}