import React, { useContext } from "react";
import HomePageCategoriesProduct from "./HomePageCategoriesProduct";
import ProductContext from "../Context/ProductContext";

const Women = () => {
  const {
    ethnicWear,
    sleepWear,
    workWear,
    officeWear,
    casualStyles,
    westernWear,
  } = useContext(ProductContext);

  const categoryArray = [
    ...ethnicWear,
    ...sleepWear,
    ...workWear,
    ...officeWear,
    ...casualStyles,
    ...westernWear,
  ];

  return (
    <>
      <HomePageCategoriesProduct catArray={categoryArray} />
    </>
  );
};

export default Women;
