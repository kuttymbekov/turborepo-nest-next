"use client"; // This directive is essential for client-side functionality

import { useEffect } from "react";

const PageWithConfirmation = () => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Prompt the user with a confirmation dialog
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = "";
    };

    // Add the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // The empty dependency array ensures this runs once when the component mounts

  return (
    <div>
      <h1>You have unsaved changes!</h1>
      <p>Try navigating away, closing the tab, or refreshing the page.</p>
    </div>
  );
};

export default PageWithConfirmation;
