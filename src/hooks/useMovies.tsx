import React, { useContext, useEffect, useState } from 'react'
import { api } from '../services/api';

export const MoviesContext = React.createContext<MoviesContextProps>({} as MoviesContextProps)

interface MoviesContextProps {
  genres: GenreResponseProps[],
  movies: MovieProps[],
  selectedGenreId: number,
  selectedGenre: GenreResponseProps,
  handleClickButton: (id: number) => void,
}

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export const MoviesProvider: React.FC = ({ children }) => {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }
  return (
    <MoviesContext.Provider value={{
      genres,
      movies,
      selectedGenreId,
      selectedGenre,
      handleClickButton
    }}>
      {children}
    </MoviesContext.Provider>
  )
}

export function useMovies() {
  const context = useContext(MoviesContext);

  if (!context) {
    throw new Error('Context must be within a MoviesProvider.');
  }

  const {
    genres,
    movies,
    selectedGenreId,
    selectedGenre,
    handleClickButton
  } = context;

  return {
    genres,
    movies,
    selectedGenreId,
    selectedGenre,
    handleClickButton
  };
}

export default MoviesProvider;