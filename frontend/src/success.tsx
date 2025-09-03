import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const Success: FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // navigate back to registration if needed
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-emerald-500 shadow-lg rounded-xl p-6 w-80 text-center">
        <p className="text-white text-lg font-semibold">
          File Uploaded and Registered Successfully
        </p>

        <button
          onClick={handleBack}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Back to Registration
        </button>
      </div>
    </div>
  );
};

export default Success;
