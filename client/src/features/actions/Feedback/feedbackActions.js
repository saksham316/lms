import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";


export const sendFeedback= createAsyncThunk(
    "/feedback/sendFeedback", 
    async (payload, {rejectWithValue})=>{
        try{
            const {data}= await instance.post("/feedback", payload,{
                withCredentials: true,
                headers:{
                    'content-type': 'application/json',
                }
            })
            return data;
        }
        catch(error){
            return rejectWithValue(error)
        }
    }
)

