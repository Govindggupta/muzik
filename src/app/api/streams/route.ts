import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"

const CreateStreamSchema = z.object({
    createId : z.string(),
    url : z.string(),

})


export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());   
    } catch (error) {
        return NextResponse.json({
            message: "error while streaming a schema",
        }, 
        { status: 411 })
    }
}