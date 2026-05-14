'use server'
import { prisma } from "../prisma";
import { SchoolWithPrograms } from "./types";

export async function getStaticAllSchools(): Promise<SchoolWithPrograms[] | null> {
  try {
    const result = await prisma.school.findMany({
        include: {
            Program: true
        }
    });
    return result
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

export async function getStaticAllSchoolsByState(state: string): Promise<SchoolWithPrograms[] | null> {
  try {
    const result = await prisma.school.findMany({
        where: {
          state_name: state.toUpperCase()
        },
        include: {
            Program: true
        }
    });
    return result
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}