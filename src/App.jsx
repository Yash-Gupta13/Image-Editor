import { useState } from "react";
import Navbar from "./components/Navbar";
import ImageSearch from "./components/ImageSearch";
import CanvasEditor from "./components/CanvasEditor";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleBack = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-black w-full h-full">
      {selectedImage === null ? (
        <>
          <Navbar />
          <ImageSearch onSelectImage={setSelectedImage} />
        </>
      ) : (
        <>
          <CanvasEditor selectedImage={selectedImage} handleBack={handleBack} />
        </>
      )}
    </div>
  );
};

export default App;
