import './MarkedText.css';

const MarkedText = ({ text, substring }) => {
    if (!text || !substring) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${substring})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === substring.toLowerCase() ? (
            <span key={index} className="yellow-background">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };
  
  export default MarkedText;
  