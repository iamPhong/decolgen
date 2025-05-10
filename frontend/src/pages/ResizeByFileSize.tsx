import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OpenFileDialog, ResizeByCapacity } from "@wails/go/manager/AppManager";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { manager } from "@wails/go/models";
import FileInfo from "@/components/custom/FileInfo";
import { ImageIcon, Loader2, UploadIcon, PlayIcon } from "lucide-react";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export default function ResizeByFileSize() {
  const [selectedImage, setSelectedImage] = useState<manager.FileResult | null>(
    null
  );
  const [formattedFileSize, setFormattedFileSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFile = async () => {
    try {
      setIsLoading(true);
      const result = await OpenFileDialog();
      if (result && result.status === 1) {
        setSelectedImage(result);
        formik.setFieldValue("fileSize", result.fileInfo.size);
        formik.setFieldValue("filePath", result.fileInfo.filePath);
      } else {
        toast.error(result?.message || "Failed to open file");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const numericValue = value === "" ? "" : Number(value);

    if (!isNaN(numericValue as number)) {
      formik.setFieldValue("fileSize", numericValue);
      setFormattedFileSize(numericValue ? numericValue.toLocaleString() : "");
    }
  };

  const handleFileSizeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    formik.handleBlur(e);
    const value = formik.values.fileSize;
    setFormattedFileSize(value ? Number(value).toLocaleString() : "");
  };

  const formik = useFormik({
    initialValues: {
      fileSize: selectedImage?.fileInfo.size || "",
      filePath: selectedImage?.fileInfo.filePath || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fileSize: Yup.number()
        .required("File size is required")
        .min(
          (selectedImage?.fileInfo.size || 0) + 1,
          `File size must be greater than ${(
            selectedImage?.fileInfo.size || 0
          ).toLocaleString()} bytes`
        )
        .max(
          (selectedImage?.fileInfo.size || 0) + MAX_FILE_SIZE,
          `File size cannot exceed ${(
            (selectedImage?.fileInfo.size || 0) + MAX_FILE_SIZE
          ).toLocaleString()} bytes (500MB larger than original)`
        ),
      filePath: Yup.string().required("Please select an image"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const savedPath = await ResizeByCapacity(
          values.filePath,
          Number(values.fileSize)
        );
        toast.success(`Image resized successfully! Saved to: ${savedPath}`);
      } catch (error) {
        if (error == "User cancelled the save dialog") {
          toast.warning(`Cancelled resize image`);
        } else {
          toast.error(`Failed to resize image: ${error}`);
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="w-full max-w-6xl rounded-2xl shadow-xl bg-white border border-blue-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-blue-700">
            Resize by file size
          </h2>
          <span className="text-sm text-blue-500 mb-6">
            This feature allows you to resize an image to a specific file size.
            You can select an image and then enter the desired file size in
            bytes. The app will then resize the image to the specified size and
            save it to the same location as the original image.
          </span>
          <hr className="my-6 border-t border-blue-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Upload and Preview */}
            <div className="space-y-6">
              <div
                className="w-full border-dashed border-2 rounded-xl p-6 text-center text-blue-400 bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
                onClick={handleSelectFile}
              >
                {selectedImage?.base64Encoded ? (
                  <img
                    src={`data:image/png;base64,${selectedImage.base64Encoded}`}
                    alt="preview"
                    width={200}
                    height={200}
                    className="mx-auto mb-2 max-h-64 rounded-lg object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="p-4 bg-blue-100 rounded-full">
                      <UploadIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-blue-500">
                        Click to Upload
                      </div>
                      <div className="text-xs text-blue-400">
                        BMP, PNG, JPG, JPEG, TIF, TIFF, WebP or GIF
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {selectedImage && <FileInfo data={selectedImage.fileInfo} />}
            </div>

            {/* Right Column - Form Controls */}
            <div className="flex flex-col justify-start">
              <form className="w-full" onSubmit={formik.handleSubmit}>
                <div className="w-full mb-6">
                  <Label htmlFor="fileSize" className="text-blue-700 text-lg">
                    Target File Size (bytes)
                  </Label>
                  <Input
                    id="fileSize"
                    name="fileSize"
                    type="text"
                    placeholder={`> ${
                      selectedImage?.fileInfo.size.toLocaleString() || 0
                    }`}
                    className="mt-2 text-lg"
                    value={formattedFileSize}
                    onChange={handleFileSizeChange}
                    onBlur={handleFileSizeBlur}
                    disabled={!selectedImage}
                  />
                  {formik.errors.fileSize ? (
                    <div className="text-red-500 text-sm mt-2">
                      {formik.errors.fileSize}
                    </div>
                  ) : null}
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition cursor-pointer text-lg py-6 flex items-center justify-center gap-2 group"
                  type="submit"
                  disabled={!selectedImage || !formik.isValid || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <PlayIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span>{isLoading ? "Processing..." : "Resize"}</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
