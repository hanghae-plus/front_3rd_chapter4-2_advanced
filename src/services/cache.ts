import axios from "axios";
import { Lecture } from "../basic/types";

// 클로저를 이용한 캐시 구현
export const createCachedFetch = () => {
  const cache = new Map<string, Promise<{ data: Lecture[] }>>();

  return (url: string) => {
    if (!cache.has(url)) {
      cache.set(url, axios.get<Lecture[]>(url));
    }
    return cache.get(url)!;
  };
};
