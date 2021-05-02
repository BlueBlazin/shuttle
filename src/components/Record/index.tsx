import React, { useEffect, useRef } from "react";

import {
  drawVideoOnCanvas,
  makeVideoElem,
  makeCanvasElem,
  SCREEN_SETTINGS,
  WEBCAM_SETTINGS,
} from "./utils";

type RecordParams = {
  permissionDenied: () => void;
  requestCam: boolean;
  requestScreen: boolean;
};

function Record({ permissionDenied, requestCam, requestScreen }: RecordParams) {
  const chunks = useRef<Blob[]>([]);
  const screenVideo = useRef(makeVideoElem());
  const webcamVideo = useRef(makeVideoElem());
  const canvas = useRef(makeCanvasElem());
  const captureCanvas = useRef(true);

  const ref = useRef<HTMLDivElement>(null);

  function canvasLoop() {
    if (captureCanvas.current) {
      setTimeout(canvasLoop, 1000 / 45);
    }

    drawVideoOnCanvas(
      canvas.current,
      screenVideo.current,
      webcamVideo.current,
      requestCam,
      requestScreen
    );
  }

  const handleMediaRecorderOnstop = () => {
    const blob = new Blob(chunks.current, { type: "video/mp4" });

    chunks.current = [];

    const url = URL.createObjectURL(blob);

    // TEMP CODE
    const link = document.createElement("a");
    link.href = url;
    link.download = "shuttle-capture.mp4";
    link.innerHTML = "Click here to download the file";
    ref.current?.appendChild(link);
  };

  const handleMediaRecorderData = (e: any) => {
    chunks.current.push(e.data);
  };

  useEffect(() => {
    // @ts-ignore
    const canvasStream = canvas.current.captureStream(45);

    const mediaRecorder = new MediaRecorder(canvasStream);
    mediaRecorder.ondataavailable = handleMediaRecorderData;
    mediaRecorder.onstop = handleMediaRecorderOnstop;

    const screenStreamPromise =
      // @ts-ignore
      requestScreen && navigator.mediaDevices.getDisplayMedia(SCREEN_SETTINGS);

    const webcamStreamPromise =
      requestCam && navigator.mediaDevices.getUserMedia(WEBCAM_SETTINGS);

    const combinedPromise = Promise.all([
      screenStreamPromise,
      webcamStreamPromise,
    ]);

    combinedPromise
      .catch(() => {
        permissionDenied();
      })
      // @ts-ignore
      .then(([screenStream, webcamStream]) => {
        if (requestScreen) {
          screenVideo.current.srcObject = screenStream;
        }

        if (requestCam) {
          webcamVideo.current.srcObject = webcamStream;
        }

        const {
          width,
          height,
        } = screenStream.getVideoTracks()[0].getSettings();

        canvas.current.width = width;
        canvas.current.height = height;

        function handleStreamOninactive() {
          captureCanvas.current = false;

          if (requestCam) {
            webcamStream.getTracks().forEach((track: any) => track.stop());
          }

          mediaRecorder.stop();
        }

        const stream = requestScreen ? screenStream : webcamStream;
        stream.addEventListener("inactive", handleStreamOninactive);

        canvasLoop();

        mediaRecorder.start();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}

export default Record;
