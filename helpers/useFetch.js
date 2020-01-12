import React from 'react';

const useFetch = (path) => {
  const [state, setState] = React.useState({
    data: null,
    loading: true,
  });

  React.useEffect(() => {
    fetch(`http://localhost:8181${path}`)
      .then((response) => response.json())
      .then((response) => {
        setState({
          data: response,
          loading: false,
        });
      });
  }, [path]);

  return state;
};

export default useFetch;
