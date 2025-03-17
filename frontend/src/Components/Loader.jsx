const Loader = () => {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  };
  
  export default Loader;