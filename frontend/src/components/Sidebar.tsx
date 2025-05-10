import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  MoveHorizontalIcon,
  InfoIcon,
  Github,
  Pencil,
} from "lucide-react";
import { BrowserOpenURL } from "@wails/runtime";

const menu = [
  {
    to: "/size",
    icon: <ImageIcon className="w-6 h-6" />,
    tooltip: "Resize by Size",
  },
  {
    to: "/dimensions",
    icon: <MoveHorizontalIcon className="w-6 h-6" />,
    tooltip: "Resize by Dimensions",
  },
  {
    to: "/draw",
    icon: <Pencil className="w-6 h-6" />,
    tooltip: "Draw",
  },
];

function OpenGithub() {
  BrowserOpenURL("https://github.com/iamPhong/decolgen");
}

export default function Sidebar() {
  return (
    <aside className="w-20 h-screen bg-gradient-to-b from-blue-50 to-white border-r flex flex-col items-center">
      <nav className="flex-1 flex flex-col gap-2 items-center mt-6">
        {menu.map((item) => (
          <NavLink
            key={item.to}
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
