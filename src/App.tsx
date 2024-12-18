import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

type AgifyResponse = {
  name: string;
  age: number;
  count: number;
};

const fetchAge = async (name: string): Promise<AgifyResponse> => {
  const { data } = await axios.get(`https://api.agify.io/?name=${name}`);
  return data;
};

const App = () => {
  const [name, setName] = useState<string>("");
  const [submittedName, setSubmittedName] = useState<string>("");

  const { data, isLoading, isError, error } = useQuery<AgifyResponse, Error>(
    ["agify", submittedName],
    () => fetchAge(submittedName),
    {
      enabled: !!submittedName,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
    }
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedName(name);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Enter a name"
        />
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {data && !isLoading && !isError && (
        <div>
          {data.age}
          {data.count}
          {data.name}
        </div>
      )}
    </div>
  );
};

export default App;
