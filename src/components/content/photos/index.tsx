import React from "react";
import Code from "../../code";
import photos from "./data/photos.json"
import SessionNav from "../../sessionNav";
import { Link } from "react-router";

const Photos: React.FC = () => {
  return (
    <section>
      <Code script="./Photos" />
      <div className="border-t border-stone-800 mt-2 pt-5 pb-2">
        <h2 className="font-bold text-white text-base sm:text-lg mb-0 pl-0">
          <span className="font-semibold">Fotos recentes</span>
        </h2>
        <p className="text-stone-400 text-xs mt-1 mb-2">
          Uma seleção de fotos que tirei recentemente.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-3 md:gap-2 [&>a>img]:border [&>a>img]:border-stone-800 [&>a>img]:grayscale-50 md:[&>a>img]:grayscale-100 [&>a>img]:hover:grayscale-0 [&>a>img]:transition-all">
        {photos.slice(photos.length - 8, photos.length).reverse().map((photo: any, idx: number) => (
          <Link to={`/photos/${photo.id}`}>
            <img
              key={idx}
              src={photo.path}
              alt={photo.title || `Foto ${idx + 1}`}
              title={photo.title}
              className="rounded-sm object-cover w-full aspect-square"
              loading="lazy"
            />
          </Link>
        ))}
        </div>
        <div className="mt-4">
         {photos.length > 8 && <SessionNav url={"/photos"} link="Ver tudo" />}
        </div>
      </div>
    </section>
  );
};

export default Photos;
