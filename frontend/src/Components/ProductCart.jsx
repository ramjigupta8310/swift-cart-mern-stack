import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const Product = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Ek page par 8 cards

  // Total pages calculate karna
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Current page ke liye items filter karna
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Page change handlers
  const goToNextPage = () => {
    window.scrollTo(0, 0);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    window.scrollTo(0, 0);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // **Reset current page to 1 when items (filtered data) change**
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);


  return (
    <>
      <div className="flex lg:justify-start flex-wrap gap-x-[2%] md:gap-x-[4%] lg:gap-x-[1.5%] xl:gap-x-[1%] gap-y-2 md:gap-y-8 lg:gap-y-4 ">
        {currentItems.map((item) => (
          // Cards
          <Link
            to={`/category/${item.category}/${item.title}/${item.description}/${item._id}`}
            className="flex flex-col justify-between w-[49%] md:w-[47%] lg:w-[32%] xl:w-[24%] rounded-lg border-2 border-[#d4d5d9] px-1.5 py-1.5 sm:px-2 sm:py-2 transition-transform duration-300 hover:scale-[1.01]"
            key={item._id}
          >
            {/* Product Image, Title, and Description */}
            <div>
              <img
                src={item.imgSrc}
                alt={`Image of ${item.title}`}
                className="rounded-md w-full"
              />
              <div className="mt-2">
                <h5 className="text-md sm:text-xl font-bold">{item.title}</h5>
                <p className="text-[.9rem] font-normal">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Price And Buy Button */}
            <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-y-0  justify-between sm:mt-2">
              {/* Price Section */}
              <div className="flex items-center gap-2">
                <h6 className="text-lg font-semibold text-gray-800">
                  Rs. {item.price}
                </h6>
                <p className="text-sm text-gray-500 line-through">
                  Rs. {item.realPrice}
                </p>
              </div>
              <button
                className="px-4 py-1 rounded-md text-white bg-[rgb(255,62,108)]"
                aria-label={`Buy ${item.title}`}
              >
                Buy Now
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 ? <div className="flex gap-3 sm:gap-6 justify-center items-center mt-12">
        {/* Previous Button */}
        <button
          className="flex gap-x-1 items-center border-2 border-[#d4d5d9] sm:py-2 sm:px-3 py-1 px-1 text-lg font-semibold disabled:text-[#7e808c] disabled:cursor-not-allowed rounded-md"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <GrFormPrevious className="text-lg mt-[1px]" />
          Previous
        </button>

        {/* Page Number */}
        <span className="text-lg text-black">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        <button
          className="flex gap-x-1 items-center border-2 border-[#d4d5d9] sm:py-2 sm:px-3 py-1 px-1 text-lg font-semibold disabled:text-[#7e808c] disabled:cursor-not-allowed rounded-md"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next <GrFormNext className="text-lg mt-[1px]" />
        </button>
      </div> : ""}
    </>
  );
};

export default Product;
