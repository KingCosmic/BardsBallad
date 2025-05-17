import React from "react";
import { X } from "lucide-react"; // Optional: Use any icon set

const toastStyles: { [key:string]: string } = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
};

interface Props {
  id: string;
  message: string;
  type: 'success' | 'error';
  onClose(): void
}

const Toast: React.FC<Props> = ({ id, message, type = 'success', onClose }) => {
  return (
    <div className={`rounded-lg shadow-lg px-4 py-3 flex items-center justify-between w-72 ${toastStyles[type]}`}>
      <span>{message}</span>
      <button onClick={onClose}>
        <X className="w-4 h-4 ml-2 opacity-80 hover:opacity-100" />
      </button>
    </div>
  );
};

export default Toast;