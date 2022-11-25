// import axios from "axios";
// import jwtDecode from "jwt-decode";

// export const axiosConfig = axios.create({
//     baseURL: "http://localhost:5000/api/",
//     headers: { "Content-Type": "application/json" },
// });

// // axiosConfig.interceptors.request.use(
// //     (config: any) => {
// //         const token: any = localStorage.getItem("token");
// //         let currentDate = new Date();
// //         const decodedToken = jwtDecode(token);
// //         // console.log(decodedToken)
// //         if()

// //         if (token) {
// //             config.headers.Authorization = `Bearer ${token}`;
// //         }

// //         return config;
// //     },
// //     (error) => Promise.reject(error),
// // );

// const apiService = {
//     get(urlApi: string) {
//         return axiosConfig
//             .post(urlApi)
//             .then((response) => response)
//             .catch((error) => error);
//     },
//     post(urlApi: string, params: any) {
//         return axiosConfig
//             .post(urlApi, params)
//             .then((response) => response)
//             .catch((error) => error);
//     },
//     delete(urlApi: string) {
//         return axiosConfig
//             .delete(urlApi)
//             .then((response) => response)
//             .catch((error) => error);
//     },
// };

// export default apiService;

export {};
