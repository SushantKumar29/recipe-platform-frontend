const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t border-base-content/10 bg-base-300">
      <div className="mx-auto max-w-6xl py-4">
        <h1 className="text-sm font-bol text-center">&copy; {currentYear}</h1>
      </div>
    </footer>
  );
};

export default Footer;
