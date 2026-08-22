import React, { useState, useMemo } from "react";
import Code from "../code";

function getRandomIndices(length: number, pick: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, pick);
}

const randomItems = [
  "Um jogo que estive jogando recentemente",
  "Oque quero comprar no futuro próximo",
  "A música presa na minha cabeça",
  "Uma coisa que e me arrependi",
  "Um pensamento aleatório",
];

const quickResponses = [
  "Pokemon prism, uma hack de pokemon baseado na gen 2 na inédita região de naijo.",
  "Uma câmera fotografica",
  "The Vamps - Somebody To You",
  "Um controle que conecta no celular via USB-C",
  "Você é quem seus sentimentos te fazem ser?",
];

const PICK_COUNT = 5;

const Random: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const chosenIndices = useMemo(
    () =>
      randomItems.length <= PICK_COUNT
        ? Array.from({ length: randomItems.length }, (_, i) => i)
        : getRandomIndices(randomItems.length, PICK_COUNT),
    []
  );

  const handleClick = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full mt-12">
      <Code script="./random" />
      <div className="border-t border-stone-800 pt-3">
        <div className="flex flex-col gap-1 text-xs text-stone-400 leading-relaxed">
          {chosenIndices.map((idx) => (
            <div key={randomItems[idx]} className="flex items-start gap-2">
              <a
                className="hover:underline cursor-pointer select-none"
                onClick={() => handleClick(idx)}
              >
                <span className="text-primary text-base">↳ </span>
                {randomItems[idx]}
              </a>
              {openIndex === idx && (
                <span
                  className="ml-2 px-2 mt-1 rounded-sm bg-primarydim text-green-500"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {quickResponses[idx]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Random;
