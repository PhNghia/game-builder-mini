import { useEffect, useState } from "react"

export default function ListGame() {
    const [games, setGames] = useState(null)

    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const data = await window.electron.getAllGames()
                setGames(data || [])
            } catch (error) {
                console.error(error)
            }
        }

        fetchAllGames()
    }, [])

    if (!games) {
        return <p>Loading list game...</p>
    }

    return (
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            {games.map((game) => (
                <div
                    key={game.id}
                    className="hover:shadow-md p-4 border rounded-xl transition"
                >
                    <div className="bg-blue-100 mb-3 rounded-lg h-32"></div>

                    <h4 className="font-semibold text-blue-600">
                        {game.title}
                    </h4>

                    <p className="text-gray-500 text-sm">
                        Last edited 2 days ago
                    </p>

                    <div className="flex gap-2 mt-3">

                        {/* PLAY */}
                        <button
                            className="flex-1 bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-lg text-white text-sm cursor-pointer"
                            onClick={async () => {
                                const data = await window.electron.getGameById(game.id)
                                await window.electron.openGame(data) // 🔥 nhớ truyền html
                            }}
                        >
                            Play Preview
                        </button>

                        {/* EXPORT */}
                        <button
                            className="flex-1 bg-gray-200 px-2 py-1 rounded-lg text-sm cursor-pointer"
                            onClick={async () => {
                                const res = await window.electron.exportGame(game.id)
                                console.log(res)
                            }}
                        >
                            Export .zip
                        </button>

                    </div>
                </div>
            ))}
        </div>
    )
}