import instance from '../axiosInstance';

// 운동ID와 request body로 보내는 함수
const baseURL = 'https://dev.bodycheck.store';

export const postExerciseCriteria = async (exerciseId, criteriaData) => {
    try {
      const response = await instance.post(`${baseURL}/solutions/generation/exercise/${exerciseId}`, {
        criteria: criteriaData,
      });

      // 200번 응답일 때 result를 콘솔에 출력
      if (response.status === 200) {
        console.log('Result:', response.data.result);
        return response.data.result; // 화면에서 필요 시 반환
      }
    } catch (error) {
      console.error('Error during POST request:', error.request);
      throw error;
    }
};

// 운동ID와 request body로 보내는 함수 (multipart form-data 형식)
export const postExerciseSolution = async (exerciseId, solutionVideo, criteria, content) => {
    try {
        const formData = new FormData();

        // 비디오 파일 추가 (비디오 파일이 유효할 때만 추가)
        if (solutionVideo !== 'null' && solutionVideo) {
            formData.append('solutionVideo', {
                uri: solutionVideo.uri, // 비디오 파일 경로
                type: 'video/mp4',      // 파일 형식
                name: 'solutionVideo.mp4', // 파일 이름
            });
        }

        // 데이터 추가 (content를 criteriaData에 포함)
        const data = {
            ...criteria,
            content: content,
        };
        formData.append('data', JSON.stringify(data));

        // POST 요청 보내기
        const response = await instance.post(`${baseURL}/solutions/exercise/${exerciseId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // 200번 응답일 때 result를 콘솔에 출력
        if (response.status === 200) {
            console.log('Result:', response.data.result);
            return response.data.result; // 화면에서 필요 시 반환
        }
    } catch (error) {
        console.error('Error during POST request:', error.response);
        throw error;
    }
};
