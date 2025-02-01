import './ResultsItem.css';
const ResultsItem = ({ loaderResult, emptyFinalResults , title, subtitle, image }) => {

    if (loaderResult) return (
        <li className={`result-item`}>
            <div className="result-text">
            <span className="title ">Loading....</span>
            </div>
      </li>
    );
    if (emptyFinalResults) return (
        <li className={`result-item`}>
            <div className="result-text">
            <span className="title ">Empty results</span>
            </div>
      </li>
    );

    return (
      <li className={`result-item`}>
        <img src={image} alt="icon" />
        <div className="result-text">
          <span className="title ">{title}</span>
          <span className="subtitle">{subtitle}</span>
        </div>
      </li>
    );
  };

  export default ResultsItem;
