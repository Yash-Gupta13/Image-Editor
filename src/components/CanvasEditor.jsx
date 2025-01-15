import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";

const CanvasEditor = ({ selectedImage, handleBack }) => {
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null); // Store active object for interactions
  const canvasRef = useRef(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("canvas", {
      width: 800, // Default width, can be dynamic or responsive
      height: 600, // Default height, can be dynamic or responsive
      backgroundColor: "#f3f3f3",
      preserveObjectStacking: true,
    });
    canvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    // Handle object selection
    fabricCanvas.on("selection:created", handleSelection);
    fabricCanvas.on("selection:updated", handleSelection);

    return () => {
      fabricCanvas.dispose();
      fabricCanvas.off("selection:created", handleSelection);
      fabricCanvas.off("selection:updated", handleSelection);
    };
  }, []);

  useEffect(() => {
    if (selectedImage && canvas) {
      fabric.Image.fromURL(selectedImage, (img) => {
        // Calculate padding (e.g., 20px padding)
        const padding = 20;

        // Adjust image size based on canvas size with padding
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const imageWidth = canvasWidth - 2 * padding; // Subtract padding from width
        const imageHeight = canvasHeight - 2 * padding; // Subtract padding from height

        // Scale the image to fit within the padded canvas area
        img.set({
          left: padding, // Set left padding
          top: padding, // Set top padding
          scaleX: imageWidth / img.width, // Scale the width based on image's original width
          scaleY: imageHeight / img.height, // Scale the height based on image's original height
          selectable: true,
        });

        canvas.clear(); // Clear the canvas before adding new image
        canvas.add(img);
        canvas.renderAll();
      });
    }
  }, [selectedImage, canvas]);

  // Add Text to Canvas
  const addText = () => {
    const text = new fabric.Textbox("Editable Text", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#000",
      editable: true,
    });
    canvas.add(text);
    canvas.renderAll();
  };

  // Add Shape to Canvas (Circle, Rectangle, Triangle, etc.)
  const addShape = (type) => {
    let shape;
    switch (type) {
      case "circle":
        shape = new fabric.Circle({
          radius: 50,
          fill: "blue",
          left: 150,
          top: 150,
          selectable: true,
        });
        break;
      case "rectangle":
        shape = new fabric.Rect({
          width: 100,
          height: 50,
          fill: "green",
          left: 200,
          top: 200,
          selectable: true,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: "red",
          left: 250,
          top: 250,
          selectable: true,
        });
        break;
      case "polygon":
        shape = new fabric.Polygon(
          [
            { x: 200, y: 200 },
            { x: 250, y: 100 },
            { x: 300, y: 200 },
          ],
          {
            fill: "purple",
            selectable: true,
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

  const deleteSelectedObject = () => {
    if (activeObject) {
      canvas.remove(activeObject);
      setActiveObject(null); // Clear the active object reference
      canvas.renderAll();
    }
  };

  // Set active object when a shape or text is selected
  const handleSelection = (e) => {
    setActiveObject(e.target);
  };

  // Remove active object on deselection
  canvas.on("selection:cleared", () => {
    setActiveObject(null);
  });

  const handleBackToSearch = () => {
    handleBack();
  };

  const downloadCanvas = () => {
    const dataURL = canvas.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "edited-image.png";
    link.click();
  };

  return (
    <div className="w-full p-4">
      <div className="flex space-x-4 mb-4">
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
          onClick={() => addShape("polygon")}
          className="hover:bg-white hover:text-black"
        >
          Add Polygon
        </Button>
        <Button
          onClick={downloadCanvas}
          className="hover:bg-white hover:text-black"
        >
          Download Image
        </Button>
        <Button
          onClick={deleteSelectedObject}
          className="hover:bg-white hover:text-black"
        >
          Delete
        </Button>
        <Button onClick={handleBackToSearch}>Back To Search</Button>
      </div>

      <canvas id="canvas" className="mt-4 border border-gray-400"></canvas>
    </div>
  );
};

export default CanvasEditor;
