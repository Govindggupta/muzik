import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId : z.string()
})

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    // you can rid of db call here

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? "",
        }
    })

    if (!user) {
        return NextResponse.json({
            message: "User not found",
        }, { status: 404 });
        
    }
    try {
        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where: {
                userId_streamId: {
                userId: user.id,
                streamId: data.streamId,}
            }
        })
        return NextResponse.json({
            message: "upvotd"
        });
    } catch (error) {
        return NextResponse.json({
            message : "error while upvoting"
        }, { status: 403 });
    }
    
}

