// @ts-nocheck
import { P5Canvas, type P5CanvasInstance } from "@p5-wrapper/react";
import P5 from "p5";
import { memo } from "react";

(window as any).p5 = P5;
await import("p5.sound");

function sketch(p5: P5CanvasInstance, file: string, width?: number) {
  const config = {
    width: (width - 4) ?? 538,
    height: 250
  }

  let fft;
  let mySound;
  const chars = [ "▓", "#", "0", "%", "◆", "▲", "▪", "•", "·", ":", ".", " " ];
  const definition = 6;
  const bassIndexes = [0,1,2,3,4,5];
  const THEME_COLOR_RGB = [0, 255, 136];
  let sourceNode;

  const getBassAndNormalize = (index, spectrum, softThreshold) => {
    const relativeIndex = index / definition;

    if(bassIndexes.includes(relativeIndex)) {
      return spectrum[relativeIndex] * 0.4 // Tune down low frequencies;
    }

    if(relativeIndex + 1 > bassIndexes.length - 1 && relativeIndex < (softThreshold + bassIndexes.length)) {
      return p5.lerp(spectrum[index], spectrum[relativeIndex], 0.3)
    }

    return spectrum[index];
  }

  p5.mousePressed = () => {
    if (p5.getAudioContext().state === 'suspended') {
      p5.userStartAudio();
    }
  }

  p5.setup = async () => {
    const cnv = p5.createCanvas(config.width, config.height);
    fft = new P5.FFT(1024);

    const audioElement = document.getElementById('my-audio');

    const context = p5.getAudioContext();
    sourceNode = context.createMediaElementSource(audioElement);
    sourceNode.connect(context.destination);

    fft.setInput(sourceNode);

    p5.pixelDensity(1);
  }

  const normalizeAmplitude = (amp, i) => Math.min(amp + (amp * (i / 10)), 0.1) // boost higher frequencies and limit to 75%

  p5.draw = () =>{
    p5.background(0);

    let spectrum = fft.analyze();


    for (let i = 0; i < spectrum.length; i += definition) {

      var amp =  getBassAndNormalize(i, spectrum, 5);
      const normalizedAmp = normalizeAmplitude(amp, i);

      // map amplitude between 0 and 15 characters
      var numberOfChars = Math.ceil(p5.map(normalizedAmp, 0, 0.1, 0, 20));

      for(let j = 0; j < numberOfChars; j++) {
        const icon = Math.floor(p5.map(j, 0, numberOfChars, 0, chars.length - 1));

        const colors = THEME_COLOR_RGB.map(color => Math.max(color - j * 0, 0))

        p5.push()
        p5.fill([...colors])
        p5.rect(i * 2.16 + 5, p5.height - definition * 1.3 - (j * definition * 1.2), 10, 5); // not sure how this worked
        p5.noStroke();
        p5.pop();
      }
    }

   }
}

export default memo(({width}: {width?: number}) => {
  if(!width) return null;
  return <P5Canvas sketch={(s) => sketch(s, "feeling.mp3", width)} />
});
