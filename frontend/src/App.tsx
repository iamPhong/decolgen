import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
