import React from "react";

import styles from "./PermissionDenied.module.css";

function PermissionDenied() {
  return (
    <div className={styles["permission-denied-container"]}>
      <h1>Permission Denied 😅</h1>
      <h3>No worries! Refresh page to try again.</h3>
    </div>
  );
}

export default PermissionDenied;
