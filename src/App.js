import React, { useEffect, useState } from 'react'
import MovieList from "./components/MovieList"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import MovieListHeading from './components/MovieListHeading'
import SearchBox from './components/SearchBox'

const App = () => {
  const [movies, setMovies] = useState([])
  const [searchValue, setSearchValue] = useState()

  //must pass in searchvalue to async request as well as in the useEffect
  //async called as soon as typed
  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=72e7c460`; 
    //backtick important intstead of "" to know template string instead of "normal" string
    const response = await fetch(url);
    const responseJson = await response.json();

    //the below stops errors when loading/loading too much
    if(responseJson.Search) {
      setMovies(responseJson.Search)
    }
    
  }

  //useeffect always called on first render
  useEffect(()=>{
    getMovieRequest(searchValue);
  }, [searchValue]); // when search value is changed it calls get movie request

  return <div className="container-fluid movie-app">
    <div className="row d-flex align-items-center mt-4 mb-4">
      <MovieListHeading heading='Movies'/>
      <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
    </div>
    <div className="row">
      <MovieList movies={movies} />
    </div>
  </div>
}

export default App;
