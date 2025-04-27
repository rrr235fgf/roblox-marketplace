import { replicate } from "@ai-sdk/replicate"
import { experimental_generateImage as generateImage } from "ai"

export async function POST(req: Request) {
  try {
    const { username } = await req.json()

    if (!username) {
      return Response.json(
        {
          success: false,
          error: "اسم المستخدم مطلوب",
        },
        {
          status: 400,
        },
      )
    }

    const { image } = await generateImage({
      model: replicate.image("recraft-ai/recraft-v3-svg"),
      prompt: `Roblox character with username ${username}, digital art style, vibrant colors, game character, full body portrait`,
    })

    // Convert Uint8Array to string
    const svgString = new TextDecoder().decode(image.uint8Array)

    // Remove width and height attributes from the SVG
    const cleanedSvg = svgString.replace('width="1024"', 'width="100%"').replace('height="1024"', 'height="100%"')

    return Response.json({
      success: true,
      svg: cleanedSvg,
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        success: false,
        error: "فشل في إنشاء الصورة",
      },
      {
        status: 500,
      },
    )
  }
}
