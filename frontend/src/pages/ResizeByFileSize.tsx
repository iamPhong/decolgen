import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResizeByFileSize() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 bg-white border border-blue-100 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Resize by Size
        </h2>
        <div
          className="w-full border-dashed border-2 rounded-xl p-6 text-center text-blue-400 bg-blue-50 cursor-pointer hover:bg-blue-100 transition mb-4"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="mx-auto mb-2 max-h-48 rounded-lg object-contain"
            />
          ) : (
            <>
              <div className="text-lg font-semibold text-blue-500">
                Click to Upload or Drag and Drop
              </div>
              <div className="text-xs mt-2 text-blue-400">
                BMP, PNG, JPG, JPEG, TIF, TIFF, WebP or GIF
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="w-full mb-4">
          <Label htmlFor="fileSize" className="text-blue-700">
            Target File Size (KB)
          </Label>
          <Input
            id="fileSize"
            type="number"
            placeholder="e.g. 500"
            className="mt-2"
          />
        </div>
        <Button
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          type="button"
        >
          Resize
        </Button>
      </div>
    </div>
  );
}
