import React, { useEffect, useRef } from "react";

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
};

function Record({
  permissionDenied,
  finishRecording,
  useCam,
  useScreen,
}: RecordParams) {
  useEffect(() => {
    const canvas = document.createElement("canvas");

    // prettier-ignore
    // @ts-ignore
    const screenStreamPromise = navigator.mediaDevices.getDisplayMedia(SCREEN_SETTINGS);

    // prettier-ignore
    const webcamStreamPromise = navigator.mediaDevices.getUserMedia(WEBCAM_SETTINGS);

    const combinedPromise = Promise.all([
      screenStreamPromise,
      webcamStreamPromise,
    ]);

    const screenVideo = document.createElement("video");

    const webcamVideo = document.createElement("video");

    const consoleLog = (msg: string) => console.log(msg);

    let chunks: Blob[] = [];

    const ctx = canvas.getContext("2d");

    function drawVideoOnCanvas() {
      ctx?.save();

      const width = canvas.width;
      const height = canvas.height;

      ctx?.drawImage(screenVideo, 0, 0, width, height);

      ctx?.beginPath();

      const radius = height / 8;

      ctx?.arc(radius, height - radius, radius, 0, Math.PI * 2, false);
      ctx?.clip();

      const aspectRatio = canvas.width / canvas.height;

      ctx?.drawImage(
        webcamVideo,
        radius * (1 - aspectRatio),
        height - 2 * radius,
        aspectRatio * 2 * radius,
        2 * radius
      );

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
      consoleLog("FINISHED!");

      // TEMP CODE
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = "shuttle-capture.mp4";
      // link.innerHTML = "Click here to download the file";
      // ref.current?.appendChild(link);
      finishRecording(url);
    };

    const blobCode = `
      // add globals here
      let captureCanvas = true;

      ${canvasLoop}

      onmessage = ${handleWorkerMessage}
    `;
    const blob = new Blob([blobCode], { type: "text/javascript" });
    const blobUrl = URL.createObjectURL(blob);

    const worker = new Worker(blobUrl);

    combinedPromise
      .catch(() => {
        permissionDenied();
      })
      // @ts-ignore
      .then(([screenStream, webcamStream]) => {
        screenVideo.srcObject = screenStream;
        webcamVideo.srcObject = webcamStream;

        screenVideo.play();
        webcamVideo.play();

        // prettier - ignore;
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
  }, []);

  return <div></div>;
}

export default Record;

// import React, { useEffect, useRef } from "react";

// import {
//   drawVideoOnCanvas,
//   makeVideoElem,
//   makeCanvasElem,
//   SCREEN_SETTINGS,
//   WEBCAM_SETTINGS,
// } from "./utils";

// type RecordParams = {
//   permissionDenied: () => void;
//   requestCam: boolean;
//   requestScreen: boolean;
// };

// function Record({ permissionDenied, requestCam, requestScreen }: RecordParams) {
//   const chunks = useRef<Blob[]>([]);
//   const screenVideo = useRef(makeVideoElem());
//   const webcamVideo = useRef(makeVideoElem());
//   const canvas = useRef(makeCanvasElem());
//   const captureCanvas = useRef(true);

//   const ref = useRef<HTMLDivElement>(null);

//   function canvasLoop() {
//     if (captureCanvas.current) {
//       setTimeout(canvasLoop, 1000 / 45);
//     }

//     drawVideoOnCanvas(
//       canvas.current,
//       screenVideo.current,
//       webcamVideo.current,
//       requestCam,
//       requestScreen
//     );
//   }

//   const handleMediaRecorderOnstop = () => {
//     const blob = new Blob(chunks.current, { type: "video/mp4" });

//     chunks.current = [];

//     const url = URL.createObjectURL(blob);

//     // TEMP CODE
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "shuttle-capture.mp4";
//     link.innerHTML = "Click here to download the file";
//     ref.current?.appendChild(link);
//   };

//   const handleMediaRecorderData = (e: any) => {
//     chunks.current.push(e.data);
//   };

//   useEffect(() => {
//     // @ts-ignore
//     const canvasStream = canvas.current.captureStream(45);

//     const mediaRecorder = new MediaRecorder(canvasStream);
//     mediaRecorder.ondataavailable = handleMediaRecorderData;
//     mediaRecorder.onstop = handleMediaRecorderOnstop;

//     const screenStreamPromise =
//       // @ts-ignore
//       requestScreen && navigator.mediaDevices.getDisplayMedia(SCREEN_SETTINGS);

//     const webcamStreamPromise =
//       requestCam && navigator.mediaDevices.getUserMedia(WEBCAM_SETTINGS);

//     const combinedPromise = Promise.all([
//       screenStreamPromise,
//       webcamStreamPromise,
//     ]);

//     combinedPromise
//       .catch(() => {
//         permissionDenied();
//       })
//       // @ts-ignore
//       .then(([screenStream, webcamStream]) => {
//         if (requestScreen) {
//           screenVideo.current.srcObject = screenStream;
//         }

//         if (requestCam) {
//           webcamVideo.current.srcObject = webcamStream;
//         }

//         const {
//           width,
//           height,
//         } = screenStream.getVideoTracks()[0].getSettings();

//         canvas.current.width = width;
//         canvas.current.height = height;

//         function handleStreamOninactive() {
//           captureCanvas.current = false;

//           if (requestCam) {
//             webcamStream.getTracks().forEach((track: any) => track.stop());
//           }

//           mediaRecorder.stop();
//         }

//         const stream = requestScreen ? screenStream : webcamStream;
//         stream.addEventListener("inactive", handleStreamOninactive);

//         canvasLoop();

//         mediaRecorder.start();
//       });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return <div ref={ref}></div>;
// }

// export default Record;
