import React, { useRef, useState } from "react";
import { AiFillGithub } from "react-icons/ai";

import styles from "./App.module.css";
import WebcamPlacement from "./components/WebcamPlacement";
import RecordPanel from "./components/RecordPanel";
import Record from "./components/Record";
import { AppState } from "./enums";

function App() {
  const webcamPlacementRef = useRef<HTMLCanvasElement>(null);
  const [appState, setAppState] = useState(AppState.PreRecording);
  const [requestCam, setRequestCam] = useState(true);
  const [requestScreen, setRequestScreen] = useState(true);

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
      return (
        <Record
          permissionDenied={() => {
            setAppState(AppState.PermissionDenied);
          }}
          requestCam={requestCam}
          requestScreen={requestScreen}
        />
      );
    } else if (appState === AppState.PermissionDenied) {
      return (
        <div className={styles["permission-denied-container"]}>
          <h1>Permission Denied 😅</h1>
          <h3>No worries! Refresh page to try again.</h3>
        </div>
      );
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
