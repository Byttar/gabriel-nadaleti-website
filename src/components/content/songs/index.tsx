import React from "react";
import { Link } from "react-router";
import Code from "../../code";
import SessionNav from "../../sessionNav";

const songs = [
  {
    title: "Lift You Up",
    artist: "Gabriel Nadaleti",
    duration: "04:32",
  },
];

type SongItemProps = {
  title: string;
  artist: string;
  duration: string;
};

const SongItem: React.FC<SongItemProps> = ({ title, artist, duration }) => (
  <Link
    to="/songs#play"
    className="flex items-center w-full gap-4 rounded-md px-3 py-3 bg-stone-950 border border-stone-800 hover:border-primary hover:bg-stone-900 transition-colors group"
  >
    <div
      className="flex items-center justify-center w-11 h-11 rounded bg-stone-800 border border-stone-700 text-primary group-hover:scale-105 group-hover:border-primary transition-all duration-100 shrink-0"
      aria-hidden
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="6,4 20,12 6,20" />
      </svg>
    </div>
    <div className="flex flex-col grow min-w-0">
      <span className="truncate text-white font-mono text-sm group-hover:text-primary transition-colors">
        {title}
      </span>
      <span className="text-stone-500 text-xs mt-0.5">{artist}</span>
    </div>
    <span className="text-stone-600 text-xs font-mono min-w-10 text-right shrink-0">
      {duration}
    </span>
  </Link>
);

const Songs: React.FC = () => {
  return (
    <section>
      <Code script="./Songs" />
      <div className="border-t border-stone-800 mt-2 pt-5 pb-2">
        <h2 className="font-bold text-white text-base sm:text-lg mb-0 pl-0">
          <span className="font-semibold">Músicas recentes</span>
        </h2>
        <p className="text-stone-400 text-xs mt-1 mb-4">
          Algumas músicas que eu produzi recentemente.
        </p>
        <div className="flex flex-col gap-3">
          {songs.map((song) => (
            <SongItem
              key={song.title}
              title={song.title}
              artist={song.artist}
              duration={song.duration}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <SessionNav url="/songs" link="Ver tudo" />
          <SessionNav url="https://soundcloud.com/nadaleti" link="SoundCloud" />
        </div>
      </div>
    </section>
  );
};

export default Songs;
