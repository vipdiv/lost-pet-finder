"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface ViewerContextType {
  viewerId: string | null;
}

const ViewerContext = createContext<ViewerContextType>({ viewerId: null });

export function useViewer() {
  return useContext(ViewerContext);
}

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [viewerId, setViewerId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("viewerId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("viewerId", id);
    }
    setViewerId(id);
  }, []);

  return (
    <ViewerContext.Provider value={{ viewerId }}>
      {children}
    </ViewerContext.Provider>
  );
}
