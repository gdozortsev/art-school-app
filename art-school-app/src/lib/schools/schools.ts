"use client"
import { School} from "@prisma/client"
import axios from "axios";
import { SchoolWithPrograms } from "@/src/lib/utils/types";

export const getOneSchool = async (options?: {
  school_name: string;
}): Promise<
  { school: SchoolWithPrograms; } | undefined
> => {
  const { school_name } = options || {};
  try {
    const response = await axios.get(`/api/school`, {
      params: {
        school_name: school_name
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get users: ", error);
  }
};

export const getAllSchools = async (): Promise<
  { state: School[]; } | undefined
> => {
  try {
    const response = await axios.get(`/api/school`, {});
    return response.data;
  } catch (error) {
    console.error("Failed to get users: ", error);
  }
};