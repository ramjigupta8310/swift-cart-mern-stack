import React, { useEffect, useState } from "react";
import styles from "./Filter.module.css";

const Filter = ({ allProducts, setFilteredProducts, cat }) => {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const priceLimits = [499, 999, 1499, 1999, 2499, 2999, 3999, 4999, 6999];

  const colors = [
    { id: "white", label: "White" },
    { id: "pink", label: "Pink" },
    { id: "black", label: "Black" },
    { id: "blue", label: "Blue" },
    { id: "orange", label: "Orange" },
    { id: "yellow", label: "Yellow" },
    { id: "red", label: "Red" },
    { id: "purple", label: "Purple" },
    { id: "green", label: "Green" },
    { id: "navy", label: "Navy Blue" },
    { id: "brown", label: "Brown" },
    { id: "gray", label: "Gray" },
    { id: "beige", label: "Beige" },
  ];

  const handlePriceChange = (price) => {
    setSelectedPrices((prevSelectedPrices) => {
      if (prevSelectedPrices.includes(price)) {
        return prevSelectedPrices.filter((p) => p !== price);
      } else {
        return [...prevSelectedPrices, price];
      }
    });
  };

  const handleColorChange = (color) => {
    setSelectedColors((prevSelectedColors) => {
      if (prevSelectedColors.includes(color)) {
        return prevSelectedColors.filter((c) => c !== color);
      } else {
        return [...prevSelectedColors, color];
      }
    });
  };

  const clearFilters = () => {
    setSelectedPrices([]);
    setSelectedColors([]);
  };

  const filterItems = () => {
    let filteredItems = allProducts;

    if (selectedPrices.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedPrices.some((price) => item.price <= price)
      );
    }

    if (selectedColors.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedColors.includes(item.color)
      );
    }
    return filteredItems;
  };

  useEffect(() => {
    const filteredItems = filterItems();
    setFilteredProducts(filteredItems);
  }, [selectedColors, selectedPrices]);

  return (
    <>
      <div className="w-full px-4 no-scrollbar">
        {/* Clear All Filter */}
        <div className="flex justify-between">
          <h5 className="text-xl font-semibold">Filters</h5>
          <p
            className="cursor-pointer text-[rgb(132,132,215)]"
            onClick={clearFilters}
          >
            Clear All
          </p>
        </div>

        <hr className="mt-2"></hr>

        {/* Price Filters */}
        <div className="my-4">
          <h5 className="font-medium pb-1">PRICE</h5>
          {priceLimits.map((price) => (
            <div key={price}>
              <input
                type="checkbox"
                id={price}
                checked={selectedPrices.includes(price)}
                onChange={() => handlePriceChange(price)}
                className="mr-2 scale-125 cursor-pointer"
                aria-label={`Filter items under Rs. ${price}`}
              />
              <label htmlFor={price} className="hover:text-[rgb(255,62,108)] cursor-pointer">Under Rs. {price}</label>
            </div>
          ))}
        </div>

        <hr className="mt-2"></hr>

        {/*Show Color Filter If It is not "home-decor category" */}
        {cat !== "home-decor" ? (
          <div className="my-4">
              <h5 className="font-medium pb-1">COLOR</h5>
              {colors.map(({ id, label }) => (
                <div key={id}>
                  <input
                    type="checkbox"
                    id={id}
                    checked={selectedColors.includes(id)}
                    onChange={() => handleColorChange(id)}
                    className="mr-2 scale-125 cursor-pointer"
                    aria-label={`Filter items color ${id}`}
                  />
                  <label htmlFor={id} className="hover:text-[rgb(255,62,108)] cursor-pointer">
                    <span className={`w-4 h-4 mr-2 rounded-full inline-block ${styles[`${id}Color`]}`}></span>
                    {label}
                  </label>
                </div>
              ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Filter;
