import { AILogoPrompt } from "@/configs/AiModel";
import { db } from "@/configs/FirebaseConfig";
import axios from "axios";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import sharp from "sharp";

export const maxDuration = 300;
export async function POST(req) {
  const { prompt, email, title, desc, type, userCredits } = await req.json();
  let base64ImageWithMime = "";

  try {
    //Generate AI Text Prompt for Logo
    const AiPromptResult = await AILogoPrompt.sendMessage(prompt);
    const AIPrompt = JSON.parse(AiPromptResult.response.text()).prompt;

    //Generate Logo From AI Modal
    if (type == "Free") {
      //Free Model 1 : https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
        AIPrompt,
        {
          headers: {
            Authorization: "Bearer " + process.env.HUGGING_FACE_API_KEY,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );
      const buffer = Buffer.from(response.data, "binary");
      const base64Image = buffer.toString("base64");

      base64ImageWithMime = `data:image/png;base64,${base64Image}`;
    } else {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });
      //Replicate API End point
      const output = await replicate.run(
        "bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad",
        {
          input: {
            prompt: AIPrompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "png",
            guidance_scale: 3.5,
            output_quality: 80,
            num_inference_steps: 8,
          },
        }
      );
      base64ImageWithMime = await ConvertImageToBase64(output);

      const docRef = doc(db, "users", email);
      await updateDoc(docRef, {
        credits: Number(userCredits) - 1,
      });
    }

    //save to Firebase Databse
    try {
      await setDoc(doc(db, "users", email, "logos", Date.now().toString()), {
        image: base64ImageWithMime,
        title: title,
        desc: desc,
        id: Date.now(),
      });
    } catch (e) {
      console.log(e);
    }
    return NextResponse.json({ image: base64ImageWithMime });
    //AI logo Image Modal
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

async function ConvertImageToBase64(image) {
  const { data } = await axios.get(image, { responseType: "arraybuffer" });
  const compressedImageBuffer = await sharp(data)
    .resize({ width: 700 }) // Resize image to a smaller width (adjust as needed)
    .jpeg({ quality: 80 }) // Compress image with JPEG format and quality
    .toBuffer();

  return `data:image/jpeg;base64,${compressedImageBuffer.toString("base64")}`;
}
