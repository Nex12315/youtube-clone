import { Suspense } from "react";
import Video from "./video";

export default function Watch() {
  return (
    <Suspense>
      <Video />
    </Suspense>
  );
}
