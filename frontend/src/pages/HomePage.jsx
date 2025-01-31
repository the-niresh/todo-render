import { useContext } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { AppContent } from "@/context/app.context";
import SidePanel from "@/components/SidePanel";

const HomePage = () => {
  const { userData } = useContext(AppContent);
  return (
    <div>
      {userData && <SidePanel />}
      <div className="absolute inset-0 h-full w-full">
        <Header />
      </div>
    </div>
  );
};

export default HomePage;