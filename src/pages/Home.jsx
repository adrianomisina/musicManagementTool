/* eslint-disable no-unsafe-optional-chaining */
// Home.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ArtistList from '../components/ArtistList';
import SearchBar from '../components/SearchBar';
import Message from '../components/Message';
import { Link } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [newArtistName, setNewArtistName] = useState('');
  const [newArtistRating, setNewArtistRating] = useState(null);
  const [newArtistVideo, setNewArtistVideo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
          params: {
            method: 'chart.gettopartists',
            api_key: '4193c7a4b3358678cc6c10639d43f324',
            format: 'json',
          },
        });

        const initialRatings = response.data.artists.artist.map(() => Math.floor(Math.random() * 10) + 1);
        setRatings(initialRatings);

        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
        params: {
          method: 'artist.search',
          artist: searchQuery,
          api_key: '4193c7a4b3358678cc6c10639d43f324',
          format: 'json',
        },
      });

      setSearchResults(response.data.results?.artistmatches?.artist);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    const updatedArtists = searchQuery
      ? searchResults.filter((_, i) => i !== index)
      : data?.artists?.artist
      ? data.artists.artist.filter((_, i) => i !== index)
      : [];

    setSearchResults(searchQuery ? updatedArtists : null);
    setData(data ? { ...data, artists: { ...data.artists, artist: updatedArtists } } : null);
    const updatedRatings = [...ratings];
    updatedRatings.splice(index, 1);
    setRatings(updatedRatings);
  };

  const handleEditClick = (index, name) => {
    setEditingIndex(index);
    setEditedName(name);
    setSelectedRating(ratings[index]);
  };

  const handleSaveClick = (index) => {
    const updatedArtists = [...(searchQuery ? searchResults : data?.artists?.artist)];
    updatedArtists[index].name = editedName;

    setSearchResults(searchQuery ? updatedArtists : null);
    setData(data ? { ...data, artists: { ...data.artists, artist: updatedArtists } } : null);

    const updatedRatings = [...ratings];
    updatedRatings[index] = selectedRating;
    setRatings(updatedRatings);

    setEditingIndex(null);
    setEditedName('');
  };

// ...

const handleAddArtist = (e) => {
  e.preventDefault();

  // Verificar se o nome do artista foi preenchido
  if (!newArtistName) {
    setErrorMessage('Por favor, insira o nome do artista.');
    return;
  }

  // Verificar se a classificação foi selecionada
  if (newArtistRating === null) {
    setErrorMessage('Por favor, selecione a classificação.');
    return;
  }

  // Criar um novo objeto de artista
  const newArtist = { name: newArtistName, rating: newArtistRating, video: newArtistVideo };

  // Adicionar o novo artista à lista existente na primeira posição
  const updatedArtists = searchResults ? [newArtist, ...searchResults] : [newArtist, ...data?.artists?.artist];

  // Atualizar o estado da lista de artistas
  setSearchResults(updatedArtists);
  setData(data ? { ...data, artists: { ...data.artists, artist: updatedArtists } } : null);

  // Adicionar o rating do novo artista à mesma posição no array de ratings
  const updatedRatings = [...ratings];
  updatedRatings.splice(0, 0, newArtistRating);
  setRatings(updatedRatings);

  // Limpar os campos e a mensagem de erro após adicionar o artista
  setNewArtistName('');
  setNewArtistRating(null);
  setNewArtistVideo('');
  setErrorMessage('');
};

