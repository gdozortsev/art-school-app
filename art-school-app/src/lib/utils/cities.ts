'use server'
import { prisma } from "../prisma";

interface CityCoord {
  lng: number;
  lat: number;
  city: string;
}

export async function getStaticCities(state: string): Promise<CityCoord[] | null> {
  try {
    const result = await prisma.school.findMany({
        where: {
            state_name: state.toUpperCase()
        },
        select: {
            city: true,
            longitude: true,
            latitude: true,
        }
    });
    console.log(state, result)

    return result.map((curr) => ({
      lng: Number(curr.longitude), 
      lat: Number(curr.latitude),
      city: curr.city ?? "Unknown", // Safe fallback for null cities
    }));
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}