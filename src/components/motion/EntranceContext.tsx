"use client";

import { createContext, useContext } from "react";

type EntranceContextValue = {
  /** True once the splash has finished and the page may reveal. */
  playEntrance: boolean;
};

const EntranceContext = createContext<EntranceContextValue>({
  playEntrance: false,
});

export function EntranceProvider({
  playEntrance,
  children,
}: {
  playEntrance: boolean;
  children: React.ReactNode;
}) {
  return (
    <EntranceContext.Provider value={{ playEntrance }}>
      {children}
    </EntranceContext.Provider>
  );
}

export function useEntrance() {
  return useContext(EntranceContext);
}
