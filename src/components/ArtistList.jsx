/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaYoutube } from "react-icons/fa";
import { BsFillPencilFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';

const IconWithTooltip = ({ title, children }) => (
  <Tooltip title={title} placement="top-start">
    <div style={{ cursor: 'pointer' }}>
      {children}
    </div>
  </Tooltip>
);

const ArtistList = ({ artists, onDelete, onEdit, editingIndex, editedName, setEditedName, ratings, setRatings }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleDeleteClick = (index) => {
    onDelete(index);
  };

  const handleEditClick = (index, name) => {
    onEdit(index, name);
  };

  return (
    <table className="min-w-full bg-white border-b-2 border-gray-300 text-gray-600">
      <thead>
        <tr className='text-left text-gray-500 bg-gray-100'>
          <th className="p-4 border-b">Name</th>
          <th className="p-4 border-b">Rating</th>
          <th className="p-4  mr-32">Action</th>
        </tr>
      </thead>
      <tbody>
        {artists.map((artist, index) => (
          <tr
            key={index}
            className="text-lg border-b"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              backgroundColor: hoveredIndex === index ? '#F8EEF7' : 'transparent',
              color: hoveredIndex === index ? '#672D83' : 'inherit',
              fontWeight: hoveredIndex === index ? 'medium' : 'inherit'
            }}
          >
            <td className="p-4">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                artist.name
              )}
            </td>
            <td className="p-4">
              {editingIndex === index ? (
                <input
                  type="number"
                  value={ratings[index]}
                  onChange={(e) => {
                    const updatedRatings = [...ratings];
                    updatedRatings[index] = parseInt(e.target.value, 10);
                    setRatings(updatedRatings);
                  }}
                />
              ) : (
                ratings[index]
              )}
            </td>
            <td className="p-4 flex gap-8">
              <IconWithTooltip title="Ver Vídeo">
                <FaYoutube size={20} color={hoveredIndex === index ? '#672D83' : '#b1b1b1'} />
              </IconWithTooltip>

              <IconWithTooltip title="Editar">
                <BsFillPencilFill
                  size={20}
                  color={hoveredIndex === index ? '#672D83' : '#b1b1b1'}
                  onClick={() => handleEditClick(index, artist.name)}
                />
              </IconWithTooltip>

              <IconWithTooltip title="Excluir">
                <FaTrash
                  size={20}
                  color={hoveredIndex === index ? '#672D83' : '#b1b1b1'}
                  onClick={() => handleDeleteClick(index)}
                />
              </IconWithTooltip>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArtistList;
