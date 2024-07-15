import { securedAxiosInstance } from "../api";

export const updateUserDetails = async (data) => {    
    try {      
      const res= await securedAxiosInstance.put(`user/updateUserDetails`,data);      
      return res;
    } catch (error) {      
      return error.response;
    }
  };