import React from 'react';
import { useRef } from "react";
import { useState, useEffect } from 'react';
import axiosInstance from './utils/axiosInstance';
import './App.css';
import AutocompleteItem from './Components/AutocompleteItem/AutocompleteItem';
import ResultsItem from './Components/ResultsItem/ResultsItem';
import UserModal from "./Components/UserModal/UserModal";


const App = () => {

  const dialog = useRef();  
  const [inputValue, setInputValue] = React.useState(''); // input search
  const [suggestions, setSuggestions] = React.useState([]); // array of suggestions after keydown
  const [isLoading, setIsLoading] = useState(false); // loader until ajax request done
  const [emptyResults, setEmptyResults] = useState(false); // flag if empty result - for display on autocomplete div
  const [emptyFinalResults, setEmptyFinalResults] = useState(false); // flag if empty result - for display on results div
  const [finalResults,setFinalResults] = useState([]); // array of results after click button
  const [loaderFinalResults, setLoaderFinalResults] = useState(false) // loader until ajax request done
  const [cacheData, setCacheData] = useState({}); // cache data to prevent ajax request when already search the string
  const [employeeSelected, setEmployeeSelected] = useState(null);
    // fill data to show results after search click
  const handleResponseButtonClicked = (responseData) => {
    const type = responseData?.type;
    const substring = responseData?.keyword;
    const arrResults = [];
    setLoaderFinalResults(false);
    switch (type) {
        case 'results_found':
                const formattedResults = responseData.results.map((value) => ({
                title: value.fullname,
                subtitle: value.work_title,
                image: value.image_url,
                substring: substring
              }));
              setFinalResults(formattedResults);
        break;
        case 'empty_results':
                setEmptyFinalResults(true);
                break;
        default: alert("Internal server Error, please try again later"); // error server / unknown type        
    }

  }
    // fill data to show autocomlete after keydown
  const handleResponseAutoComplete = (responseData) => {
    console.log("now response data: ",responseData);
    const type = responseData?.type;
    const substring = responseData?.keyword;
    const arrResults = [];
    setIsLoading(false);
    switch (type) {
        case 'results_found':
                console.log("responseData.results" , responseData.results);
                const formattedResults = responseData.results.map((value) => ({
                title: value.fullname,
                employeeId: value.employeeId,
                subtitle: value.work_title,
                image: value.image_url,
                substring: substring
              }));
              
              setSuggestions(formattedResults);
        break;
        case 'empty_results':
                setEmptyResults(true);
                break;
    }
  }

    // insert to cache data to prevent requests to server
  const handleCacheData = (responseData) => {
    const type = responseData?.type;
    console.log("the type is",type);
    if (type == 'results_found') {
        const keyword = responseData?.keyword;
        const newCacheData = {[keyword] : responseData.results};
        setCacheData(prevCacheData => ({
            ...prevCacheData,
            ...newCacheData
        }));
    }
  }
    // search data from string , first of all check in cache
  const searchByString = async(inputValue , sourceType = 'autocomplete') => {
    let response,responseData;
    const uriEncoded = encodeURIComponent(inputValue);
    console.log(cacheData);
    console.log(inputValue);
    try { 
        if (cacheData.hasOwnProperty(inputValue)) {
            responseData = {type: 'results_found', keyword:inputValue, results: [...cacheData[inputValue]]   }
        }
        else { // just if not exists in the cache, go to server
           const responseObject = await axiosInstance.get(`/search-autocomplete/${uriEncoded}`);
           responseData = responseObject?.data;
           handleCacheData(responseData);
        }
        if (sourceType == 'autocomplete') handleResponseAutoComplete(responseData);
        if (sourceType == 'buttonClicked') handleResponseButtonClicked(responseData);
    } catch (err) {
        alert("Server Error");
    }
  }
    // keydown in the input
  const handleInputChange = e => {
    const value = e.target.value;
    setInputValue(value);
    setSuggestions([]);
    if (value == '' || value.length < 2) {
      setSuggestions([]);
      return;
    }
    if (value.length >= 2) { // just if exists at least 2 chars
        setIsLoading(true);
        setEmptyResults(false);
        searchByString(value);
        return;
    }
  };

  const handleSearchButton = async () => {
    if (inputValue == '') {
        alert("Cannot search for an empty value");
        dialog.current.open();
        return;
    }
    setSuggestions([]);
    setEmptyResults(false);
    setEmptyFinalResults(false);
    setLoaderFinalResults(true);
    searchByString(inputValue,'buttonClicked')

  }

  const handleClickEmployee = async (id) => {
    try { 
        const responseObject = await axiosInstance.get(`get-employee-by-id/${id}`);
        const responseData = responseObject?.data;
        console.log("res data:",responseData?.results[0]?.id);
        if (responseData?.results[0]?.id) {
            setEmployeeSelected({
                firstName:responseData?.results[0]?.fname,
                lastName:responseData?.results[0]?.lname,
                workTitle:responseData?.results[0]?.work_title,
                createTime:responseData?.results[0]?.create_time,
                imgUrl:responseData?.results[0]?.image_url,
            });
        }

    } catch (err) {
        console.log(err);
        alert("Server Error2");
    }
  }
  useEffect(() => {
    if (employeeSelected) {
        dialog.current.open();
    }
  },[employeeSelected])

  return (
    <>
    {employeeSelected && <UserModal  ref ={dialog} firstName={employeeSelected?.firstName} lastName={employeeSelected?.lastName} workTitle={employeeSelected?.workTitle} createTime={employeeSelected?.createTime} imgUrl={employeeSelected?.imgUrl} /> }
    <div className='container'>
    <h1 className="page-title">Looking for an employee ?</h1>
      <div className='input-wrapper'>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          className='input-field'
          placeholder='Search Your Employee'
        />
        <button className='search-btn' onClick={handleSearchButton}>🔍</button>
      </div>
      {(suggestions.length > 0 || isLoading || emptyResults )&& (
        <ul className='autocomplete-list'>
          {emptyResults && <AutocompleteItem emptyResults/> }  
          {isLoading && <AutocompleteItem isLoading />}
          {suggestions.map((suggestion, index) => (
            <AutocompleteItem
              key={index}
              title={suggestion.title}
              subtitle={suggestion.subtitle}
              image={suggestion.image}
              substring={suggestion.substring}
              employeeId={suggestion.employeeId}
              onClickEmployee={handleClickEmployee}
            />
          ))}
        </ul>
      )}
    </div>
        {(finalResults.length > 0 || emptyFinalResults || loaderFinalResults) &&
        
            <div className='results-container'>
             {emptyFinalResults && <ResultsItem emptyFinalResults/> }    
             {loaderFinalResults &&  <ResultsItem loaderResult /> }  
             {finalResults.map((result, index) => (
                <ResultsItem
                key={index}
                title={result.title}
                subtitle={result.subtitle}
                image={result.image}
                />
             ))} 
            
            </div>
        }
        </>
  );
};

export default App;
