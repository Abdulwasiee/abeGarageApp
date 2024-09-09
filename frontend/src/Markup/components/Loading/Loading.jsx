import React from "react"; // Importing React to use JSX and React features
import classes from "./Loading.module.css"; // Importing CSS module for styling the Loading component
import loadingGif from "../../../assets/images/preloader.gif"; // Importing the loading GIF image

function Loading() {
  // Defining the Loading functional component
  return (
    <div className={classes.wrapper}>
      {" "}
      {/* Container div with styling from the CSS module */}
      <img src={loadingGif} alt="" /> {/* Displaying the loading GIF */}
    </div>
  );
}

export default Loading; // Exporting the Loading component to be used in other parts of the application
