import React, { useContext } from 'react'
import HomePageCategoriesProduct from "./HomePageCategoriesProduct";
import ProductContext from '../Context/ProductContext';

const Kids = () => {
  const { kidsWear } = useContext(ProductContext);

  const categoryArray = [...kidsWear];
  return (
    <>
      <HomePageCategoriesProduct catArray={categoryArray}/>
    </>
  )
}

export default Kids
