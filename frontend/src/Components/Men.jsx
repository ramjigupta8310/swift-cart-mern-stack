import React, { useContext } from 'react'
import HomePageCategoriesProduct from "./HomePageCategoriesProduct";
import ProductContext from '../Context/ProductContext';

const Men = () => {
  const { mensWear, wfhWear } = useContext(ProductContext);

  const categoryArray = [...mensWear, ...wfhWear];
  return (
    <>
      <HomePageCategoriesProduct catArray={categoryArray}/>
    </>
  )
}

export default Men
