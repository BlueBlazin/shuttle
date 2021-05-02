import React, { useRef, useState } from "react";
import { AiFillGithub } from "react-icons/ai";

import styles from "./App.module.css";
import WebcamPlacement from "./components/WebcamPlacement";
import RecordPanel from "./components/RecordPanel";
import Record from "./components/Record";
import PermissionDenied from "./components/PermissionDenied";
import PostRecord from "./components/PostRecord";
import { AppState } from "./enums";

function App() {
  const webcamPlacementRef = useRef<HTMLCanvasElement>(null);
  const [appState, setAppState] = useState(AppState.PreRecording);
  const [requestCam, setRequestCam] = useState(true);
  const [requestScreen, setRequestScreen] = useState(true);
  const [url, setUrl] = useState("");

  function renderContent() {
    if (appState === AppState.PreRecording) {
      return (
        <>
          <RecordPanel
            requestCam={requestCam}
            requestScreen={requestScreen}
            toggleCam={() => {
              setRequestCam(!requestCam);
            }}
            toggleScreen={() => setRequestScreen(!requestScreen)}
            startRecording={() => setAppState(AppState.Recording)}
          />
          {requestCam && (
            <WebcamPlacement canvasRef={webcamPlacementRef} radius={100} />
          )}
        </>
      );
    } else if (appState === AppState.Recording) {
      // @ts-ignore
      const { x, y } = requestCam
        ? webcamPlacementRef.current?.getBoundingClientRect()
        : { x: 0, y: 0 };

      return (
        <Record
          permissionDenied={() => {
            setAppState(AppState.PermissionDenied);
          }}
          finishRecording={(url) => {
            setAppState(AppState.PostRecording);
            setUrl(url);
          }}
          useCam={requestCam}
          useScreen={requestScreen}
          camPosition={{ x, y }}
        />
      );
    } else if (appState === AppState.PermissionDenied) {
      return <PermissionDenied />;
    } else if (appState === AppState.PostRecording) {
      return <PostRecord url={url} />;
    } else {
      return null;
    }
  }

  return (
    <div className={styles.container}>
      {renderContent()}
      <div className={styles.github}>
        <AiFillGithub size="3em" />
      </div>
    </div>
  );
}

export default App;
