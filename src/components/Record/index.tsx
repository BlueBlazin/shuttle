import React, { useEffect } from "react";

import { canvasLoop, handleWorkerMessage } from "./worker";

const SCREEN_SETTINGS = {
  video: { cursor: "always" },
  audio: false,
};

const WEBCAM_SETTINGS = { video: true, audio: false };

type RecordParams = {
  permissionDenied: () => void;
  finishRecording: (url: string) => void;
  useCam: boolean;
  useScreen: boolean;
  camPosition: { x: number; y: number };
};

function Record({
  permissionDenied,
  finishRecording,
  useCam,
  useScreen,
  camPosition,
}: RecordParams) {
  useEffect(() => {
    console.log(camPosition, window.innerWidth, window.innerHeight);
    const canvas = document.createElement("canvas");

    const screenVideo = document.createElement("video");
    const webcamVideo = document.createElement("video");

    let chunks: Blob[] = [];

    const ctx = canvas.getContext("2d");

    function drawVideoOnCanvas() {
      ctx?.save();

      const width = canvas.width;
      const height = canvas.height;

      if (useScreen) {
        ctx?.drawImage(screenVideo, 0, 0, width, height);
      }

      if (useCam) {
        ctx?.beginPath();

        const radius = 100;
        let x = (camPosition.x * canvas.width) / window.innerWidth;
        let y = (camPosition.y * canvas.height) / window.innerHeight;

        ctx?.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
        ctx?.clip();

        const aspectRatio = canvas.width / canvas.height;
        const newHeight = 2 * radius;
        const newWidth = newHeight * aspectRatio;
        const newX = x - (newWidth / 2 - radius);

        ctx?.drawImage(webcamVideo, newX, y, newWidth, newHeight);
      }

      ctx?.restore();
    }

    // @ts-ignore
    const canvasStream = canvas.captureStream(30);

    const mediaRecorder = new MediaRecorder(canvasStream);

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const url = URL.createObjectURL(blob);

      chunks = [];

      finishRecording(url);
    };

    const blobCode = `
      let captureCanvas = true;

      ${canvasLoop}

      onmessage = ${handleWorkerMessage}
    `;
    const blob = new Blob([blobCode], { type: "text/javascript" });
    const blobUrl = URL.createObjectURL(blob);

    const worker = new Worker(blobUrl);

    // prettier-ignore
    // @ts-ignore
    const screenStreamPromise = navigator.mediaDevices.getDisplayMedia(SCREEN_SETTINGS);
    // prettier-ignore
    const webcamStreamPromise = navigator.mediaDevices.getUserMedia(WEBCAM_SETTINGS);

    Promise.all([screenStreamPromise, webcamStreamPromise])
      .catch(() => {
        permissionDenied();
      })
      .then((results) => {
        if (!results) {
          return;
        }

        const [screenStream, webcamStream] = results;

        screenVideo.srcObject = screenStream;
        webcamVideo.srcObject = webcamStream;

        screenVideo.play();
        webcamVideo.play();

        const {
          width,
          height,
        } = screenStream.getVideoTracks()[0].getSettings();

        if (width > 1920 || height > 1080) {
          canvas.width = 1920;
          canvas.height = 1080;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        screenStream.addEventListener("inactive", () => {
          worker.postMessage("STOP");
          canvasStream.getTracks().forEach((track: any) => track.stop());
          webcamStream.getTracks().forEach((track: any) => track.stop());
          mediaRecorder.stop();
          worker.terminate();
        });

        mediaRecorder.start();

        worker.postMessage("START");

        worker.onmessage = () => {
          drawVideoOnCanvas();
        };
      });

    return () => worker.terminate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div></div>;
}

export default Record;
