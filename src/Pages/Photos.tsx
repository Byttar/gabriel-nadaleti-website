import React, { useEffect, useState } from "react";
import Code from "../components/code";
import photos from "../components/content/photos/data/photos.json";
import SessionNav from "../components/sessionNav";
import { useNavigate, useParams } from "react-router";
import { assetUrl } from "../utils/loadAsset";

const modalAnim = "animate-fade-in-scale";

const PLACEHOLDER_TITLE = "Sem título";
const PLACEHOLDER_DESCRIPTION =
  "Esta foto ainda não tem uma descrição. Em breve, mais detalhes sobre o momento capturado aqui.";

const PhotosPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<null | typeof photos[0]>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { photoid } = useParams<{photoid: string}>();

  // Add animation when opening the modal
  const handlePhotoClick = (photo: typeof photos[0]) => {
    navigate(`/photos/${photo.id}`);
    setShowModal(false);
    // Force reflow for retriggering the animation if needed
    setTimeout(() => setShowModal(true), 10);
  };

  useEffect(() => {
    const currentPhoto = photos.find(photo => photo.id.toString() === photoid);
    setShowModal(true);
    setSelectedPhoto(currentPhoto as typeof photos[0]);
  }, [photoid]);

  const closeModal = () => {
    setShowModal(false);
    navigate('/photos')
    setTimeout(() => setSelectedPhoto(null), 200);
  };

  return (
    <main className="w-full mt-6 gap-4 flex flex-col">
      <style>{`
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.1s forwards cubic-bezier(0.91, 0.01, 1, 1);
        }
      `}</style>
      <Code script="./Photos" />
      <div className="">
        <h1 className="font-bold text-white text-2xl sm:text-3xl mb-4 pl-0">
          <span className="font-semibold">Todas as Fotos</span>
        </h1>
        <p className="text-stone-400 text-sm -mt-4 mb-5 max-w-2xl">
          Uma galeria com todas as fotos publicadas por Gabriel Nadaleti.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 [&>img]:border [&>img]:border-stone-800 [&>img]:grayscale-100 [&>img]:hover:grayscale-0 [&>img]:transition-all">
          {photos.map((photo: any, idx: number) => (
            <img
              key={idx}
              src={assetUrl(photo.path)}
              alt={photo.title || `Foto ${idx + 1}`}
              title={photo.title}
              className="rounded-sm object-cover w-full aspect-square cursor-pointer"
              loading="lazy"
              onClick={() => handlePhotoClick(photo)}
              style={{ transition: "transform 0.1s cubic-bezier(0.91, 0.01, 1, 1)", willChange: "transform" }}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <SessionNav url="/" link="Voltar ao início" />
        </div>
      </div>
      {selectedPhoto && (
        <div
          className="fixed p-4 inset-0 z-50 bg-black/50 flex items-center justify-center"
          style={{ backdropFilter: "blur(5px)" }}
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`relative flex-col-reverse md:flex-row opacity-0 justify-between outline-none flex bg-black border border-dashed border-stone-600 rounded-lg shadow-lg overflow-hidden ${showModal ? modalAnim : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex pt-0 md:pt-5 sm:max-w-full md:max-w-90 xl:max-w-97.5 flex-col items-center gap-3 p-5 sm:p-6 w-full md:border-r border-dashed border-stone-600 min-w-55">
              <h2 className="text-white text-lg font-semibold leading-snug">
                {selectedPhoto.title || PLACEHOLDER_TITLE}
              </h2>
              <p id="photo-content" className="text-stone-400 text-sm leading-relaxed max-h-40 md:p-0 md:border-0 rounded-md border-dashed border border-primarydim p-4 md:max-h-136.25 overflow-y-auto">
                {selectedPhoto.description || PLACEHOLDER_DESCRIPTION}
              </p>

              <p className="text-stone-600 mt-auto self-start">
              {selectedPhoto.filename}
              </p>
            </div>
            <div className="flex items-center justify-center bg-stone-950 p-4 sm:pt-4 md:pt-6 sm:m-auto sm:w-[80%] md:max-w-[65%] w-full shrink-1">
              <img
                src={assetUrl(selectedPhoto.path)}
                alt={selectedPhoto.title || PLACEHOLDER_TITLE}
                className="max-h-[70vh] xl:min-w-[800px] m-auto max-w-full object-contain rounded-md"
              />
            </div>
            <button
              className="absolute flex justify-center items-center top-2 left-2 text-white bg-black/60 hover:bg-black/90 rounded-full w-8 h-8 text-xl"
              aria-label="Fechar"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PhotosPage;
