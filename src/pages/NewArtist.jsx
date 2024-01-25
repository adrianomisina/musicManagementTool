/* eslint-disable react/prop-types */
import  { useState } from 'react';
import axios from 'axios';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import SearchBar from '../components/SearchBar';
import { GiCompactDisc } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const NewArtist = () => {
  const [newArtistInfo, setNewArtistInfo] = useState({
    name: '',
    description: '',
    video: '',
    rating: 1,
    genres: [],
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);
  const [draggedAlbum, setDraggedAlbum] = useState(null);

  const handleArtistChange = (e) => {
    const { id, value } = e.target;
    setNewArtistInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setNewArtistInfo((prevInfo) => ({
      ...prevInfo,
      rating,
    }));
  };

  const removeTag = (tag) => {
    setNewArtistInfo((prevInfo) => ({
      ...prevInfo,
      genres: prevInfo.genres.filter((genre) => genre !== tag),
    }));
  };

  const renderTag = (props) => (
    <span key={props.key} className={props.className} style={props.style}>
      {props.tag}
      <button
        type="button"
        onClick={() => removeTag(props.tag)}
        className="ml-2 -mt-2 text-white text-2xl font-semibold"
      >
        x
      </button>
    </span>
  );

  const searchAlbums = async () => {
    try {
      setLoading(true);
      console.log('Searching for albums...');
      const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
        params: {
          method: 'album.search',
          album: searchQuery,
          api_key: '4193c7a4b3358678cc6c10639d43f324',
          format: 'json',
        },
      });

      console.log('API response:', response.data);
      const albums = response.data.results?.albummatches?.album || [];
      const detailedAlbums = await Promise.all(
        albums.map(async (album) => {
          const detailedResponse = await axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
              method: 'album.getInfo',
              artist: album.artist,
              album: album.name,
              api_key: '4193c7a4b3358678cc6c10639d43f324',
              format: 'json',
            },
          });

          return detailedResponse.data.album;
        })
      );

      setSearchResults(detailedAlbums);
    } catch (error) {
      console.error('Error searching for albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    console.log('Search button clicked');
    searchAlbums();
  };

  const handleAlbumDrop = (e) => {
    e.preventDefault();

    // Verificar se o álbum já está nos favoritos e se a lista não está cheia
    if (draggedAlbum && !favoriteAlbums.includes(draggedAlbum) && favoriteAlbums.length < 6) {
      setFavoriteAlbums((prevAlbums) => [...prevAlbums, draggedAlbum]);

      // Remover o álbum da lista de pesquisa
      setSearchResults((prevResults) => prevResults.filter((result) => result !== draggedAlbum));
    }
  };

  const handleDragStart = (e, album) => {
    setDraggedAlbum(album);
  };

  const handleDragEnd = () => {
    setDraggedAlbum(null);
  };

  const handleRemoveFromFavorites = (album) => {
    setFavoriteAlbums((prevAlbums) => prevAlbums.filter((favAlbum) => favAlbum !== album));
  };

  return (
    <div className="h-screen flex flex-col justify-center bg-white p-4 overflow-auto ml-48 mr-48">
      <div className="border-b-2 p-4">
        <h1 className="text-2xl text-purple-800 font-semibold">New artists</h1>
      </div>

      <h1 className="text-2xl text-center mt-8 font-semibold text-gray-400">ARTIST INFORMATION</h1>

      <form className="flex-grow overflow-auto">
        <div className="flex justify-between gap-8 mt-8 p-4">
          <div className="w-1/2">
            <div className="flex flex-col text-gray-600">
              <label htmlFor="artistName">Artist Name</label>
              <input
                type="text"
                id="name"
                className="border border-gray-400 p-1"
                value={newArtistInfo.name}
                onChange={handleArtistChange}
              />
            </div>
            <div className="flex flex-col mt-4 text-gray-600">
              <label htmlFor="artistDescription">Description</label>
              <textarea
                id="description"
                cols="10"
                rows="6"
                className="border border-gray-400 p-1 resize-none"
                value={newArtistInfo.description}
                onChange={handleArtistChange}
              ></textarea>
            </div>
          </div>

          <div className="w-1/2">
            <div className="flex flex-col text-gray-600">
              <label htmlFor="artistVideo">Favorite Music Video (YouTube)</label>
              <input
                type="text"
                id="video"
                className="border border-gray-400 p-1"
                value={newArtistInfo.video}
                onChange={handleArtistChange}
              />
            </div>

            <div className="mt-8 text-gray-600">
              <p>Rating</p>
              <div className="flex text-lg w-full gap-2 item-center mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <label key={rating} className="flex items-center text-sm cursor-pointer xl:w-96">
                    <input
                      type="radio"
                      value={rating}
                      checked={newArtistInfo.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      style={{
                        cursor: 'pointer',
                        appearance: 'none',
                        width: '1.5em',
                        height: '1.5em',
                        borderRadius: '50%',
                        backgroundColor: newArtistInfo.rating === rating ? '#9D367B' : 'transparent',
                        boxSizing: 'border-box',
                        border: '1px solid #ccc',
                        marginRight: '.7rem',
                      }}
                      required
                    />
                    {rating}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="genres" className="text-gray-600">
                Genre
              </label>
              <TagsInput
                id="genres"
                value={newArtistInfo.genres}
                onChange={(genres) => setNewArtistInfo((prevInfo) => ({ ...prevInfo, genres }))}
                className="border border-gray-400 p-2 flex-row flex items-center mt-2"
                tagProps={{
                  style: {
                    backgroundColor: '#E72460',
                    color: '#fff',
                    fontWeight: 'regular',
                    fontSize: '1.1rem',
                    borderRadius: '18px',
                    padding: '2px 10px',
                    justifyContent: 'center',
                  },
                }}
                renderTag={renderTag}
                removeKeys={[8]}
              />
            </div>
          </div>
        </div>

        <h1 className="text-2xl text-center mt-8 font-semibold text-gray-400 mb-8">FAVORITE ARTIST ALBUM</h1>

        <div className='flex h-screen gap-8'>
          <div
            className="w-1/2 bg-tertiary-custom-color border rounded-xl p-4 h-fit flex-"
            onDrop={handleAlbumDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Se não houver álbuns favoritos, exibe ícones padrão */}
            {favoriteAlbums.length === 0 ? (
              <div className="text-center text-gray-500 grid grid-cols-3 gap-8 justify-items-center h-fit">
                {[...Array(6).keys()].map((index) => (
                  <div key={index} className="border-dashed border-2 border-gray-400 p-8">
                    <GiCompactDisc size={100} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-8 justify-items-center w-fit">
                {favoriteAlbums.map((album, index) => (
                  <div
                    key={album.name}
                    className={`flex w-fit h-fit mt-4 border-dashed border-2 border-gray-400 p-4 ${
                      index % 3 === 0 ? 'clear-left' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, album)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex flex-col relative">
                      <img
                        src={album?.image?.find((image) => image.size === 'large')?.['#text']}
                        alt={`${album.name} - Album Cover`}
                        className="object-cover mr-2"
                      />
                      <span>Artist name: {album.artist}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromFavorites(album)}
                        className="absolute -top-7 -right-7 bg-red-500 text-white  rounded-full px-2 text-center text-1xl  cursor-pointer font-medium"
                      >
                        x
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-1/2 h-screen overflow-auto">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearchClick}
              title="Search albums"
            />

            <div className="flex flex-col">
              {loading && <p className="text-center text-gray-500">Carregando...</p>}
              {!loading &&
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex mt-4 mr-4 items-center bg-custom-color border-dashed border-2 border-gray-400 p-4"
                    draggable
                    onDragStart={(e) => handleDragStart(e, result)}
                    onDragEnd={handleDragEnd}
                  >
                    <img
                      src={result?.image?.find((image) => image.size === 'large')?.['#text']}
                      alt={`${result.name} - Album Cover`}
                      className="w-16 h-16 object-cover mr-2"
                    />
                    <div className="flex flex-col">
                      <span>Artist name: {result.artist}</span>
                      <span>Album: {result.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>    

        <hr className='mt-8'/>
        <div className='flex justify-between m-8'>
          <Link to='/'>
            <button
              className="bg-gradient-to-r from-gray-500 to-gray-800 px-4 py-2 border rounded-md text-lg text-white font-semibold"
            >Cancel
            </button>
          </Link>

          <Link to='/'>
            <button className="bg-gradient-to-r from-pink-500 to-purple-800 px-4 py-2 border rounded-md text-lg text-white font-semibold"
            >Save</button>
          </Link>
          </div>
      </form>
    </div>
  );
};

export default NewArtist;
