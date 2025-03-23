import React from "react";
import { Discount } from "../Discount";

export const Price = ({ price }) => {
  if (price === 0 || Number(process.env.REACT_APP_DISCOUNT) === 0) {
    return <p className="constructor__confirm-output">{price}₴</p>;
  }
  return <Discount price={price} discount={Number(process.env.REACT_APP_DISCOUNT)} />;
};

