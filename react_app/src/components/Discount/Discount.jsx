import React from "react";


export const Discount = ({ price, discount }) => {
  const oldPrice = (price * (discount * 0.01 + 1)).toFixed(2);
  return (
    <div className="constructor__confirm-output" style={{ fontSize: "0.875rem", fontWeight: "600" }}>
      <span style={{ textDecoration: "line-through", color: "lightgray", textDecorationThickness: "2px", textDecorationColor: "lightgray", fontWeight: "300" }}>
        {oldPrice}₴
      </span>
      <span style={{ color: "red" }}> {price}₴</span>
      <span style={{ color: "black", fontSize: "0.875rem" }}> ({discount}% OFF)</span>
    </div>
  );
};

