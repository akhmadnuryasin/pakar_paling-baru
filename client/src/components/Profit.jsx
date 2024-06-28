import { motion } from "framer-motion";

const Profit = () => {
  return (
    <section className="text-white bg-background">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="max-w-lg mx-auto text-center">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold md:text-3xl text-primary"
          >
            Alasan Untuk Bergabung
          </motion.h2>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-base font-light text-gray-300 sm:mt-4"
          >
            Setelah bergabung, Anda dapat memiliki kendali penuh terhadap akun
            Anda dan fitur yang tersedia.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Profit;
