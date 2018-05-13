export function formatDuration (duration) {
  const min = Math.floor(duration / 60);
  let sec = Math.floor(duration % 60);
  sec = sec < 10 ? "0" + sec : sec;
  return `${min}:${sec}`;
}

export function shuffle ([...array]) {
  let length = array.length;
  while (length) {
    const index = Math.floor(Math.random() * length--);
    [array[length], array[index]] = [array[index], array[length]];
  }
  return array;
}

export function cutList (tracks, currentTrack) {
  const index = tracks.findIndex(track => track.title === currentTrack.title) + 1;
  return index > tracks.length - 1 ? [] : [...tracks.slice(index)];
}

export function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

export function getRGBCssFromObject ({r, g, b}) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function pluralize (string, len) {
  return (len > 1 ? string + 's' : string);
}
