import React from "react";
import Visual from "./visual";

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  return <Visual />
};

export default AudioPlayer;
