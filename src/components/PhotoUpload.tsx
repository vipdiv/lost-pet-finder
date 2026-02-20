"use client";

import { useRef, useState } from "react";

interface PhotoUploadProps {
  name: string;
  required?: boolean;
}

export function PhotoUpload({ name, required }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        required={required}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-park-sepia/30 rounded-lg p-6 text-center hover:border-park-green hover:bg-park-paper/50 transition-colors cursor-pointer"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-48 rounded-lg object-cover"
          />
        ) : (
          <div className="text-park-sepia">
            <svg
              className="w-10 h-10 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Tap to add a photo</p>
            <p className="text-xs mt-1 opacity-70">JPG, PNG up to 5MB</p>
          </div>
        )}
      </button>
    </div>
  );
}
