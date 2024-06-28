import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AnimationContext } from "@/context/animation";

export function Faq() {
  const { riseUpVariant2, riseUpItem } = useContext(AnimationContext);
  return (
    <div
      id="faq"
      className="px-4 py-32 text-white bg-background sm:px-24 md:px-36 lg:px-80"
    >
      <div className="mb-4 text-center">
        <motion.h2 initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
          className="text-2xl font-bold md:text-3xl text-primary">
          Faq
        </motion.h2>
        <motion.p initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
          className="text-base font-light text-gray-300">
          Pertanyaan yang sering ditanyakan
        </motion.p>
      </div>
      <motion.div variants={riseUpVariant2} initial="hidden" whileInView="visible">
        <Accordion type="single" collapsible className="w-full text-center sm:text-start">
          <motion.div variants={riseUpItem}>
            <AccordionItem value="item-1" className="border-[#27231f]">
              <AccordionTrigger className="text-base font-light text-gray-300">
                Apa itu aplikasi diagnosa kerusakan sepeda motor matic dengan
                metode Naive Bayes?
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-300 font-extralight">
                Aplikasi diagnosa kerusakan sepeda motor matic dengan metode
                Naive Bayes adalah sebuah sistem yang menggunakan algoritma
                Naive Bayes untuk menganalisis gejala-gejala yang diberikan oleh
                pengguna dan memprediksi kemungkinan kerusakan yang mungkin
                terjadi pada sepeda motor matic.
              </AccordionContent>
            </AccordionItem>
          </motion.div>
          <motion.div variants={riseUpItem}>
            <AccordionItem value="item-2" className="border-[#27231f]">
              <AccordionTrigger className="text-base font-light text-gray-300">
                Bagaimana aplikasi ini menentukan kerusakan sepeda motor?
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-300 font-extralight">
                Aplikasi meminta pengguna untuk memberikan gejala sepeda motor
                matic mereka. Kemudian, menggunakan model Naive Bayes yang sudah
                dilatih, aplikasi memprediksi kerusakan berdasarkan gejala
                tersebut.
              </AccordionContent>
            </AccordionItem>
          </motion.div>
          <motion.div variants={riseUpItem}>
            <AccordionItem value="item-3" className="border-[#27231f]">
              <AccordionTrigger className="text-base font-light text-gray-300">
                Seberapa akurat aplikasi ini dalam mendiagnosa kerusakan sepeda
                motor?
              </AccordionTrigger>
              <AccordionContent className="text-base text-center text-gray-300 font-extralight sm:text-start">
                Tingkat akurasi aplikasi ini tergantung pada seberapa baik model
                Naive Bayes yang telah dilatih dan seberapa lengkap dataset yang
                digunakan untuk melatih model tersebut. Semakin besar dan
                representatif dataset latihan yang digunakan, semakin baik juga
                akurasi prediksinya.
              </AccordionContent>
            </AccordionItem>
          </motion.div>
          <motion.div variants={riseUpItem}>
            <AccordionItem value="item-4" className="border-[#27231f]">
              <AccordionTrigger className="text-base font-light text-gray-300">
                Apakah aplikasi ini dapat digunakan untuk semua merek dan model
                sepeda motor matic?
              </AccordionTrigger>
              <AccordionContent className="text-base text-center text-gray-300 font-extralight sm:text-start">
                Secara teori, aplikasi ini dapat digunakan untuk mendiagnosa
                kerusakan pada berbagai merek dan model sepeda motor matic.
                Namun, untuk hasil yang lebih akurat, disarankan untuk
                menggunakan data yang spesifik atau dilatih pada merek dan model
                tertentu.
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        </Accordion>
      </motion.div>
    </div>
  );
}