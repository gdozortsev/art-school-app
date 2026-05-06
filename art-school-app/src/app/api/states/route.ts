import { NextResponse } from 'next/server';
import { getAllStatesController } from './controller';

export async function GET() {
  try {
    const allStates = await getAllStatesController();
    return NextResponse.json(allStates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}