import { NextResponse } from 'next/server';
import { getAllProgramsWithUmbrella } from './controller';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const school = searchParams.get("school");
    const umbrella = searchParams.get("category");
    try {
        if(school && umbrella){
            const program = await getAllProgramsWithUmbrella(school, umbrella)
            return NextResponse.json(program);
        }
        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}