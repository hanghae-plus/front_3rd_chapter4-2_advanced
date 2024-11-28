import axios from "axios";
import { createCachedApiCall } from "../lib/api/createCachedApiCall";
import { Lecture } from "../types";

export const fetchMajors = createCachedApiCall(() =>
  axios.get<Lecture[]>("/schedules-majors.json")
);
export const fetchLiberalArts = createCachedApiCall(() =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json")
);

export const fetchAllLectures = () => {
  const promises = [
    fetchMajors(),
    fetchLiberalArts(),
    fetchMajors(),
    fetchLiberalArts(),
    fetchMajors(),
    fetchLiberalArts(),
  ];

  promises.forEach((_, index) => {
    console.log(`API Call ${index + 1}`, performance.now());
  });

  return Promise.all(promises);
};