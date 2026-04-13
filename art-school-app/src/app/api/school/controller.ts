import { prisma } from "../../../lib/prisma"
import { School } from "@prisma/client"
import { SchoolWithPrograms } from "@/src/lib/utils/types";


export const getAllSchoolsController = async(): Promise<{
    school: School[]
}> => {
    try {
        const allSchools = await prisma.school.findMany({});
        return {
            school: allSchools
        };
    } catch (error) {
        console.error("Error fetching all schools: ", error);
        throw error;
    }
};

export const getOneSchoolController = async(
    name: string
): Promise<{
    school: SchoolWithPrograms
}> => {
    try {
        const theSchool: SchoolWithPrograms | null = await prisma.school.findUnique({
            where: {school_name: name},
            include: {
                Program: true,
            }
        });
        if (!theSchool) {
            throw new Error("School not found");
        } else {
            return {
                school: theSchool
            };
        }
    } catch (error) {
        console.error("Error fetching all schools: ", error);
        throw error;
    }
};