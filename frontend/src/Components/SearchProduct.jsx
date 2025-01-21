import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductContext from "../Context/ProductContext";
import HomePageCategoriesProduct from "./HomePageCategoriesProduct";

const SearchProduct = () => {
  const {
    ethnicWear,
    sleepWear,
    homeDecor,
    workWear,
    kidsWear,
    sportsShoes,
    officeWear,
    mensWear,
    casualStyles,
    westernWear,
    wfhWear,
    womensFootwear,
  } = useContext(ProductContext);

  const { productName } = useParams();
  const lowerCaseProductName = productName.toLowerCase();

  const [filterData, setFilterData] = useState([]);
  const allCategory = [
    ...ethnicWear,
    ...sleepWear,
    ...homeDecor,
    ...workWear,
    ...kidsWear,
    ...sportsShoes,
    ...officeWear,
    ...mensWear,
    ...casualStyles,
    ...westernWear,
    ...wfhWear,
    ...womensFootwear,
  ];

  const categoryMap = {
    // Kids Wear
    "kids wear": kidsWear,
    "kid wear": kidsWear,
    kidswear: kidsWear,
    kidwear: kidsWear,
    kids: kidsWear,
    kid: kidsWear,

    // Ethnic Wear
    "ethnic wear": ethnicWear,
    ethnicwear: ethnicWear,
    "ethnic wear women": ethnicWear,
    "ethnic wear for women": ethnicWear,
    "traditional wear": ethnicWear,
    "indian wear": ethnicWear,

    // Sleep Wear
    "sleep wear": sleepWear,
    sleepwear: sleepWear,
    "sleep wear for women": sleepWear,
    "sleeping wear for women": sleepWear,
    nightwear: sleepWear,
    "night wear": sleepWear,
    pajamas: sleepWear,
    "sleepin wear": sleepWear,

    // Home Decor
    "home decor": homeDecor,
    "home decoration": homeDecor,
    homedecoration: homeDecor,
    home: homeDecor,
    "interior decor": homeDecor,
    decor: homeDecor,

    // Work Wear
    "work wear": workWear,
    workwear: workWear,
    "work wear for women": workWear,
    "women work wear": workWear,
    "office wear for women": workWear,
    "professional wear": workWear,

    // Sports Shoes
    "sports shoes": sportsShoes,
    "athletic shoes": sportsShoes,
    "training shoes": sportsShoes,
    "running shoes": sportsShoes,
    "sports shoes for men": sportsShoes,

    // Office Wear
    "office wear": officeWear,
    "formal wear": officeWear,
    "business casual": officeWear,
    "professional attire": officeWear,

    // Mens Wear
    "mens wear": mensWear,
    "men's clothing": mensWear,
    "men fashion": mensWear,
    "men's fashion": mensWear,

    // Casual Styles
    "casual styles": casualStyles,
    "casual wear": casualStyles,
    "relaxed clothing": casualStyles,
    "everyday wear": casualStyles,

    // Western Wear
    "western wear": westernWear,
    "western wear for women": westernWear,
    "western clothing": westernWear,
    "western outfits": westernWear,
    "western fashion": westernWear,

    // Work From Home Wear
    "wfh wear": wfhWear,
    "work from home wear": wfhWear,
    "comfortable wear": wfhWear,
    loungewear: wfhWear,

    // Womens Footwear
    "womens footwear": womensFootwear,
    "women shoes": womensFootwear,
    "female shoes": womensFootwear,
    "ladies footwear": womensFootwear,
  };

  useEffect(() => {
    if (categoryMap[lowerCaseProductName]) {
      setFilterData(categoryMap[lowerCaseProductName]);
    } else {
      const filteredData = allCategory.filter((product) =>
        product.title.toLowerCase().includes(lowerCaseProductName)
      );
      setFilterData(filteredData);
    }
  }, [productName, lowerCaseProductName]);

  return (
    <>
      <HomePageCategoriesProduct catArray={filterData} />
    </>
  );
};

export default SearchProduct;
