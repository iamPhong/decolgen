import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-20">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

export default App;
