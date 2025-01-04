"use client";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { UserDetailContex } from "../_context/UserDetailContext";
import Lookup from "../_data/Lookup";
import Prompt from "../_data/Prompt";
import axios from "axios";
import Image from "next/image";
import { DownloadIcon, LayoutDashboard, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

function GenerateLogo() {
  const { userDetail, setUserDetail } = useContext(UserDetailContex);
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false);
  const [logoImage, setLogoImage] = useState();
  const searchParams = useSearchParams();
  const modelType = searchParams.get("type");
  useEffect(() => {
    if (typeof window != undefined && userDetail?.email) {
      const storage = localStorage.getItem("formData");
      if (storage) {
        setFormData(JSON.parse(storage));
      }
    }
  }, [userDetail]);

  useEffect(() => {
    if (formData?.title?.length > 0) {
      GenerateAILogo();
    }
  }, [formData]);

  useEffect(() => {
    if (typeof window != undefined && logoImage) {
      localStorage.clear();
      //Moved this line of code To avoid Execution of UseEffect Multiple time
      modelType != "Free" &&
        setUserDetail((prev) => ({
          ...prev,
          credits: Number(userDetail.credits) - 1,
        }));
    }
  }, [logoImage]);

  const GenerateAILogo = async () => {
    if (modelType != "Free" && userDetail?.credits <= 0) {
      toast("Not enought credits!!!");
      return;
    }

    setLoading(true);
    const PROMPT = Prompt.LOGO_PROMPT.replace("{logoTitle}", formData?.title)
      .replace("{logoDesc}", formData?.desc)
      .replace("{logoColor}", formData.palette)
      .replace("{logoIdea}", formData?.idea)
      .replace("{logoDesign}", formData?.design?.title)
      .replace("{logoPrompt}", formData?.design?.prompt);

    //Generate Logo Prompt from AI
    //Generate Logo Image
    const result = await axios.post("/api/ai-logo-model", {
      prompt: PROMPT,
      email: userDetail?.email,
      title: formData.title,
      desc: formData.desc,
      type: modelType,
      userCredits: userDetail?.credits,
    });

    setLogoImage(result.data?.image);
    setLoading(false);
  };

  const onDownload = () => {
    const imageWindow = window.open();
    imageWindow.document.write(`<img src="${logoImage}" alt="Base64 Image" />`);
  };

  return (
    <Suspense>
      <div className="mt-16 flex flex-col items-center justify-center ">
        {/* <h2>{loading&&'Loading...'}</h2>
      {!loading&&<Image src={logoImage} alt='logo' width={200} height={200} />} */}

        <h2 className="font-bold text-3xl text-primary">
          {Lookup.LoadingWaitTitle}
        </h2>
        {loading && (
          <div className="flex flex-col items-center mt-2">
            <p className="text-xl text-gray-500">{Lookup.LoadingWaitDesc}</p>
            <LoaderIcon className="animate-spin" />
            <Image
              src={"/loading.gif"}
              alt="loading"
              width={200}
              height={200}
              className="mt-6"
            />
            <h2 className="mt-2 font-medium text-2xl text-gray-500">
              Do Not Refresh!
            </h2>
          </div>
        )}

        {logoImage && (
          <div className="mt-5">
            <Image
              src={logoImage}
              alt="logo"
              width={300}
              height={300}
              className="rounded-xl"
            />

            <div className="mt-4 flex items-center gap-5">
              <Button onClick={() => onDownload()}>
                {" "}
                <DownloadIcon /> Download
              </Button>
              <Link href={"/dashboard"}>
                <Button variant="outline">
                  {" "}
                  <LayoutDashboard /> Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}

export default GenerateLogo;
