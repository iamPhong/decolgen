import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  OpenFileDialog,
  PreviewImageHandler,
  RevealInExplorer,
  SaveEditedImageHandler,
} from "@wails/go/manager/AppManager";
import { toast } from "sonner";
import { manager } from "@wails/go/models";
import FileInfo from "@/components/custom/FileInfo";
import {
  UploadIcon,
  SaveIcon,
  Maximize2Icon,
  ImageIcon,
  Loader2,
  RotateCcwIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Constants
const FILTERS = [
  { value: "none", label: "None" },
  { value: "NearestNeighbor", label: "Nearest Neighbor" },
  { value: "Linear", label: "Linear" },
  { value: "CatmullRom", label: "CatmullRom" },
  { value: "Lanczos", label: "Lanczos" },
] as const;

const DEFAULT_SETTINGS: ImageSettings = {
  width: 0,
  height: 0,
  filter: "none",
  blur: 0,
  sharpening: 0,
  gamma: 1,
  contrast: 0,
  brightness: 0,
  saturation: 0,
  invert: false,
};

// Types
interface ImageSettings {
  width: number;
  height: number;
  filter: string;
  blur: number;
  sharpening: number;
  gamma: number;
  contrast: number;
  brightness: number;
  saturation: number;
  invert: boolean;
}

type SliderValue = [number];

// Components
const UploadArea = ({
  previewImage,
  onSelectFile,
}: {
  previewImage: string | null;
  onSelectFile: () => void;
}) => (
  <div
    className="w-full border-dashed border-2 rounded-xl p-8 text-center text-blue-400 bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
    onClick={onSelectFile}
  >
    {previewImage ? (
      <div className="space-y-4">
        <div className="w-full h-[500px] flex items-center justify-center bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={`data:image/png;base64,${previewImage}`}
            alt="preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="text-sm text-blue-500">Click to change image</div>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="p-6 bg-blue-100 rounded-full">
          <UploadIcon className="h-12 w-12 text-blue-500" />
        </div>
        <div className="space-y-3">
          <div className="text-xl font-semibold text-blue-500">
            Click to Upload
          </div>
          <div className="text-sm text-blue-400">
            BMP, PNG, JPG, JPEG, TIF, TIFF, WebP or GIF
          </div>
        </div>
      </div>
    )}
  </div>
);

const AdjustmentSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: SliderValue) => void;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}) => (
  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
    <div className="flex justify-between items-center">
      <Label className="text-sm font-medium text-blue-600">{label}</Label>
      <span className="text-sm text-blue-500 font-medium">{value}</span>
    </div>
    <Slider
      value={[value] as SliderValue}
      onValueChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className="mt-2"
    />
  </div>
);

