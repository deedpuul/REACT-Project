import Search from "./componentns/Search.tsx";
import { useState, useEffect, useCallback } from "react";
import Spinner from "./componentns/Spinner.tsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface Movie {
  id: number;
  title: string;
}

const App = () => {
  const [searchTerm, setsearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovielist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const headers = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      };

      const response = await fetch(endpoint, headers);
      

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      console.log(data);

      if (data.Response === "false") {
        setErrorMessage(data.Error || "failed to fetch movies");
        setMovielist([]);
        return;
      }
      setMovielist(data.results);
    } catch (error) {
      console.log(`Error fetching movies. ${error}`);
      setErrorMessage("Error fetcing movies. pLease tyr again later");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <main>
      <div className={"pattern"} />
      <div className={"wrapper"}>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className={"text-gradient"}>Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        <section className={"all-movies"}>
          <h2 className={"mt-[40px]"}>All MOvies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className={"text-red-500"}>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <p key={movie.id} className={"text-white"}>
                  {movie.title}
                </p>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};
export default App