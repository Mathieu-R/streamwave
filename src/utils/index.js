export function formatDuration (duration) {
  const min = Math.floor(duration / 60);
  let sec = duration % 60;
  sec = sec < 10 ? "0" + sec : sec;
  return `${min}:${sec}`;
}
