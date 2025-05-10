import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OpenFileDialog } from "@wails/go/manager/AppManager";
import { toast } from "sonner";
import { manager } from "@wails/go/models";
import FileInfo from "@/components/custom/FileInfo";
import {
  UploadIcon,
  SaveIcon,
  Maximize2Icon,
  ImageIcon,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontalIcon } from "lucide-react";

const filters = [
  { value: "none", label: "None" },
  { value: "NearestNeighbor", label: "Nearest Neighbor" },
  { value: "Linear", label: "Linear" },
  { value: "CatmullRom", label: "CatmullRom" },
  { value: "Lanczos", label: "Lanczos" },
];

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
  hue: number;
}

type SliderValue = [number];

export default function GenerateImage() {
  const [selectedImage, setSelectedImage] = useState<manager.FileResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ImageSettings>({
    width: 0,
    height: 0,
    filter: "none",
    blur: 0,
    sharpening: 0,
    gamma: 1,
    contrast: 0,
    brightness: 0,
    saturation: 0,
    hue: 0,
  });

  const handleSelectFile = async () => {
    try {
      setIsLoading(true);
      const result = await OpenFileDialog();
      if (result && result.status === 1) {
        setSelectedImage(result);
        const fileInfo = result.fileInfo;
        setSettings((prev) => ({
          ...prev,
          width: fileInfo.width || 0,
          height: fileInfo.height || 0,
        }));
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
      // TODO: Implement save functionality
      toast.success("Image saved successfully!");
    } catch (error) {
      toast.error(`Failed to save image: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliderChange = (
    value: SliderValue,
    setting: keyof ImageSettings
  ) => {
    setSettings((prev) => ({ ...prev, [setting]: value[0] }));
  };

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
            {/* Top Section - Upload and Preview (Full width) */}
            <div className="space-y-6">
              <div
                className="w-full border-dashed border-2 rounded-xl p-8 text-center text-blue-400 bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
                onClick={handleSelectFile}
              >
                {selectedImage?.base64Encoded ? (
                  <div className="space-y-4">
                    <div className="w-full h-[500px] flex items-center justify-center bg-white rounded-lg shadow-lg overflow-hidden">
                      <img
                        src={`data:image/png;base64,${selectedImage.base64Encoded}`}
                        alt="preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="text-sm text-blue-500">
                      Click to change image
                    </div>
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
              {selectedImage && <FileInfo data={selectedImage.fileInfo} />}
            </div>

            {/* Bottom Section - Tools (Full width) */}
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
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              width: Number(e.target.value),
                            }))
                          }
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
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              height: Number(e.target.value),
                            }))
                          }
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
                  <Select
                    value={settings.filter}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, filter: value }))
                    }
                    disabled={!selectedImage}
                  >
                    <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.map((filter) => (
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
                </div>
              </div>

              {/* Adjustments */}
              <div className="mt-8 space-y-4 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <SlidersHorizontalIcon className="h-5 w-5" />
                  Adjustments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-blue-600">
                        Blur
                      </Label>
                      <span className="text-sm text-blue-500 font-medium">
                        {settings.blur.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[settings.blur] as SliderValue}
                      onValueChange={(value: SliderValue) =>
                        handleSliderChange(value, "blur")
                      }
                      min={0}
                      max={2}
                      step={0.1}
                      disabled={!selectedImage}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-blue-600">
                        Sharpening
                      </Label>
                      <span className="text-sm text-blue-500 font-medium">
                        {settings.sharpening.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[settings.sharpening] as SliderValue}
                      onValueChange={(value: SliderValue) =>
                        handleSliderChange(value, "sharpening")
                      }
                      min={0}
                      max={2}
                      step={0.1}
                      disabled={!selectedImage}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-blue-600">
                        Gamma
                      </Label>
                      <span className="text-sm text-blue-500 font-medium">
                        {settings.gamma.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[settings.gamma] as SliderValue}
                      onValueChange={(value: SliderValue) =>
                        handleSliderChange(value, "gamma")
                      }
                      min={0}
                      max={2}
                      step={0.1}
                      disabled={!selectedImage}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-blue-600">
                        Contrast
                      </Label>
                      <span className="text-sm text-blue-500 font-medium">
                        {settings.contrast}
                      </span>
                    </div>
                    <Slider
                      value={[settings.contrast] as SliderValue}
                      onValueChange={(value: SliderValue) =>
                        handleSliderChange(value, "contrast")
                      }
                      min={-20}
                      max={20}
                      step={1}
                      disabled={!selectedImage}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-blue-600">
                        Brightness
                      </Label>
                      <span className="text-sm text-blue-500 font-medium">
                        {settings.brightness}
                      </span>
                    </div>
                    <Slider
                      value={[settings.brightness] as SliderValue}
                      onValueChange={(value: SliderValue) =>
                        handleSliderChange(value, "brightness")
                      }
                      min={-20}
                      max={20}
                      step={1}
                      disabled={!selectedImage}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-blue-600">
                        Saturation
                      </Label>
                      <span className="text-sm text-blue-500 font-medium">
                        {settings.saturation}
                      </span>
                    </div>
                    <Slider
                      value={[settings.saturation] as SliderValue}
                      onValueChange={(value: SliderValue) =>
                        handleSliderChange(value, "saturation")
                      }
                      min={-30}
                      max={30}
                      step={1}
                      disabled={!selectedImage}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-blue-600">
                        Hue
                      </Label>
                      <span className="text-sm text-blue-500 font-medium">
                        {settings.hue}
                      </span>
                    </div>
                    <Slider
                      value={[settings.hue] as SliderValue}
                      onValueChange={(value: SliderValue) =>
                        handleSliderChange(value, "hue")
                      }
                      min={-60}
                      max={60}
                      step={1}
                      disabled={!selectedImage}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 cursor-pointer px-6 py-6 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={!selectedImage || isLoading}
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
