const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-10 bg-transparent footer border-[#27231f] border-t footer-center bg-base-200 text-base-content">
      <p className="text-base font-light text-center text-gray-300">
        Copyright © {currentYear} - All right reserved by Akhmad Nuryasin
      </p>
    </footer>
  );
};

export default Footer;
