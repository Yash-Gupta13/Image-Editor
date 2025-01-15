import { useState } from "react";
import Navbar from "./components/Navbar";
import ImageSearch from "./components/ImageSearch";
import CanvasEditor from "./components/CanvasEditor";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleBack = () => {
    setSelectedImage(null); // Update state to null when back button is clicked
  };

  return (
    <div className="bg-black w-full h-full">
      <Navbar />
      {selectedImage === null ? (
        <ImageSearch onSelectImage={setSelectedImage} />
      ) : (
        <>
          <CanvasEditor selectedImage={selectedImage} handleBack={handleBack} />
        </>
      )}
    </div>
  );
};

export default App;
