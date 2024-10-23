const Pill = ({ image, text, onClick }) => {
  return (
    <span className="user-pill" onClick={onClick}>
      <img src={image} />
      <span>{text} &times;</span>
    </span>
  );
};

export default Pill;
