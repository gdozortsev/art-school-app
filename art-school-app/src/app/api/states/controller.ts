import { prisma } from "../../../lib/prisma"
import { USState } from "@prisma/client"


export const getAllStatesController = async(): Promise<{
    states: USState[]
}> => {
    try {
        const allStates = await prisma.uSState.findMany({
            orderBy: { state_number: 'asc' },
            include: { School: false }
        });
        return {
            states: allStates
        };
    } catch (error) {
        console.error("Error fetching all states: ", error);
        throw error;
    }
};