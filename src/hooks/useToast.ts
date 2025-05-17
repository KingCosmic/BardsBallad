import { createContext, useContext } from "react";

export const ToastContext = createContext<any>({});

export const useToast = () => {
  return useContext(ToastContext);
};