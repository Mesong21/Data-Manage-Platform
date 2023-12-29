import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchLabels: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);

  const handleSearchLabel = () => {
    let url = 'http://localhost:3001/api/label';
    console.log("request url: " + url);
    axios.post(url)
      .then(response => {
        const labelData = response.data;
        const labels = labelData.map((item: any) => item.labelname).sort();
        setLabels(labels);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    handleSearchLabel();
  }, []);

  return (
    <></>
  );
};

export default SearchLabels;