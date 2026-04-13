import { NextResponse } from 'next/server';
import { getAllSchoolsController } from './controller';
import { getOneSchoolController } from './controller';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const school_name = searchParams.get("school_name");
    try {
        if(school_name){
            const school = await getOneSchoolController(school_name)
            return NextResponse.json(school);
        }
        const allSchools = await getAllSchoolsController();
        return NextResponse.json(allSchools);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}