'use client'
// AudioVisualizer.tsx
import { useEffect, useRef } from 'react';

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    audioRef.current = new Audio('https://cdn.shopify.com/s/files/1/0669/6032/6756/files/741.mp3?v=1727205678');
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audioRef.current);
    const analyser = audioContext.createAnalyser();

    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    // AUTOPLAY with user click (required)
    const playAudio = () => {
      audioContext.resume().then(() => {
        audioRef.current?.play();
      });
    };

    // Listen for click to start
    //window.addEventListener('click', playAudio, { once: true });
    playAudio();


    return () => {
      //window.removeEventListener('click', playAudio);
      //audioRef.current?.pause();
      //audioRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={300} className='' />;
}
