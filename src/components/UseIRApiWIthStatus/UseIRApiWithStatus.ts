
import { useState } from 'react';
// import { apiService } from '@/services/imageRecognitionService';
import axios, { AxiosRequestConfig } from 'axios';

// export function useApiWithStatus<T>(
//   url: string,
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE',
//   data?: unknown
// ) {
//   const [response, setResponse] = useState<T | null>(null);
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); // 0: Loading, 1: Success, 2: Error

//   const fetchData = async () => {
//     setStatus('loading'); // Set loading
//     try {
//       const result = await apiService[method.toLowerCase()](url, data);

//       console.log(result)
//       setResponse(result);
//       setStatus('success'); // Success
//     } catch {
//       setStatus('error'); // Error
//     }
//   };

//   return { response, status, fetchData };
// };

const convertImageUrlToFormData = async (imageBlob: Blob, fileName = 'activityLog.png'): Promise<FormData> => {
    try {
      // Fetch the image as a Blob
    
        // Create a FormData object and append the Blob as a File
        const formData = new FormData();
        const file = new File([imageBlob], fileName, { type: imageBlob.type });
        formData.append('image', file);
  
        return formData;
    } catch (error) {
      console.error('Error converting image URL to FormData:', error);
      throw error;
    }
  };

interface ActivityLogResponse {
    message: {
        data: {
          [key: string]: {
            rowName: string;
            rowValue: number;
          };
        };
      };
}

// interface ActivityLogError {
//     response: {
//         data: {
//             message: {
//                 error: string
//             }
//         }
//     }
// }

export const useActivityLogApiWithStatus = () => {
        const [response, setResponse] = useState<ActivityLogResponse | null>(null);
        const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
      
        const fetchData = async (imgUrl: Blob) => {
          setStatus('loading');

          const imageFormData = await convertImageUrlToFormData(imgUrl)
      
          try {
            // Construct Axios config for a POST request
            const config: AxiosRequestConfig = {
              method: 'POST',
              url: `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE_RECOGNITION_API}api/v1/process/player-activity`, // Use the hardcoded URL
              data: imageFormData,
              headers: imageFormData instanceof FormData
                ? { 'Content-Type': 'multipart/form-data' }
                : undefined,
            };
      
            // Perform Axios request
            const result = await axios(config);
      
            setResponse(result.data);
            setStatus('success');
          } catch {
            setStatus('error');
          }
        };
      
        return { response, status, fetchData };
      };