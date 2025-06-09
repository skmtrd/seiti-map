"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface ImageExProps extends ImageProps {
  expandable?: boolean;
}

export const ImageEx: React.FC<ImageExProps> = ({ expandable = true, ...imageProps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleImageClick = () => {
    if (expandable) {
      setIsModalOpen(true);
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsModalOpen(false);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleCloseClick = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Image
        {...imageProps}
        onClick={handleImageClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleImageClick();
          }
        }}
        tabIndex={expandable ? 0 : undefined}
        role={expandable ? "button" : undefined}
        className={`${imageProps.className || ""} ${expandable ? "cursor-pointer" : ""}`}
      />

      {isModalOpen && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center bg-black/90"
          onClick={handleModalClick}
          onKeyDown={handleModalKeyDown}
          role="presentation"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseClick}
            className="absolute top-4 right-4 z-100 text-black bg-white"
          >
            <X className="h-5 w-5" />
          </Button>
          <Image
            onClick={(e) => e.stopPropagation()}
            src={imageProps.src}
            alt={imageProps.alt}
            width={5000}
            height={5000}
            quality={100}
            className="max-h-screen max-w-screen object-contain"
          />
        </div>
      )}
    </>
  );
};
