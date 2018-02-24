//import { Component } from 'preact';
import { formatDuration } from '../utils';

const Track = ({
  number, title, duration, manifestURL,
  playlistHLSURL, audio128URL, audio192URL,
  audio256URL, onClick
}) => (
  <div class="track" onClick={onClick}>
    <div class="track__number">{number}</div>
    <div class="track__name">{title}</div>
    <div class="track__is-offline"></div>
    <div class="track__duration">{formatDuration(duration)}</div>
  </div>
);

export default Track;
