import { useContext } from "react";
import { AnimationContext } from "../context/animation";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";

const Header = () => {
  const { riseUpVariant, riseUpItem } = useContext(AnimationContext);
  const history = useHistory();

  const handleDiagnosaRedirect = () => {
    history.push("/diagnosa");
  };

  return (
    <section className="bg-background">
      <div className="max-w-screen-xl px-4 py-32 mx-auto lg:flex lg:h-screen lg:items-center">
        <motion.div
          variants={riseUpVariant}
          initial="hidden"
          whileInView="visible"
          className="max-w-xl mx-auto text-center"
        >
          <motion.h2
            variants={riseUpItem}
            className="text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl text-wrap sm:block"
          >
            Solusi Pintar
          </motion.h2>
          <motion.h2
            variants={riseUpItem}
            className="text-5xl font-extrabold leading-none tracking-tight sm:text-6xl text-wrap sm:block text-secondary"
          >
            Untuk{" "}
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "1px white",
                textStroke: "1px white",
              }}
            >
              Sepeda
            </span>
          </motion.h2>
          <motion.h2
            variants={riseUpItem}
            className="text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl sm:block"
          >
            Motor Matic
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { delay: 1, duration: 1 },
            }}
            className="mt-4 text-base font-light text-gray-300"
          >
            Diagnosa Cepat & Akurat untuk Motor Matic Anda. Hemat Waktu & Biaya,
            Untuk Deteksi Kerusakan.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              className="block w-full rounded-lg bg-[#2b1c0f] px-8 py-3 text-sm font-medium text-white  shadow-2xl hover:-translate-y-0.5 ease-in-out duration-150 sm:w-auto"
              href="#faq"
            >
              Question
            </a>
            <button
              className="block w-full rounded-lg bg-primary px-8 py-3 text-sm font-medium text-background  shadow-2xl hover:-translate-y-0.5 hover:shadow-primary ease-in-out duration-150 sm:w-auto"
              onClick={handleDiagnosaRedirect}
            >
              Diagnosa
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Header;
