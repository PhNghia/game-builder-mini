import { useNavigate } from "react-router-dom"
import ListGame from "./ListGame"

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="flex-1">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-blue-700 text-2xl">
                    Dashboard
                </h2>

                <button
                    onClick={() => navigate("/create")}
                    className="bg-blue-600 hover:bg-blue-500 shadow px-4 py-2 rounded-xl text-white"
                >
                    + Create Game
                </button>
            </div>

            {/* Stats */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-6">
                <div className="bg-white shadow p-4 rounded-2xl">
                    <p className="text-gray-500">Total Games</p>
                    <h3 className="font-bold text-blue-600 text-2xl">12</h3>
                </div>

                <div className="bg-white shadow p-4 rounded-2xl">
                    <p className="text-gray-500">Plays</p>
                    <h3 className="font-bold text-blue-600 text-2xl">1,240</h3>
                </div>

                <div className="bg-white shadow p-4 rounded-2xl">
                    <p className="text-gray-500">Templates</p>
                    <h3 className="font-bold text-blue-600 text-2xl">8</h3>
                </div>
            </div>

            {/* Recent Games */}
            <div className="bg-white shadow p-6 rounded-2xl">
                <h3 className="mb-4 font-semibold text-blue-700 text-lg">
                    Recent Games
                </h3>

                <ListGame />
            </div>
        </div>
    )
}