import axios from 'axios'
import { Lecture } from '../basic/types'
import { useEffect, useCallback, useState } from 'react'

const lectureCache = {
  majors: null as Lecture[] | null,
  liberalArts: null as Lecture[] | null,
}

export const useFetchLecture = () => {
  const [lectures, setLectures] = useState<Lecture[]>([])

  const fetchMajors = useCallback(async () => {
    if (lectureCache.majors) {
      return { data: lectureCache.majors }
    }
    const response = await axios.get<Lecture[]>('/schedules-majors.json')
    lectureCache.majors = response.data
    return response
  }, [])

  const fetchLiberalArts = useCallback(async () => {
    if (lectureCache.liberalArts) {
      return { data: lectureCache.liberalArts }
    }
    const response = await axios.get<Lecture[]>('/schedules-liberal-arts.json')
    lectureCache.liberalArts = response.data
    return response
  }, [])

  // TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
  const fetchAllLectures = useCallback(async () => {
    const start = performance.now()
    console.log('API 호출 시작: ', start)

    try {
      const [majorsResponse, liberalArtsResponse] = await Promise.all([fetchMajors(), fetchLiberalArts()])

      const end = performance.now()
      console.log('모든 API 호출 완료: ', end)
      console.log('API 호출에 걸린 시간(ms): ', end - start)

      setLectures([...majorsResponse.data, ...liberalArtsResponse.data])
    } catch (error) {
      console.error('강의 데이터 불러오기 실패:', error)
      return []
    }
  }, [fetchMajors, fetchLiberalArts])

  useEffect(() => {
    fetchAllLectures()
  }, [fetchAllLectures])

  return { lectures }
}
