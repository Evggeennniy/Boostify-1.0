import React from "react";
import { useGlobalContext } from "../../context/GlobalContext";

export const PageWrap = ({ children }) => {
  const { pageIsActive } = useGlobalContext();

  return (
    <div className={`page${pageIsActive ? " active" : ""}`}>{children}</div>
  );
};
