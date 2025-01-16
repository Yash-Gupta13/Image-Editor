import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";

const CanvasEditor = ({ selectedImage, handleBack }) => {
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("canvas", {
      width: 750, // Canvas width
      height: 570, // Canvas height
      backgroundColor: "#f3f3f3",
      preserveObjectStacking: true,
    });
    canvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (selectedImage && canvas) {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = selectedImage;

      imgElement.onload = () => {
        const fabricImage = new fabric.Image(imgElement);

        // Calculate padding
        const padding = 20;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const imageWidth = canvasWidth - 2 * padding;
        const imageHeight = canvasHeight - 2 * padding;

        fabricImage.set({
          left: padding,
          top: padding,
          scaleX: imageWidth / fabricImage.width,
          scaleY: imageHeight / fabricImage.height,
          selectable: true,
        });

        canvas.clear();
        canvas.add(fabricImage);
        canvas.renderAll();
      };

      imgElement.onerror = () => {
        console.error(
          "Failed to load the image. Ensure the URL supports CORS."
        );
      };
    }
  }, [selectedImage, canvas]);

  // Add Text to Canvas
  const addText = () => {
    const text = new fabric.Textbox("Editable Text", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#000", // Text color
      editable: true,
      fontWeight: "bold",
      fontStyle: "italic",
      textAlign: "center",
      backgroundColor: "#f0f0f0",
      borderColor: "#007bff",
      cornerColor: "#ff5722",
      cornerStyle: "circle",
      padding: 10,
      shadow: "rgba(0,0,0,0.3) 2px 2px 5px",
    });

    canvas.add(text);
    canvas.renderAll();
  };

  // Add Shapes to Canvas
  const addShape = (type) => {
    let shape;
    switch (type) {
      case "circle":
        shape = new fabric.Circle({
          radius: 50,
          fill: "#d5d5de", // Color of the circle
          left: 150,
          top: 150,
          stroke: "black",
          cornerStyle: "circle", // Border color
          strokeWidth: 1, // Border width
        });
        break;
      case "rectangle":
        shape = new fabric.Rect({
          width: 100,
          height: 50,
          fill: "#d5d5de", // Color of the rectangle
          left: 200,
          top: 200,
          stroke: "black",
          cornerStyle: "circle", // Border color
          strokeWidth: 1, // Border width
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: "#d5d5de", // Color of the triangle
          left: 250,
          top: 250,
          stroke: "black",
          cornerStyle: "circle", // Border color
          strokeWidth: 1, // Border width
        });
        break;
      case "pentagon":
        shape = new fabric.Polygon(
          [
            { x: 200, y: 100 },
            { x: 300, y: 100 },
            { x: 350, y: 200 },
            { x: 250, y: 300 },
            { x: 150, y: 200 },
          ],
          {
            fill: "#d5d5de", // Color of the polygon
            stroke: "black",
            cornerStyle: "circle", // Border color
            strokeWidth: 1, // Border width
          }
        );
        break;
      default:
        break;
    }

    if (shape) {
      canvas.add(shape);
      canvas.renderAll();
    }
  };

  // Download the Canvas as an Image
  const downloadCanvas = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "edited-image.png";
      link.click();
    }
  };

  return (
    <div className="p-2">
      <Button
        onClick={handleBack}
        className="hover:bg-white hover:text-black mb-4 mt-1"
      >
        Back To Search
      </Button>
      <div className=" container flex h-full w-full">
        <div className="w-1/2">
          <canvas id="canvas" className="border border-gray-400 "></canvas>
        </div>
        <div className=" py-2 w-1/2 flex gap-2 justify-center items-center">
          <Button onClick={addText} className="hover:bg-white hover:text-black">
            Add Caption
          </Button>
          <Button
            onClick={() => addShape("circle")}
            className="hover:bg-white hover:text-black"
          >
            Add Circle
          </Button>
          <Button
            onClick={() => addShape("rectangle")}
            className="hover:bg-white hover:text-black"
          >
            Add Rectangle
          </Button>
          <Button
            onClick={() => addShape("triangle")}
            className="hover:bg-white hover:text-black"
          >
            Add Triangle
          </Button>
          <Button
            onClick={() => addShape("pentagon")}
            className="hover:bg-white hover:text-black"
          >
            Add Pentagon
          </Button>
        </div>
      </div>
      <div className="flex w-1/2 mt-2">
        <Button
          onClick={downloadCanvas}
          className="hover:bg-white hover:text-black w-[49vw]"
        >
          Download Image
        </Button>
      </div>
    </div>
  );
};

export default CanvasEditor;
