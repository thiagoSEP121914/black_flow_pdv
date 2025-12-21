import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  initials,
  size = "md",
  bgColor = "bg-emerald-500",
  className = "",
}) => {
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${bgColor} rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
