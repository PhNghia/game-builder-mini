import React from "react";
import { useLocation, useParams, useNavigate, Outlet } from "react-router-dom";

const steps = [
    "Chọn trò chơi",
    "Nhập nội dung",
    "Review",
];

export default function CreateLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    // xác định step theo route
    let currentStep = 0;

    if (location.pathname.includes("/input")) currentStep = 1;
    if (location.pathname.includes("/review")) currentStep = 2;

    return (
        <div className="bg-blue-50 min-h-screen">
            {/* Stepper */}
            <div className="flex justify-center items-center mb-8">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                                index === currentStep
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-600"
                            }`}
                        >
                            {step}
                        </div>

                        {index < steps.length - 1 && (
                            <div className="bg-blue-200 mx-2 w-10 h-1"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white shadow p-6 rounded-2xl">
                <Outlet/>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                {currentStep > 0 && (
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 px-4 py-2 rounded-xl"
                    >
                        Back
                    </button>
                )}
            </div>
        </div>
    );
}