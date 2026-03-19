import { useNavigate } from "react-router-dom"

const templates = [
  {
    id: 2,
    name: "Quiz Game",
    description: "Trò chơi trắc nghiệm với nhiều câu hỏi",
    image: "https://via.placeholder.com/120",
  },
  {
    id: 3,
    name: "Matching Game",
    description: "Ghép các cặp nội dung tương ứng",
    image: "https://via.placeholder.com/120",
  },
  {
    id: 1,
    name: "Group Sort Game",
    description: "Sắp xếp các nhóm theo chủ đề",
    image: "https://via.placeholder.com/120",
  },
]

export default function Create() {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="mb-4 font-semibold text-blue-700 text-xl">
        Chọn Template
      </h2>

      <div className="gap-4 grid grid-cols-3 md:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              navigate(`/create/input/${template.id}`)
            }}
            className="flex gap-4 hover:shadow-md p-4 border rounded-xl cursor-pointer"
          >
            {/* Image */}
            <img
              src={template.image}
              alt={template.name}
              className="rounded-lg w-28 h-20 object-cover"
            />

            {/* Info */}
            <div className="items-start">
              <h3 className="font-semibold text-blue-600 text-lg">
                {template.name}
              </h3>

              <p className="text-gray-500 text-sm">
                {template.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}