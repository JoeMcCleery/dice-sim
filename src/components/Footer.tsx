function Footer() {
  return (
    <footer className="flex items-center justify-center space-x-4 bg-teal-600 p-2">
      <p>
        By{' '}
        <a
          href="https://github.com/JoeMcCleery"
          target="_blank"
          className="underline"
          title="Joe McCleery Github Page"
        >
          Joe McC
        </a>
      </p>
      <a
        href="https://github.com/JoeMcCleery/dice-sim"
        target="_blank"
        className="underline"
        title="Dice Simulator Github Page"
      >
        View Source Code
      </a>
    </footer>
  );
}

export default Footer;