// ...


  const artists = searchQuery ? searchResults : (data && data.artists && data.artists.artist);

  const sortArtistsByRating = () => {
    if (artists) {
      const sortedArtists = [...artists];
      sortedArtists.sort((a, b) => ratings[artists.indexOf(b)] - ratings[artists.indexOf(a)]);
      return sortedArtists.slice(0, 5);
    }
    return [];
  };

  const top5Artists = sortArtistsByRating();

  return (
    <div className="flex justify-center gap-12 h-screen overflow-auto">
      <div className="w-6/12 ml-48 mt-16 mb-20 h-screen overflow-auto">
        <div className="border border-white rounded-lg bg-white">
          <div className="flex justify-between border-b-2 p-4">
            <span>
              <h1 className="text-2xl text-purple-800 font-semibold">My artists</h1>
            </span>

            <Link to='new_artist'>
              <button
                className="bg-gradient-to-r from-pink-500 to-purple-800 px-4 py-2 border rounded-md text-lg text-white font-semibold"
                type="button"
              >
                +
              </button>
            </Link>
          </div>
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onSearch={handleSearch} title='Search' />
          <div>
            {loading && <p className="text-center text-2xl text-purple-800">Carregando...</p>}
            {!loading && error && <p>Ocorreu um erro: {error.message}</p>}
            {!loading && !error && !artists && !searchQuery && <Message text="Nenhum artista encontrado." />}
            {!loading && !error && artists && (
              <ArtistList
                artists={artists}
                onDelete={handleDelete}
                onEdit={handleEditClick}
                onSave={handleSaveClick}
                editingIndex={editingIndex}
                editedName={editedName}
                setEditedName={setEditedName}
                ratings={ratings}
                setRatings={setRatings}
              />
            )}
            {!loading && !error && !artists && searchQuery && (
              <Message text={`Nenhum artista encontrado para a pesquisa "${searchQuery}".`} />
            )}
            {!loading && !error && artists && artists.length === 0 && <Message text="Não há mais artistas na lista." />}
          </div>
        </div>
      </div>
      <div className="flex flex-col mr-48 mt-16 mb- w-4/12 gap-8">
        <div className="border border-white rounded-lg h-fit bg-white p-2 overflow-auto">
          <div className="flex justify-between border-b-2 p-4">
            <span>
              <h1 className="text-2xl text-purple-800 font-semibold">Top 5</h1>
            </span>
            <p className="text-md text-gray-600 font-semibold">Highest Rate</p>
          </div>
          <div className="bg-secondary-custom-color w-full p-4 border rounded-lg mt-3">
            {top5Artists.map((artist, index) => (
              <div key={index} className="mb-2 flex justify-between p-2 bg-white border rounded-lg">
                <p className="text-lg text-purple-800 font-semibold">{artist.name}</p>
                <p className="text-lg text-purple-800 font-semibold">
                  {ratings.find((r, i) => i === artists.indexOf(artist))}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-white rounded-lg h-fit bg-white p-2 overflow-auto">
          <div className="flex border-b-2 p-3">
            <span>
              <h1 className="text-2xl text-purple-800 font-semibold">Quick add</h1>
            </span>
          </div>
          <form onSubmit={handleAddArtist} className="p-2 w-full">
            <div className="flex flex-col mt-3 p-2 gap-2 text-gray-600">
              <label htmlFor="artistName">Artist Name</label>
              <input
                type="text"
                className="border border-gray-400 p-1 focus:outline-none focus:border-purple-500"
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col mt-3 p-2 gap-2 text-gray-600">
              <label htmlFor="artistVideo">Favorite Music Video (YouTube)</label>
              <input
                type="text"
                className="border border-gray-400 p-1 focus:outline-none focus:border-purple-500"
                value={newArtistVideo}
                onChange={(e) => setNewArtistVideo(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-3 p-2 gap-2 w-full text-gray-500">
              <p>Rating</p>
              <div className="flex text-lg w-full gap-2 item-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <label key={rating} className="flex items-center text-sm cursor-pointer xl:w-96">
                    <input
                      type="radio"
                      value={rating}
                      checked={newArtistRating === rating}
                      onChange={() => setNewArtistRating(rating)}
                      style={{
                        cursor: 'pointer',
                        appearance: 'none',
                        width: '1.5em',
                        height: '1.5em',
                        borderRadius: '50%',
                        backgroundColor: newArtistRating === rating ? '#9D367B' : 'transparent',
                        boxSizing: 'border-box',
                        border: '1px solid #ccc',
                        marginRight: '.5rem',
                      }}
                      required
                    />
                    {rating}
                  </label>
                ))}
              </div>
            </div>
            {errorMessage && (
              <small className="text-red-500" role="alert">
                {errorMessage}
              </small>
            )}
            <div className="flex justify-end mt-4 p-4">
              <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-800 px-4 py-2 text-white font-semibold border rounded-md">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
