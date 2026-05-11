"use client"
import { Program} from "@prisma/client"
import axios from "axios";

export const getAllProgramsWithUmbrella = async (options?: {
    school: string;
    umbrella: string;
}): Promise<
  { program: Program[]; } | undefined
> => {
  const { school, umbrella } = options || {};
  try {
    const response = await axios.get(`/api/program`, {
      params: {
        school: school,
        category: umbrella
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get users: ", error);
  }
};