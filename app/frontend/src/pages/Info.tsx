import {
  Maximize2Icon,
  Wand2Icon,
  PaintbrushIcon,
  GithubIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserOpenURL } from "@wails/runtime";

const features = [
  {
    icon: <Maximize2Icon className="w-6 h-6" />,
    title: "Resize by File Size",
    description:
      "Resize your images to a specific file size while maintaining quality. Perfect for optimizing images for web or storage.",
  },
  {
    icon: <Wand2Icon className="w-6 h-6" />,
    title: "Image Editor",
    description:
      "Advanced image editing tools including filters, adjustments, and transformations. Fine-tune your images with precision.",
  },
  {
    icon: <PaintbrushIcon className="w-6 h-6" />,
    title: "Drawing Tools",
    description:
      "Express your creativity with our drawing tools. Create and edit images with intuitive drawing features.",
  },
];

export default function Info() {
  const handleOpenGithub = () => {
    BrowserOpenURL("https://github.com/iamphong/decolgen");
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">Decolgen</h1>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            A powerful desktop application for image manipulation and editing,
            built with modern technologies.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-100 mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">Go</div>
              <div className="text-sm text-gray-500">Backend</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">React</div>
              <div className="text-sm text-gray-500">Frontend</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">Wails</div>
              <div className="text-sm text-gray-500">Framework</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                Tailwind
              </div>
              <div className="text-sm text-gray-500">Styling</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Button
            onClick={handleOpenGithub}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto cursor-pointer"
          >
            <GithubIcon className="w-5 h-5" />
            <span>View on GitHub</span>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
