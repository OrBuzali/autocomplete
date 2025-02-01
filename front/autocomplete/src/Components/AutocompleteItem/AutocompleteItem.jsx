import './AutocompleteItem.css';
import MarkedText from '../MarkedText/MarkedText';

const AutocompleteItem = ({ emptyResults , isLoading, title, subtitle, image,employeeId, substring, onClickEmployee }) => {
    if (emptyResults) return (
        <li className={`autocomplete-item`}>
            <div className="autocomplete-text">
            <span className="title ">Empty results</span>
            </div>
      </li>
    );

    const titleMarked = <MarkedText text={title} substring={substring} />;
    const subtitleMarked = <MarkedText text={subtitle} substring={substring} />;
    
    return (
      <li onClick={() => onClickEmployee(employeeId)}  className={`autocomplete-item ${isLoading ? "loading" : ""}`}>
        {isLoading ? (
          <div className="loader-icon"></div>
        ) : (
          <img src={image} alt="icon" />
        )}
        <div className="autocomplete-text">
          <span className="title ">{isLoading ? "Loading..." : titleMarked }</span>
          {!isLoading && <span className="subtitle">{subtitleMarked}</span>}
        </div>
      </li>
    );
  };

  export default AutocompleteItem;
