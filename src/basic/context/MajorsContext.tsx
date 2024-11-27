import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Lecture, MajorsContextType } from "../types";

const MajorsContext = createContext<MajorsContextType | null>(null)

export const MajorsProvider = ({ children }: { children: React.ReactNode }) => {
  const [majorsMap, setMajorsMap] = useState<Map<string, string>>(new Map())

  const addMajors = useCallback((lectures: Lecture[]) => {
    const newMajors = new Map<string, string>();

    lectures.forEach(lecture => {
      if (lecture?.major) {
        const cleanedMajor = lecture.major.replace(/<p>/gi, ' ').trim();
        newMajors.set(lecture.major, cleanedMajor);
      }
    });
    setMajorsMap(newMajors);
  }, []);

  const getMajorLabel = useCallback((major: string) => 
    majorsMap.get(major) || major, 
    [majorsMap]
  );

  const value = useMemo(() => ({
    majors: majorsMap,
    addMajors,
    getMajorLabel,
  }), [majorsMap, addMajors, getMajorLabel]);

  return (
    <MajorsContext.Provider value={value}>
      {children}
    </MajorsContext.Provider>
  );
}

export const useMajorsContext = () => {
  const context = useContext(MajorsContext);
  if (!context) {
    throw new Error("useMajorsContext must be used within a MajorsProvider");
  }
  return context;
}