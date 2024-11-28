import { useEffect, useState } from "react";
import { Lecture } from "../../../types";
import { fetchAllLectures } from "../../../api/getLectures";

export const useLectures = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    const start = performance.now();
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log(`API 호출 시간: ${end - start}ms`);
      setLectures(results.flatMap((result) => result.data));
    })
  }, []);
  return lectures;
}