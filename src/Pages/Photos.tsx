// this page was all generated using the free tier of the inline edit prompt bar from Cursor
import React, { useEffect, useMemo, useState } from "react";
import Code from "../components/code";
import photos from "../components/content/photos/data/photos.json";
import SessionNav from "../components/sessionNav";
import { useNavigate, useParams } from "react-router";
import { assetUrl } from "../utils/loadAsset";
import { TypingEffect } from "../components/typeReactNode";
import Type from "../components/type";
import { useTypingPersistentTitle } from "../hooks/usePersistText";

const modalAnim = "animate-fade-in-scale";

const PLACEHOLDER_TITLE = "Sem título";
const PLACEHOLDER_DESCRIPTION =
  "Esta foto ainda não tem uma descrição. Em breve, mais detalhes sobre o momento capturado aqui.";

// Memoization helper for getting photo description content
function getDescriptionContent(photo: typeof photos[0] | null): string {
  if (!photo) return PLACEHOLDER_DESCRIPTION;
  return photo.description || PLACEHOLDER_DESCRIPTION;
}

function parseDescriptionFormat(desc: string): React.ReactNode {
  if (!desc) return null;
  let working = desc;
  const boldRegex = /\*\*(.+?)\*\*/g;
  let elements: (string | React.ReactNode)[] = [];
  let match;
  let boldResults: { start: number; end: number; content: string }[] = [];
  while ((match = boldRegex.exec(working)) !== null) {
    boldResults.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1],
    });
  }

  if (boldResults.length === 0) {
    return parseItalics(working);
  }

  let prevEnd = 0;
  for (let i = 0; i < boldResults.length; i++) {
    const { start, end, content } = boldResults[i];
    if (start > prevEnd) {
      elements.push(parseItalics(working.slice(prevEnd, start)));
    }
    elements.push(<b key={`b-${i}`}>{parseItalics(content)}</b>);
    prevEnd = end;
  }
  if (prevEnd < working.length) {
    elements.push(parseItalics(working.slice(prevEnd)));
  }
  return elements;

  function parseItalics(text: string): React.ReactNode {
    const italicsRegex = /_(.+?)_/g;
    let elems: (string | React.ReactNode)[] = [];
    let matchI;
    let i = 0;
    let lastI = 0;
    while ((matchI = italicsRegex.exec(text)) !== null) {
      if (matchI.index > lastI) {
        elems.push(text.slice(lastI, matchI.index));
      }
      elems.push(<i key={`i-${i}`}>{matchI[1]}</i>);
      lastI = matchI.index + matchI[0].length;
      i++;
    }
    if (lastI < text.length) {
      elems.push(text.slice(lastI));
    }
    return elems.length === 1 ? elems[0] : elems.filter(e => e !== "");
  }
}

// Type for slide item: { path: string, filename: string }
type Slide = { path: string; filename: string };

const PhotosPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<null | typeof photos[0]>(null);
  const [showModal, setShowModal] = useState(false);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [slideFilename, setSlideFilename] = useState<string | undefined>(undefined);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const navigate = useNavigate();
  const { photoid } = useParams<{ photoid: string }>();

  // Memoized description content for TypingEffect, so it only types once per photo change
  const descriptionString = useMemo(() => getDescriptionContent(selectedPhoto), [selectedPhoto?.id]);
  const parsedDescription = useMemo(() => parseDescriptionFormat(descriptionString), [descriptionString]);

  // Get all unique tags from all photos
  const allTags: string[] = useMemo(() => {
    const tagsSet = new Set<string>();
    for (const photo of photos) {
      if (Array.isArray(photo.tags)) {
        for (const tag of photo.tags) {
          tagsSet.add(tag);
        }
      }
    }
    return Array.from(tagsSet).sort();
  }, []);

  // Filter photos by activeTag if set
  const filteredPhotos = useMemo(() => {
    if (!activeTag) return photos;
    return photos.filter(
      (photo) => Array.isArray(photo.tags) && photo.tags.includes(activeTag)
    );
  }, [activeTag]);

  // Helper: returns array of all slide objects ({path, filename}) for the selected photo
  function getPhotoSlides(photo: typeof photos[0] | null): Slide[] {
    if (!photo) return [];
    // If groupedPhotos (now array of {path, filename}) exists and is non-empty, first is main path
    if (Array.isArray(photo.groupedPhotos) && photo.groupedPhotos.length > 0) {
      // Remove duplicates by filename (should be unique)
      const allSlides: Slide[] = [
        { path: photo.path, filename: photo.filename },
        ...photo.groupedPhotos,
      ];
      // Remove duplicates: eg, if photo.path/filename is also in groupedPhotos
      const uniqueSlides: Slide[] = [];
      const filenames = new Set<string>();
      for (const s of allSlides) {
        if (!filenames.has(s.filename)) {
          uniqueSlides.push(s);
          filenames.add(s.filename);
        }
      }
      return uniqueSlides;
    }
    return [{ path: photo.path, filename: photo.filename }];
  }

  // On click, open modal and reset sliderIdx and filename
  const handlePhotoClick = (photo: typeof photos[0]) => {
    navigate(`/photos/${photo.id}`);
    setShowModal(false);
    setTimeout(() => setShowModal(true), 10);
    setSliderIdx(0);
    setSlideFilename(photo.filename);
  };

  // When modal opens (or photoid changes), load fresh photo, reset sliderIdx and filename
  useEffect(() => {
    const currentPhoto = photos.find(photo => photo.id.toString() === photoid);
    setShowModal(true);
    setSelectedPhoto(currentPhoto as typeof photos[0]);
    setSliderIdx(0);
    setSlideFilename(currentPhoto?.filename);
  }, [photoid]);

  // When sliderIdx changes, update slideFilename
  useEffect(() => {
    if (selectedPhoto) {
      const slides = getPhotoSlides(selectedPhoto);
      if (slides[sliderIdx]) {
        setSlideFilename(slides[sliderIdx].filename);
      }
    }
  }, [sliderIdx, selectedPhoto]);

  const closeModal = () => {
    setShowModal(false);
    navigate('/photos');
    setTimeout(() => setSelectedPhoto(null), 200);
    setSliderIdx(0);
    setSlideFilename(undefined);
  };

  // Slide navigation
  function handleSlide(dir: number) {
    if (selectedPhoto) {
      const slides = getPhotoSlides(selectedPhoto);
      setSliderIdx(prev =>
        (prev + dir + slides.length) % slides.length
      );
    }
  }

  // Photo-to-photo navigation inside the modal
  function handleModalPhotoNav(dir: number) {
    if (!selectedPhoto) return;
    // Find index of current photo in filteredPhotos
    const currentIdx = filteredPhotos.findIndex(
      (p) => p.id === selectedPhoto.id
    );
    if (currentIdx === -1) return;
    let nextIdx = (currentIdx + dir + filteredPhotos.length) % filteredPhotos.length;
    const nextPhoto = filteredPhotos[nextIdx];
    if (nextPhoto) {
      navigate(`/photos/${nextPhoto.id}`);
      // Modal and effects will reload the correct photo state
    }
  }

  const [title] = useTypingPersistentTitle("Minha Galeria");

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
          {title}
        </h1>
        <Type delay={500} speed={20} text="Uma galeria com todas as minhas fotos, mostrando um pouco do meu ponto de vista. Pra mim, existe muita beleza no mundo, você só precisa estar disposto a enxergar" className="inline-block text-stone-400 text-sm mb-5 max-w-2xl" />
        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={
                "px-3 py-1 rounded border border-stone-700 text-sm font-semibold transition-colors " +
                (activeTag === null
                  ? "bg-primary text-black border-primary"
                  : "bg-stone-900 text-white hover:bg-stone-700")
              }
            >
              Todas
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={
                  "px-3 py-1 rounded border border-stone-700 text-sm font-semibold transition-colors " +
                  (activeTag === tag
                    ? "bg-primary text-black border-primary"
                    : "bg-stone-900 text-white hover:bg-stone-700")
                }
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 [&>img]:border [&>img]:border-stone-800 [&>img]:grayscale-100 [&>img]:hover:grayscale-0 [&>img]:transition-all">
          {filteredPhotos
            .slice() // prevent in-place mutation
            .reverse()
            .map((photo: any, idx: number) => (
              <img
                key={idx}
                src={assetUrl(photo.path)}
                alt={photo.title || `Foto ${idx + 1}`}
                title={photo.title}
                className="rounded-sm object-cover w-full aspect-square cursor-pointer"
                loading="lazy"
                onClick={() => handlePhotoClick(photo)}
                style={{
                  transition:
                    "transform 0.1s cubic-bezier(0.91, 0.01, 1, 1)",
                  willChange: "transform",
                }}
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
              <p id="photo-content" className="w-full xs:h-25 xs:min-w-auto md:min-w-[340px] md:h-auto whitespace-pre-line text-stone-400 text-sm leading-relaxed max-h-40 md:p-0 md:border-0 rounded-md border-dashed border border-primarydim p-4 md:max-h-136.25 overflow-y-auto">
                <TypingEffect speed={10} key={selectedPhoto?.id}>
                  {parsedDescription}
                </TypingEffect>
              </p>
              {/* Tags in modal */}
              {Array.isArray(selectedPhoto.tags) && selectedPhoto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 w-full">
                  {selectedPhoto.tags.map((tag: string) => (
                    <span
                      className="px-2 py-0.5 rounded bg-primary/80 text-black text-xs font-semibold border border-primary"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-stone-600 mt-auto self-start">
                {slideFilename || selectedPhoto.filename}
              </p>
              {/* Modal Photo (Not Slide) Navigation Buttons */}
              <div className="flex gap-2 mt-5 self-center">
                <button
                  className="px-4 py-1 cursor-pointer rounded border border-stone-700 bg-stone-900 text-white hover:bg-stone-800 transition-all text-sm"
                  onClick={() => handleModalPhotoNav(-1)}
                >
                  Anterior
                </button>
                <button
                  className="px-4 py-1 cursor-pointer rounded border border-stone-700 bg-stone-900 text-white hover:bg-stone-800 transition-all text-sm"
                  onClick={() => handleModalPhotoNav(1)}
                >
                  Próximo
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-stone-950 p-4 sm:pt-4 md:pt-4 sm:m-auto sm:w-[80%] md:max-w-[65%] w-full shrink relative">
              {(() => {
                const slides = getPhotoSlides(selectedPhoto);
                const showSlider = slides.length > 1;
                return (
                  <>
                    {/* Slider arrows */}
                    {showSlider && (
                      <>
                        <button
                          className="absolute top-1/2 left-6 z-10 -translate-y-1/2 text-2xl text-white bg-black/40 hover:bg-black/70 rounded-full w-9 h-9 flex items-center justify-center"
                          aria-label="Anterior"
                          onClick={() => handleSlide(-1)}
                          tabIndex={0}
                          style={{ outline: "none", border: "none" }}
                        >
                          &#8592;
                        </button>
                        <button
                          className="absolute top-1/2 right-6 z-10 -translate-y-1/2 text-2xl text-white bg-black/40 hover:bg-black/70 rounded-full w-9 h-9 flex items-center justify-center"
                          aria-label="Próxima"
                          onClick={() => handleSlide(1)}
                          tabIndex={0}
                          style={{ outline: "none", border: "none" }}
                        >
                          &#8594;
                        </button>
                      </>
                    )}
                    <img
                      src={assetUrl(slides[sliderIdx]?.path)}
                      alt={selectedPhoto.title || PLACEHOLDER_TITLE}
                      className="max-h-[70vh] lg:min-w-[645px] m-auto max-w-full object-contain rounded-md"
                    />
                    {showSlider && (
                      <div className="absolute cursor-pointer bottom-6 left-0 right-0 flex justify-center gap-2">
                        {slides.map((slide, i) => (
                          <span
                            onClick={() => handleSlide(i - sliderIdx)}
                            key={slide.filename}
                            className={
                              "inline-block w-2 h-2 rounded-full p-1 " +
                              (i === sliderIdx
                                ? "bg-primary shadow"
                                : "bg-white/30")
                            }
                            style={{
                              border:
                                i === sliderIdx
                                  ? "1.5px solid #fff"
                                  : undefined,
                              transition: "background 0.2s",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
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
