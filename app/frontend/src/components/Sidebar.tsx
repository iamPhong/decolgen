import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Maximize2Icon,
  Wand2Icon,
  PaintbrushIcon,
  InfoIcon,
  Github,
} from "lucide-react";
import { BrowserOpenURL } from "@wails/runtime";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-full">
    {children}
  </span>
);

const menu = [
  {
    to: "/size",
    icon: <Maximize2Icon className="w-6 h-6" />,
    tooltip: "Resize by Size",
  },
  {
    to: "/generateImage",
    icon: <Wand2Icon className="w-6 h-6" />,
    tooltip: "Generate Image",
  },
  {
    to: "/draw",
    icon: <PaintbrushIcon className="w-6 h-6" />,
    tooltip: "Draw",
    badge: "BETA",
  },
];

function OpenGithub() {
  BrowserOpenURL("https://github.com/iamPhong/decolgen");
}

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 w-20 h-screen bg-gradient-to-b from-blue-50 to-white border-r flex flex-col items-center">
      <nav className="flex-1 flex flex-col gap-2 items-center mt-8">
        {menu.map((item) => (
          <div key={item.to} className="relative">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg transition",
                  "hover:bg-blue-100 hover:text-blue-700",
                  isActive
                    ? "bg-blue-100 text-blue-700 border-blue-500"
                    : "text-gray-600 border-transparent"
                )
              }
              title={item.tooltip}
            >
              {item.icon}
            </NavLink>
            {item.badge && <Badge>{item.badge}</Badge>}
          </div>
        ))}
      </nav>
      <div className="flex flex-col gap-2 items-center mb-4">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 text-gray-500 cursor-pointer"
          title="About"
        >
          <InfoIcon className="w-5 h-5" />
        </button>
        <button
          onClick={OpenGithub}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 text-gray-500 cursor-pointer"
          title="GitHub"
        >
          <Github className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
