import React from "react";

export const CashbackCard = ({ balance }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        margin: "10px",
        borderRadius: "8px",
        backgroundColor: "white",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p>КапiКешбек</p>
      <p>{balance} ₴</p>
    </div>
  );
};
