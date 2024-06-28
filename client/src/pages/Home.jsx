import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { Faq } from "@/components/Faq";
import Profit from "@/components/Profit";
import Footer from "@/components/Footer";

function Home() {
  return (
    <div className="bg-background">
      <Navbar />
      <Header />
      <Profit />
      <Faq />
      <Footer />
    </div>
  );
}

export default Home;
