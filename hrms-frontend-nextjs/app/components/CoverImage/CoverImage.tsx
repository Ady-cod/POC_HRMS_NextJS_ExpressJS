"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Upload } from "lucide-react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (img: string) => void;
  current?: string | null;
};

const defaultImages = [
  "/images/cover1.png",
  "/images/cover2.png",
  "/images/cover3.png",
  "/images/cover4.png",
  "/images/cover5.png",
];

export default function CoverImage({
  isOpen,
  onClose,
  onSelect,
  current,
}: Props) {
  const [selected, setSelected] = useState<string | null>(current || null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setUploadedPreview(data);
      setSelected(data);
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  const tiles = [...defaultImages];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold">Update Cover Photo</h3>
          <button
            aria-label="Close"
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select an image from the options provided below.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/* Upload tile - show as first tile visually */}
          <div
            className={`relative aspect-square w-full rounded-md overflow-hidden border cursor-pointer flex items-center justify-center bg-gray-50`}
            onClick={() => inputRef.current?.click()}
            title="Upload custom image"
          >
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              className="hidden"
              onChange={handleFile}
              aria-label="Upload cover image file"
            />

            {/* If user uploaded a preview, show it here */}
            {uploadedPreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={uploadedPreview}
                  alt="uploaded preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-sm text-gray-700">
                <Upload className="w-6 h-6" />
                <span className="text-xs">Upload</span>
              </div>
            )}

            {/* show selected check for uploaded preview */}
            {selected && selected === uploadedPreview ? (
              <div className="absolute top-1 right-1 bg-white rounded-sm">
                <Check className="w-4 h-4 text-lightblue-600 stroke-current" />
              </div>
            ) : null}

            {/* show cancel button only when there is an uploaded preview */}
            {uploadedPreview ? (
              <button
                aria-label="Cancel uploaded image"
                className="absolute top-1 left-1 bg-white rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedPreview(null);
                  // if uploaded was selected, reset selection to current or null
                  setSelected(current || null);
                }}
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            ) : null}
          </div>

          {tiles.map((src, idx) => (
            <div
              key={src + idx}
              className={`relative aspect-square w-full rounded-md overflow-hidden border cursor-pointer`}
              onClick={() => setSelected(src)}
            >
              {/* use img for simplicity */}
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`cover-${idx}`}
                  fill
                  className="object-cover"
                />
              </div>
              {selected === src ? (
                <div className="absolute inset-0 bg-black/30 flex items-start justify-end p-2">
                  <div className="bg-white rounded-sm">
                    <Check className="w-4 h-4 text-lightblue-600 stroke-current" />
                  </div>
                </div>
              ) : (
                <div className="absolute top-2 right-2 w-4 h-4 bg-white/60 rounded-sm"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-orange-400 text-orange-500"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!selected) return;
              onSelect(selected);
            }}
            disabled={!selected}
            className="bg-lightblue-600 hover:bg-lightblue-700 border-lightblue-600 text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
