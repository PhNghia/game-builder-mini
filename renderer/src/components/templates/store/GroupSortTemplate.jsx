import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageOff } from "lucide-react";

const RANGE_OF_GROUP_MIN_MAX = [2, 8];
const RANGE_OF_ITEM_MIN_MAX = [1, 20];

export default function GroupSortTemplate() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [sections, setSections] = useState([
        createSection(1),
        createSection(2),
    ]);

    function createSection(index) {
        return {
            group: {
                id: `group${index}`,
                name: `Group ${index}`,
                imgsrc: "",
                imgFilePath: "",
            },
            items: [
                {
                    id: `item-${Date.now()}`,
                    name: "",
                    imgsrc: "",
                    imgFilePath: "",
                },
            ],
        };
    }

    // ================= GROUP =================
    const updateGroup = (i, field, value) => {
        const newData = [...sections];
        newData[i].group[field] = value;
        setSections(newData);
    };

    const uploadGroupImage = async (i) => {
        const filePath = await window.electron.openFile();
        if (!filePath) return;

        const url = `app-file://${encodeURI(filePath)}`;

        updateGroup(i, "imgsrc", url);
        updateGroup(i, "imgFilePath", filePath);
    };

    const removeGroupImage = (i) => {
        updateGroup(i, "imgsrc", "");
        updateGroup(i, "imgFilePath", "");
    };

    const addGroup = () => {
        if (sections.length >= RANGE_OF_GROUP_MIN_MAX[1]) return;
        setSections([...sections, createSection(sections.length + 1)]);
    };

    const removeGroup = (i) => {
        if (sections.length <= RANGE_OF_GROUP_MIN_MAX[0]) return;
        setSections(sections.filter((_, index) => index !== i));
    };

    // ================= ITEM =================
    const updateItem = (sIndex, iIndex, field, value) => {
        const newData = [...sections];
        newData[sIndex].items[iIndex][field] = value;
        setSections(newData);
    };

    const uploadItemImage = async (sIndex, iIndex) => {
        const filePath = await window.electron.openFile();
        if (!filePath) return;

        const url = `app-file://${encodeURI(filePath)}`;

        updateItem(sIndex, iIndex, "imgsrc", url);
        updateItem(sIndex, iIndex, "imgFilePath", filePath);
    };

    const removeItemImage = (sIndex, iIndex) => {
        updateItem(sIndex, iIndex, "imgsrc", "");
        updateItem(sIndex, iIndex, "imgFilePath", "");
    };

    const addItem = (sIndex) => {
        const newData = [...sections];

        if (newData[sIndex].items.length >= RANGE_OF_ITEM_MIN_MAX[1]) return;

        newData[sIndex].items.push({
            id: `item-${Date.now()}`,
            name: "",
            imgsrc: "",
            imgFilePath: "",
        });

        setSections(newData);
    };

    const removeItem = (sIndex, iIndex) => {
        const newData = [...sections];

        if (newData[sIndex].items.length <= RANGE_OF_ITEM_MIN_MAX[0]) return;

        newData[sIndex].items = newData[sIndex].items.filter(
            (_, i) => i !== iIndex
        );

        setSections(newData);
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        const groups = sections.map((s) => ({
            ...s.group,
        }));

        const items = sections.flatMap((s) =>
            s.items.map((item) => ({
                ...item,
                groupId: s.group.id,
            }))
        );

        const payload = {
            template: "group-sort",
            title,
            data: { groups, items },
        };

        const res = await window.electron.createGame(payload);

        const game = await window.electron.getGameById(res.id)
        await window.electron.openGame(game)
        navigate(`/`);
    };

    return (
        <div className="space-y-6 mx-auto p-6 max-w-6xl">
            <h2 className="font-bold text-blue-700 text-2xl">
                Group Sort Builder
            </h2>

            <input
                placeholder="Game title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-2 border rounded-xl w-full"
            />

            {/* GROUP GRID */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                {sections.map((section, sIndex) => (
                    <div key={sIndex} className="space-y-4 bg-gray-50 p-4 rounded-xl">

                        {/* HEADER */}
                        <div className="flex items-center gap-3">
                            {section.group.imgsrc && (
                                <img
                                    src={section.group.imgsrc}
                                    className="rounded-lg w-12 h-12 object-cover"
                                />
                            )}

                            <input
                                placeholder="Group name"
                                value={section.group.name}
                                onChange={(e) =>
                                    updateGroup(sIndex, "name", e.target.value)
                                }
                                className="flex-1 px-3 py-2 border rounded-lg"
                            />

                            {!section.group.imgsrc ? (
                                <button onClick={() => uploadGroupImage(sIndex)}>
                                    🖼️
                                </button>
                            ) : (
                                <button onClick={() => removeGroupImage(sIndex)}>
                                    <ImageOff size={18} />
                                </button>
                            )}

                            {sections.length > 2 && (
                                <button
                                    onClick={() => removeGroup(sIndex)}
                                    className="text-red-500"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-2 ml-5">
                            {section.items.map((item, iIndex) => (
                                <div key={item.id} className="flex items-center gap-2">

                                    {item.imgsrc && (
                                        <img
                                            src={item.imgsrc}
                                            className="rounded w-10 h-10 object-cover"
                                        />
                                    )}

                                    <input
                                        placeholder="Item"
                                        value={item.name}
                                        onChange={(e) =>
                                            updateItem(
                                                sIndex,
                                                iIndex,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 px-3 py-2 border rounded-lg"
                                    />

                                    {!item.imgsrc ? (
                                        <button
                                            onClick={() =>
                                                uploadItemImage(sIndex, iIndex)
                                            }
                                        >
                                            🖼️
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                removeItemImage(sIndex, iIndex)
                                            }
                                        >
                                            <ImageOff size={18} />
                                        </button>
                                    )}

                                    {section.items.length > 1 && (
                                        <button
                                            onClick={() =>
                                                removeItem(sIndex, iIndex)
                                            }
                                            className="text-red-500"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            {section.items.length < 20 && (
                                <button
                                    onClick={() => addItem(sIndex)}
                                    className="text-blue-600 text-sm"
                                >
                                    + Add item
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD GROUP */}
            {sections.length < 8 && (
                <button
                    onClick={addGroup}
                    className="px-4 py-2 border border-dashed"
                >
                    + Add Group
                </button>
            )}

            <button
                onClick={handleSubmit}
                className="bg-blue-600 py-3 rounded-xl w-full text-white"
            >
                Generate Game
            </button>
        </div>
    );
}