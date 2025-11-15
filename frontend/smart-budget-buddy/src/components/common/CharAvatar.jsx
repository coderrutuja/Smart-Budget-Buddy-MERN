// frontend/smart-budget-buddy/src/components/common/CharAvatar.jsx
import React from "react";

/**
 * CharAvatar - shows initials of user's name in a circle.
 * 
 * Props:
 *  - fullName: string (e.g. "Rutuja Ainapure")
 *  - width: tailwind class (default: w-10)
 *  - height: tailwind class (default: h-10)
 *  - style: text size or extra classes
 */
const CharAvatar = ({ fullName = "", width = "w-10", height = "h-10", style = "" }) => {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      className={`${width} ${height} rounded-full bg-primary text-white flex items-center justify-center font-semibold ${style}`}
    >
      {initials}
    </div>
  );
};

export default CharAvatar;
