import React from "react";

const TopStories = () => {
  const topStories = ["Brand Directory"];
  const mostSearched = [
    "APPLE IPOD", "IPOD NANO", "PERSONAL CARE PRODUCTS", "BINOCULARS",
    "1200D CANON", "IPODS", "SHAVER AND TRIMMER", "TRIMMER PRICE",
    "LG LED TV 32 INCH PRICE", "SANSUI LED TV PRICE", "DAIKIN AIR CONDITIONER",
    "GODREJ AC", "AC COOLER", "SAMSUNG WASHING MACHINE PRICE",
    "WATER HEATERS", "AIRFRYERS", "UMEET MIXER GRINDER",
    "LG SEMI AUTOMATIC WASHING MACHINE", "MOTOROLA WALKIE TALKIE",
    "NIKON D5200", "USHA HALOGEN OVEN", "DAIKIN SPLIT AC", "DAIKIN WINDOW AC",
    "BEST TRAVEL ELECTRIC KETTLE", "INDUCTION", "LG REFRIGERATOR",
    "BEST LED SMART TV IN INDIA", "BEST LED TV UNDER RS.20000",
    "LG 55 INCH 4K TV", "SAMSUNG LED TV"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-700">
      <div className="mb-4">
        <h3 className="text-white font-bold mb-2">Top Stories:</h3>
        <div className="flex flex-wrap gap-2">
          {topStories.map((story, idx) => (
            <span key={idx} className="bg-gray-800 px-2 py-1 rounded hover:text-white cursor-pointer">
              {story}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-bold mb-2">
          MOST SEARCHED IN Home & Kitchen:
        </h3>
        <div className="flex flex-wrap gap-2">
          {mostSearched.map((item, idx) => (
            <span key={idx} className="bg-gray-800 px-2 py-1 rounded text-sm hover:text-white cursor-pointer">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopStories;