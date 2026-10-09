export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

export function getVideoEmbedUrl(url: string, startSeconds?: number): string {
  if (!url) return "";

  // YouTube match: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    let embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    if (startSeconds && startSeconds > 0) {
      embed += `&start=${Math.floor(startSeconds)}`;
    }
    return embed;
  }

  // Vimeo match: vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    let embed = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    if (startSeconds && startSeconds > 0) {
      embed += `#t=${Math.floor(startSeconds)}s`;
    }
    return embed;
  }

  // Bunny stream match: iframe.mediadelivery.net/embed/LIB_ID/VIDEO_ID
  const bunnyMatch = url.match(/iframe\.mediadelivery\.net\/embed\/([^\/]+)\/([^\/?]+)/);
  if (bunnyMatch && bunnyMatch[1] && bunnyMatch[2]) {
    let embed = `https://iframe.mediadelivery.net/embed/${bunnyMatch[1]}/${bunnyMatch[2]}?autoplay=true`;
    if (startSeconds && startSeconds > 0) {
      embed += `&t=${Math.floor(startSeconds)}`;
    }
    return embed;
  }

  // Fallback if URL is already an embed URL
  if (url.includes("embed") || url.includes("player")) {
    if (startSeconds && startSeconds > 0) {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}start=${Math.floor(startSeconds)}`;
    }
    return url;
  }

  return url;
}

