import axios from 'axios';
import { Lecture } from './types';
import { createCachedFetch } from './apiUtils';

export const cachedFetchMajors = createCachedFetch(() =>
  axios.get<Lecture[]>('/schedules-majors.json')
);

export const cachedFetchLiberalArts = createCachedFetch(() =>
  axios.get<Lecture[]>('/schedules-liberal-arts.json')
);
