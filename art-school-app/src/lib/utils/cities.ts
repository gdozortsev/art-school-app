'use server'
import { Program } from "@prisma/client";
import { prisma } from "../prisma";

interface CityCoord {
  lng: number;
  lat: number;
  city: string;
  Program: Program[];
}

export async function getStaticCities(state: string): Promise<CityCoord[] | null> {
  try {
    const schools = await prisma.school.findMany({
      where: {
        state_name: state.toUpperCase()
      },
      select: {
        city: true,
        longitude: true,
        latitude: true,
        Program: true
      }
    });

    // Group by city
    const cityMap = new Map<string, CityCoord>();

    for (const school of schools) {
      const cityKey = school.city ?? "Unknown";
      if (!cityMap.has(cityKey)) {
        cityMap.set(cityKey, {
          lng: Number(school.longitude),
          lat: Number(school.latitude),
          city: cityKey,
          Program: []
        });
      }
      cityMap.get(cityKey)!.Program.push(...school.Program);
    }

    return Array.from(cityMap.values());
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}