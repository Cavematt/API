import React, { useEffect, useState } from 'react'
import MovieList from "./components/MovieList"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import MovieListHeading from './components/MovieListHeading'
import SearchBox from './components/SearchBox'
import AddFavourite from './components/AddFavourites' //this is passed into movielist down in return
import RemoveFavourites from './components/RemoveFavourites'

const App = () => {
  const [movies, setMovies] = useState([])
  const [favourites, setFavourites] = useState([])
  const [searchValue, setSearchValue] = useState('')

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

  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie] //this copies existing favourites and adds new movie into it
    setFavourites(newFavouriteList)
    saveToLocalStorage(newFavouriteList) //this saves it to storage
  }

  //useeffect always called on first render
  useEffect(()=>{
    getMovieRequest(searchValue);
  }, [searchValue]); // when search value is changed it calls get movie request


  //the below checks if there is any existing storage of films and loads them, if not, an empty array is loaded (at bottom)
  useEffect(()=> {
    const movieFavourites = JSON.parse(localStorage.getItem("react-movie-app-favourites")
    )
    setFavourites(movieFavourites)
  }, [])

  //the below saves items to storage the 2nd argument after setitem is the items itself, first is name
  //also is called in addFavouriteMovie functions. It then is loaded in the above useeffect hook
  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items))
  }


  //below takes in a movie takes the ID, filter outs  into a new array without the exisiting one
  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => favourite.imdbID !== movie.imdbID
    )
    setFavourites(newFavouriteList)
    saveToLocalStorage(newFavouriteList)
  }

  return <div className="container-fluid movie-app">
    <div className="row d-flex align-items-center mt-4 mb-4">
      <MovieListHeading heading='Movies'/>
      <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
    </div>
    <div className="row">
      <MovieList movies={movies} handleFavouritesClick={addFavouriteMovie} favouriteComponent={AddFavourite}/> 
    </div>
    <div className="row d-flex align-items-center mt-4 mb-4">
      <MovieListHeading heading='Favourites'/>
    </div>
    <div className="row">
      <MovieList movies={favourites} handleFavouritesClick={removeFavouriteMovie} favouriteComponent={RemoveFavourites}/> 
    </div>
  </div>
}

export default App;
