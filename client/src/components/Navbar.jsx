import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="">
      <motion.header
        initial={{ y: -250 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1, duration: 1.5, stiffness: 10 }}
        className="bg-transparent"
      >
        <div className="max-w-screen-xl py-4 mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-8 h-11">
            <Link
              to="/"
              className="flex items-center justify-center text-xl font-bold text-white gap-x-1 md:text-2xl"
            >
              <img
                src="./nav_logo.svg"
                className="h-12"
                alt="sistem pakar logo"
              />
              <span className="text-base font-medium">Sistem Pakar</span>
            </Link>
            <div className="flex items-center gap-4"></div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5, stiffness: 10 }}
          className="bg-[#21160d] border-[#382514] border-y px-4 py-2 text-white"
        >
          <p className="text-xs font-normal text-center">
            Antusias Dengan Sistem?{" "}
            <a href="#" className="inline-block">
              Berikan Saran Sekarang!{" "}
              <span aria-hidden="true" role="img">
                🎉
              </span>
            </a>
          </p>
        </motion.div>
      </motion.header>
    </div>
  );
};

export default Navbar;
