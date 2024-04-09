"use client";

import { useSearchParams } from "next/navigation";

export default function Video() {
  const videoPredix = "https://storage.googleapis.com/nex-yt-processed-videos/";
  const videoSrc = useSearchParams().get("v");

  return (
    <div>
      <h1>Watch Page</h1>
      <video controls src={videoPredix + videoSrc} />
    </div>
  );
}
