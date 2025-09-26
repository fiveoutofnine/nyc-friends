const P: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      className="font-normal not-italic text-gray-12 before:content-none after:content-none"
      {...props}
    />
  );
};

export default P;
