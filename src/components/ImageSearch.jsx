import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const ImageSearch = ({ onSelectImage }) => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for API error message

  const fetchImages = async () => {
    setErrorMessage(""); // Reset the error message before the request
    setNoResultsMessage(""); // Reset no-results message
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query,
            client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
          },
        }
      );
      setImages(response.data.results);
      setNoResultsMessage(
        response.data.results.length === 0
          ? "No images found. Please try a different search term."
          : ""
      );
    } catch (error) {
      console.error("Error fetching images:", error);
      setErrorMessage(
        error.response?.data?.errors?.[0] ||
        error.response?.statusText ||
        "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="flex w-full flex-col p-9 items-center">
      <div className="flex justify-center gap-2">
        <Input
          type="text"
          placeholder="Enter your search term"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-white text-lg w-64 h-12 px-4"
        />
        <Button onClick={fetchImages} className="h-12 px-6 text-lg">
          Search
        </Button>
      </div>

      {/* Display API error message */}
      {errorMessage && (
        <div className="text-red-500 text-center mt-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-12 mt-4">
        {images.length > 0 ? (
          images.map((image) => (
            <Card
              key={image.id}
              className="w-64 bg-black-800 text-white p-4 rounded-lg shadow-lg"
            >
              <img
                src={image.urls.thumb}
                alt={image.alt_description}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Button
                onClick={() => onSelectImage(image.urls.full)}
                className="mt-2 w-full"
              >
                Add Caption
              </Button>
            </Card>
          ))
        ) : (
          !errorMessage && (
            <p className="text-white text-center">{noResultsMessage}</p>
          )
        )}
      </div>
    </div>
  );
};

export default ImageSearch;
