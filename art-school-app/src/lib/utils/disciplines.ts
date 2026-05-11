'use server'
import { prisma } from "../prisma";

export async function getStaticDisciplines() {
  try {
    const result = await prisma.program.findMany({
      select: {
        umbrella_discipline: true,
        discipline: true,
      },
      distinct: ['discipline'],
    });

    return result.reduce((acc, curr) => {
      const umbrella = curr.umbrella_discipline || "Other";
      if (!acc[umbrella]) acc[umbrella] = [];
      acc[umbrella].push(curr.discipline);
      return acc;
    }, {} as Record<string, string[]>);
  } catch (error) {
    console.error("Database error:", error);
    return {};
  }
}