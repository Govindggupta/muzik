import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
//@ts-ignore
import youtubesearchapi from "youtube-search-api"

const Yt_REGEX = new RegExp(
    "^(https?://)?(www\\.)?(youtube\\.com|youtu\\.?be)/.+$"
);

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = Yt_REGEX.test(data.url);

        if (!isYt) {
            return NextResponse.json(
                {
                    message: "invalid url",
                },
                {
                    status: 411,
                }
            );
        }

        const extractedId = data.url.split("v=")[1]?.split("&")[0];

        const videoInfo = await youtubesearchapi.GetVideoDetails(extractedId)

        const thumbnails = videoInfo.thumbnail.thumbnails;
        thumbnails.sort(((a : {width : number} , b : {width : number}) => a.width < b.width ? -1 : 1));

        
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId, 
                url: data.url,
                type: 'Youtube',
                extractedId,
                title: videoInfo.title ?? "Can't find Video",
                smallImg:( thumbnails.length > 1 ? thumbnails[thumbnails.length -2].url : thumbnails[0].url) ?? "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2023/11/25-1.png",
                bigImg: thumbnails[thumbnails.length -1].url ?? "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2023/11/25-1.png"
            }
        });

        

        return NextResponse.json({
            message: "stream created",
            id : stream.id,
            extractedId
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: "error while streaming a schema",
            },
            { status: 411 }
        );
    }
}


export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId"); 
    const streams = await prismaClient.stream.findMany({
    where:{
        userId: creatorId ?? "" 
    }})

    return NextResponse.json({
        streams
    })
}