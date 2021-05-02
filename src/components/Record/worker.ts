export function canvasLoop() {
  // @ts-ignore
  if (captureCanvas) {
    setTimeout(canvasLoop, 100 / 3);
  }
  // @ts-ignore
  postMessage("DRAW");
}

export function handleWorkerMessage(msg: { data: string }) {
  if (msg.data === "STOP") {
    // @ts-ignore
    captureCanvas = false;
  }

  if (msg.data === "START") {
    canvasLoop();
  }
}

// type startCaptureParams = {
//   screenVideo: HTMLVideoElement;
//   webcamVideo: HTMLVideoElement;
//   combinedPromise: Promise<[any, MediaStream]>;
//   canvas: HTMLCanvasElement;
//   consoleLog: (msg: string) => void;
// };

// export function startCapture({
//   screenVideo,
//   webcamVideo,
//   combinedPromise,
//   consoleLog,
//   canvas,
// }: startCaptureParams) {
//   const ctx = canvas.getContext("2d");

//   function canvasLoop() {
//     if (captureCanvas) {
//       requestAnimationFrame(canvasLoop);
//     }

//     ctx?.save();

//     const width = canvas.width;
//     const height = canvas.height;

//     ctx?.drawImage(screenVideo, 0, 0, width, height);

//     ctx?.beginPath();

//     const radius = height / 8;

//     ctx?.arc(radius, height - radius, radius, 0, Math.PI * 2, false);
//     ctx?.clip();

//     const aspectRatio = canvas.width / canvas.height;

//     ctx?.drawImage(
//       webcamVideo,
//       radius * (1 - aspectRatio),
//       height - 2 * radius,
//       aspectRatio * 2 * radius,
//       2 * radius
//     );

//     ctx?.restore();
//   }

//   let chunks: Blob[] = [];
//   let captureCanvas = true;

//   // @ts-ignore
//   const canvasStream = canvas.captureStream(45);

//   const mediaRecorder = new MediaRecorder(canvasStream);

//   mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

//   mediaRecorder.onstop = () => {
//     const blob = new Blob(chunks, { type: "video/mp4" });
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const url = URL.createObjectURL(blob);

//     chunks = [];
//     consoleLog("FINISHED!");
//   };

//   combinedPromise
//     .catch(() => {
//       consoleLog("Promise error");
//     })
//     // @ts-ignore
//     .then(([screenStream, webcamStream]) => {
//       consoleLog("Promise success");

//       screenVideo.srcObject = screenStream;
//       webcamVideo.srcObject = webcamStream;

//       // prettier-ignore
//       const { width, height } = screenStream.getVideoTracks()[0].getSettings();
//       canvas.width = width;
//       canvas.height = height;

//       screenVideo.addEventListener("inactive", () => {
//         captureCanvas = false;
//         webcamStream.getTracks().forEach((track: any) => track.stop());
//         mediaRecorder.stop();
//       });

//       canvasLoop();

//       mediaRecorder.start();
//     });
// }
