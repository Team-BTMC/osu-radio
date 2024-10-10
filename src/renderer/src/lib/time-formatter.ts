export default function formatTime(ms: number): string {
  const seconds = Math.round(ms / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${prependZero(minutes % 60)}:${prependZero(seconds % 60)}`;
  }

  return `${minutes}:${prependZero(seconds % 60)}`;
}

function prependZero(n: number): string {
  if (n < 10) {
    return "0" + n;
  }

  return String(n);
}