export default function GenerateImage() {
  const [selectedImage, setSelectedImage] = useState<manager.FileResult | null>(
    null
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ImageSettings>(DEFAULT_SETTINGS);
  const [isModified, setIsModified] = useState(false);

  const handleSelectFile = async () => {
    try {
      setIsLoading(true);
      const result = await OpenFileDialog();
      if (result && result.status === 1) {
        const fileInfo = result.fileInfo;
        setSelectedImage(result);
        setSettings({
          ...DEFAULT_SETTINGS,
          width: fileInfo.width || 0,
          height: fileInfo.height || 0,
        });
        setPreviewImage(result.base64Encoded);
      } else {
        toast.error(result?.message || "Failed to open file");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const savedPath = await SaveEditedImageHandler(
        selectedImage?.fileInfo.filePath || "",
        settings
      );
      toast.success(`Image saved successfully! Saved to: ${savedPath}`, {
        action: {
          label: "Open",
          onClick: () => RevealInExplorer(savedPath),
        },
        duration: 10000,
      });
    } catch (error) {
      if (error === "User cancelled the save dialog") {
        toast.warning("User cancelled the save dialog");
      } else {
        toast.error(`Failed to save image: ${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (selectedImage) {
      setSettings({
        ...DEFAULT_SETTINGS,
        width: selectedImage.fileInfo.width || 0,
        height: selectedImage.fileInfo.height || 0,
      });
      setIsModified(false);
    }
  };

  const handleSliderChange = (
    value: SliderValue,
    setting: keyof ImageSettings
  ) => {
    setIsModified(true);
    setSettings((prev) => ({ ...prev, [setting]: value[0] }));
  };

  const handlePreview = useCallback(async () => {
    if (selectedImage) {
      try {
        setIsLoading(true);
        const result = await PreviewImageHandler(
          selectedImage.fileInfo.filePath,
          settings
        );
        setPreviewImage(result);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedImage, settings]);

  useEffect(() => {
    const timeoutId = setTimeout(handlePreview, 1000);
    return () => clearTimeout(timeoutId);
  }, [handlePreview]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="w-full max-w-6xl shadow-xl bg-white border border-blue-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-blue-700">Image Editor</h2>
          <span className="text-sm text-blue-500 mb-6">
            This feature allows you to edit an image. You can select an image
            and then use the sliders to adjust the image.
          </span>
          <hr className="my-6 border-t border-blue-100" />
          <div className="space-y-8">
            {/* Top Section - Upload and Preview */}
            <div className="space-y-6">
              <UploadArea
                previewImage={previewImage}
                onSelectFile={handleSelectFile}
              />
              {selectedImage && <FileInfo data={selectedImage.fileInfo} />}
            </div>

            {/* Bottom Section - Tools */}
            <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dimensions */}
                <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <Maximize2Icon className="h-5 w-5" />
                    Dimensions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="width"
                        className="text-sm font-medium text-blue-600"
                      >
                        Width
                      </Label>
                      <div className="relative">
                        <Input
                          id="width"
                          type="number"
                          value={settings.width}
                          onChange={(e) => {
                            setSettings((prev) => ({
                              ...prev,
                              width: Number(e.target.value),
                            }));
                            setIsModified(true);
                          }}
                          disabled={!selectedImage}
                          className="pl-8 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm">
                          W
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="height"
                        className="text-sm font-medium text-blue-600"
                      >
                        Height
                      </Label>
                      <div className="relative">
                        <Input
                          id="height"
                          type="number"
                          value={settings.height}
                          onChange={(e) => {
                            setSettings((prev) => ({
                              ...prev,
                              height: Number(e.target.value),
                            }));
                            setIsModified(true);
                          }}
                          disabled={!selectedImage}
                          className="pl-8 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm">
                          H
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter */}
                <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Filter
                  </h3>
                  <div className="space-y-4">
                    <Select
                      value={settings.filter}
                      onValueChange={(value) => {
                        setSettings((prev) => ({ ...prev, filter: value }));
                        setIsModified(true);
                      }}
                      disabled={!selectedImage}
                    >
                      <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                        <SelectValue placeholder="Select filter" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTERS.map((filter) => (
                          <SelectItem
                            key={filter.value}
                            value={filter.value}
                            className="focus:bg-blue-50 focus:text-blue-700"
                          >
                            {filter.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="invert"
                        checked={settings.invert}
                        onChange={(e) => {
                          setSettings((prev) => ({
                            ...prev,
                            invert: e.target.checked,
                          }));
                          setIsModified(true);
                        }}
                        disabled={!selectedImage}
                        className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label
                        htmlFor="invert"
                        className="text-sm font-medium text-blue-600 cursor-pointer"
                      >
                        Invert Colors
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              <div className="mt-8 space-y-4 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <SlidersHorizontalIcon className="h-5 w-5" />
                  Adjustments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AdjustmentSlider
                    label="Blur"
                    value={settings.blur}
                    onChange={(value) => handleSliderChange(value, "blur")}
                    min={0}
                    max={5}
                    step={0.1}
                    disabled={!selectedImage}
                  />
                  <AdjustmentSlider
                    label="Sharpening"
                    value={settings.sharpening}
                    onChange={(value) =>
                      handleSliderChange(value, "sharpening")
                    }
                    min={0}
                    max={5}
                    step={0.1}
                    disabled={!selectedImage}
                  />
                  <AdjustmentSlider
                    label="Gamma"
                    value={settings.gamma}
                    onChange={(value) => handleSliderChange(value, "gamma")}
                    min={0}
                    max={2}
                    step={0.1}
                    disabled={!selectedImage}
                  />
                  <AdjustmentSlider
                    label="Contrast"
                    value={settings.contrast}
                    onChange={(value) => handleSliderChange(value, "contrast")}
                    min={-100}
                    max={100}
                    step={1}
                    disabled={!selectedImage}
                  />
                  <AdjustmentSlider
                    label="Brightness"
                    value={settings.brightness}
                    onChange={(value) =>
                      handleSliderChange(value, "brightness")
                    }
                    min={-100}
                    max={100}
                    step={1}
                    disabled={!selectedImage}
                  />
                  <AdjustmentSlider
                    label="Saturation"
                    value={settings.saturation}
                    onChange={(value) =>
                      handleSliderChange(value, "saturation")
                    }
                    min={-100}
                    max={100}
                    step={1}
                    disabled={!selectedImage}
                  />
                </div>
              </div>
            </div>

            {/* Sticky Save and Reset Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex gap-3">
              {isModified && (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-200 cursor-pointer px-6 py-6 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleReset}
                  disabled={!selectedImage || isLoading}
                >
                  <RotateCcwIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Reset</span>
                </Button>
              )}
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 cursor-pointer px-6 py-6 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={!selectedImage || isLoading || !isModified}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SaveIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-medium">
                  {isLoading ? "Processing..." : "Save"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
