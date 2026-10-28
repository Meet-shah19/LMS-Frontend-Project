
function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function LessonPlayer({ lesson }) {
  if (!lesson) {
    return <p>Select a lesson to start learning.</p>;
  }

  const url = lesson.content?.trim() || "";
  const youtubeUrl = getYouTubeEmbedUrl(url);

  return (
    <section className="lesson-player">
      <h2>{lesson.title}</h2>

      {lesson.type === "video" && youtubeUrl && (
        <iframe
          className="lesson-video"
          src={youtubeUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}

      {lesson.type === "video" &&
        !youtubeUrl &&
        /\.(mp4|webm|ogg)(\?.*)?$/i.test(url) && (
          <video className="lesson-video" controls preload="metadata">
            <source src={url} />
            Your browser does not support video playback.
          </video>
        )}

      {lesson.type === "video" && !youtubeUrl &&
        !/\.(mp4|webm|ogg)(\?.*)?$/i.test(url) && (
          <p>
            This video link is not supported. Use a YouTube link or a direct
            MP4, WebM, or OGG video URL.
          </p>
        )}

      {lesson.type === "pdf" && (
        <a href={url} target="_blank" rel="noreferrer">
          Open lesson PDF
        </a>
      )}

      {lesson.type === "text" && (
        <p className="lesson-text">{url}</p>
      )}
    </section>
  );
}