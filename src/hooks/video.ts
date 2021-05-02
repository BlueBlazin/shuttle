import React, { useRef } from "react";

export function useVideos() {
  function makeVideoElem() {
    const video = document.createElement("video");
    video.autoplay = true;
    return video;
  }

  const screenVideo = useRef(makeVideoElem());
  const webcamVideo = useRef(makeVideoElem());

  return [screenVideo, webcamVideo];
}

export function useCanvas(): React.MutableRefObject<HTMLCanvasElement> {
  function makeCanvasElem() {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvas.setAttribute("style", "image-rendering: pixelated;");
    return canvas;
  }

  return useRef(makeCanvasElem());
}
