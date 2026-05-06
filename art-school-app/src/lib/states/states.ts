"use client"
import { USState} from "@prisma/client"
import axios from "axios";
export const getAllStates = async (options?: {
  state_number?: number;
}): Promise<
  { state: USState[]; } | undefined
> => {
  const { state_number } = options || {};
  try {
    const response = await axios.get(`/api/states`, {
      params: {
        state_number: state_number
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get users: ", error);
  }
};