import { NextResponse } from 'next/server';
import { getAllSchoolsController, getOneSchoolController, putSchoolController } from './controller';
import { School } from '@prisma/client'

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
export async function PUT(req: Request) {

  try {
    const schoolData: School = await req.json();
    const updatedSchool = putSchoolController(schoolData);
    return NextResponse.json(updatedSchool, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to update school:" + error },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to update school: an unknown error occurred." },
        { status: 500 }
      );
    }
  }
}