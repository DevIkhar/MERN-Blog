import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';

const SearchBar = ({postID, thumbnail, category, title, description, authorID, createdAt}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]); // Replace with your actual data fetched from the database
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data from the database (replace with your actual API call)
  useEffect(() => {
    // Example fetch call using the fetch API
    fetch('your-api-endpoint')
      .then(response => response.json())
      .then(result => {
        setData(result);
        setFilteredData(result); // Initial data display without filtering
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Handle search term changes
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter data based on search term
    const filteredResults = data.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredResults);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
      {filteredData.map(
            ({_id: id, thumbnail, category, title, description, creator, createdAt }) => (
              <PostItem
                key={id}
                postID={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                description={description}
                authorID={creator}
                createdAt={createdAt}
              />
            )
          )}
      </ul>
    </div>
  );
};

export default SearchBar;
