import { prisma } from "../../../lib/prisma"
import { Program } from "@prisma/client"

export const getAllProgramsWithUmbrella = async(
    school: string, 
    umbrella: string
): Promise<{
    program: Program[]
}> => {
    try {
        const theProgram: Program[] | null = await prisma.program.findMany({
            where: {school_name: school, umbrella_discipline: umbrella},
        });
        if (!theProgram) {
            throw new Error("Schools not found");
        } else {
            return {
                program: theProgram
            };
        }
    } catch (error) {
        console.error("Error fetching all schools: ", error);
        throw error;
    }
};