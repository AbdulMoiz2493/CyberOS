import { useState } from "react";
import Icon from "../Icons";

const ImageViewer = ({ window }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sampleImages = [
    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800",
    "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
  ];

  const currentImage = window.props?.imagePath || sampleImages[currentIndex];

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 300));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 25));
  const handleRotateLeft = () => setRotation(rotation - 90);
  const handleRotateRight = () => setRotation(rotation + 90);
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sampleImages.length - 1));
    handleReset();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < sampleImages.length - 1 ? prev + 1 : 0));
    handleReset();
  };

  return (
    <div className="h-full flex flex-col bg-os-bg">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-os-surface/50">
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={handlePrev}
          >
            <Icon name="ChevronLeft" size={20} className="text-white/60" />
          </button>
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={handleNext}
          >
            <Icon name="ChevronRight" size={20} className="text-white/60" />
          </button>
          <span className="text-sm text-white/60 ml-2">
            {currentIndex + 1} / {sampleImages.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={handleZoomOut}
          >
            <Icon name="ZoomOut" size={20} className="text-white/60" />
          </button>
          <span className="text-sm text-white/60 w-12 text-center">{zoom}%</span>
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={handleZoomIn}
          >
            <Icon name="ZoomIn" size={20} className="text-white/60" />
          </button>
          <div className="w-px h-5 bg-white/10 mx-2" />
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={handleRotateLeft}
          >
            <Icon name="RotateCcw" size={20} className="text-white/60" />
          </button>
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={handleRotateRight}
          >
            <Icon name="RotateCw" size={20} className="text-white/60" />
          </button>
          <div className="w-px h-5 bg-white/10 mx-2" />
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={handleReset}
          >
            <Icon name="Maximize2" size={20} className="text-white/60" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Icon name="Share" size={20} className="text-white/60" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Icon name="Trash2" size={20} className="text-white/60" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Icon name="MoreHorizontal" size={20} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Image container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        <img
          src={currentImage}
          alt="Viewer"
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
          }}
          draggable={false}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex items-center justify-center gap-2 p-3 border-t border-white/10 bg-os-surface/50">
        {sampleImages.map((img, index) => (
          <button
            key={index}
            className={`w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
              index === currentIndex ? "border-os-primary" : "border-transparent hover:border-white/20"
            }`}
            onClick={() => {
              setCurrentIndex(index);
              handleReset();
            }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
