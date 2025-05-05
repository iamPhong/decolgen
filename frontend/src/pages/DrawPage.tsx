import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

export default function DrawPage() {
  return (
    <div className="w-full h-screen">
      <Tldraw />
    </div>
  );
}
