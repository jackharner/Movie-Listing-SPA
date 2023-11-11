import { useEffect, useState } from "react";
import { useMovies } from "./components/useMovies";
import { useLocalStorageState } from "./components/useLocalStorageState";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { NavBar } from "./components/NavBar";
import { Search } from "./components/Search";
import { Numresults } from "./components/Numresults";
import { Main } from "./components/Main";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";

export const KEY = "bf677b32"; // API key is only stored here bcause this is a free API

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    // console.log("method entered with id ", id);
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      // console.log("D");
    },
    [query]
  );

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
