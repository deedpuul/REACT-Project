import Search from "./componentns/Search.tsx";
import { useState, useEffect, useCallback } from "react";
import Spinner from "./componentns/Spinner.tsx";
import Moviecard from "./componentns/Moviecard.tsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.ts";


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  original_language: string;
}

interface TrendingMovie {
  $id: string;
  title: string;
  poster_url: string;
  count: number;
}


const App = () => {
  const [searchTerm, setsearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovielist] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearchTerm,setDebounceSearchTerm] = useState<string>('');

  //Debounce  the search term to prevent making too many API request
  // by wating for the use to stop typing for 500ms
//usedebounce hook
  useDebounce(()=>setDebounceSearchTerm(searchTerm),1000,[searchTerm])

  const fetchMovies = useCallback(async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");
    
    console.log(API_KEY)

    try {
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query )}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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
      setMovielist(data.results || []);

      if(query && data.results.length > 0){
        console.log(query)
        console.log(data.results[0])
        await updateSearchCount(query,data.results[0])
      }
      // updateSearchCount(searchTerm, data.results[0])


    } catch (error) {
      console.log(`Error fetching movies. ${error}`);
      setErrorMessage("Error fetcing movies. pLease try again later");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTrendingMovies = async ()=>{ 
    try{
const movies = await getTrendingMovies();

setTrendingMovies(movies);
    }catch(error){
      console.error(`Error fetching trending movies : ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
    
  }, [fetchMovies,debouncedSearchTerm]);

  useEffect(()=>{
loadTrendingMovies();
  },[])

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

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index)=>(
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title}/>
                </li>
              ))}
            </ul>
          </section>
        )} 

        <section className={"all-movies"}>
          <h2>All MOvies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className={"text-red-500"}>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                
                <Moviecard key={movie.id} movie={movie}/>
                
                
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};
export default App