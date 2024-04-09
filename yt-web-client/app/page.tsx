import { getVideos } from "./firebase/functions";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {videos.map((video) => (
        <Link href={`/watch?v=${video.filename}`} key={video.id}>
          <Image
            src={"/thumbnail.png"}
            alt="video"
            width={120}
            height={80}
            className={styles.thumbnail}
          />
        </Link>
      ))}
    </main>
  );
}

// For caching fix
export const revalidate = 30;
