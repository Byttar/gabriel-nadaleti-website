import React, { useState, useRef, useEffect } from "react";
import Code from "../components/code";
import SessionNav from "../components/sessionNav";
import Visual from "../components/audioplayer/visual"; // Import the visual component
import { useLocation, useNavigate } from "react-router";
import { assetUrl } from "../utils/loadAsset";

const songs = [
  {
    title: "Lift You Up",
    artist: "Gabriel Nadaleti",
    src: "/songs/lift_you_up.mp3",
  }
];

// Helper to format seconds to m:ss
const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const SongsPage: React.FC = () => {
  const [selectedSongIdx, setSelectedSongIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load new song: reset play/pause, progress, current time, get duration
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;

      if(location.hash == "play") {
        setTimeout(() => {
          audio.play();
        }, 200);
      }
    }
  }, [selectedSongIdx]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    navigate('#play')
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleClickSong = (idx: number) => {
    if(selectedSongIdx === idx) {
      togglePlayPause();
      return;
    }
    setSelectedSongIdx(idx);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 70 : 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
      setCurrentTime(duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [duration]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = (parseFloat(e.target.value) / 100) * (audio.duration || 0);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(e.target.valueAsNumber);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  return (
    <main className="w-full mt-6 gap-4 flex flex-col">
      <Code script="./Songs" />
      <h1 className="font-bold text-white text-2xl sm:text-3xl mb-4">
        <span className="font-semibold">Minhas Músicas</span>
      </h1>
      <p className="text-stone-400 text-sm -mt-4 mb-5 ">
        Algumas músicas (talvez uma), que eu produzi. As vezes passa um tempo e eu começo a odia-las <br/>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between border-b border-dashed border-stone-800 pb-6">
        <div className="flex md:mt-0 mt-4 flex-col gap-4 w-full max-w-xs">
          {songs.map((song, idx) => (
            <button
              key={song.src}
              className={`flex items-center cursor-pointer w-full gap-4 rounded-md px-3 py-2 ${
                selectedSongIdx === idx
                  ? "bg-stone-900 border border-primary border-2"
                  : "bg-stone-950 border border-stone-800"
              } transition-colors group`}
              onClick={() => handleClickSong(idx)}
              style={{ textAlign: "left" }}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded bg-stone-800 ${
                  selectedSongIdx === idx ? "border-2 border-primary" : "border border-stone-700"
                } text-primary group-hover:scale-105 transition-transform duration-100`}
                aria-label={`Play ${song.title}`}
              >
                <span className="material-icons text-2xl">
                  {(isPlaying && selectedSongIdx === idx) ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="5" width="4" height="14" rx="1.5"/>
                      <rect x="14" y="5" width="4" height="14" rx="1.5"/>
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  )}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`truncate text-white font-mono text-base ${selectedSongIdx === idx ? 'font-bold' : ''}`}>
                  {song.title}
                </span>
                <span className="text-stone-500 text-xs">{song.artist}</span>
                <span className="text-stone-600 text-xs">
                  {duration && selectedSongIdx === idx
                    ? formatTime(duration)
                    : (selectedSongIdx === idx ? "--:--" : "")}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="grow flex flex-col items-start justify-start min-w-65 md:pl-15">
          <div ref={containerRef} className="border-3 border-primary w-full min-h-63">
            <Visual width={containerRef.current?.clientWidth}/>
          </div>
          <div className="w-full flex flex-col gap-1 mt-4">
            <audio
              id="my-audio"
              ref={audioRef}
              src={assetUrl(songs[selectedSongIdx].src)}
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
            />
            <div className="flex items-center gap-3 w-full mt-1">
              <button
                onClick={togglePlayPause}
                className="flex-none cursor-pointer rounded-full w-10 h-10 bg-stone-800 flex items-center justify-center text-primary focus:outline-none shadow border border-stone-700 hover:bg-primary/20 transition"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" rx="1.5"/>
                    <rect x="14" y="5" width="4" height="14" rx="1.5"/>
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                className="grow accent-primary h-1 rounded-lg"
                min={0} max={100}
                step={0.2}
                value={progress}
                onChange={handleSeek}
                aria-label="Seek"
              />
            </div>
            <div className="flex w-full justify-between text-xs mt-1 text-stone-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : "--:--"}</span>
            </div>
          </div>
          <div className="mt-3 text-center w-full">
            <span className="text-white font-mono text-sm font-bold">
              {songs[selectedSongIdx].title}
            </span>
            <div className="text-stone-500 text-xs">{songs[selectedSongIdx].artist}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <SessionNav url="/" link="Voltar ao início" />
      </div>
    </main>
  );
};

export default SongsPage;
