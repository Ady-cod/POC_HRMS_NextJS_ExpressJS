import React, { useRef } from "react";
import {
  Cropper,
  CropperRef,
  CircleStencil,
  CropperPreview,
  CropperPreviewRef,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  RefreshCw,
} from "lucide-react";

interface ImageCropperModalProps {
  image: string;
  open: boolean;
  onClose: () => void;
  onSave: (croppedImg: string) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  image,
  open,
  onClose,
  onSave,
}) => {
  const cropperRef = useRef<CropperRef>(null);
  const previewRef = useRef<CropperPreviewRef>(null);
  // const previewRef = useRef<HTMLCanvasElement | null>(null);

  if (!open) return null;

  const handleZoomIn = () => {
    cropperRef.current?.zoomImage(1.2);
  };
  const handleZoomOut = () => {
    cropperRef.current?.zoomImage(0.8);
  };
  const handleRotate = () => cropperRef.current?.rotateImage(90);
  const handleFlip = () => cropperRef.current?.flipImage(true, false);
  const handleReset = () => cropperRef.current?.reset();

  const handleSave = () => {
    const canvas = cropperRef.current?.getCanvas();
    if (canvas) {
      onSave(canvas.toDataURL("image/png"));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-darkblue-900">
            Crop Your Image
          </h2>
          <p className="text-sm text-darkblue-200">
            Adjust the crop area and preview your image before saving.
          </p>
        </div>
        {/* Cropper */}
        <div className="w-full flex flex-col items-center gap-4">
          <Cropper
            ref={cropperRef}
            src={image}
            className="cropper h-64 sm:h-80 md:h-[400px] w-full max-w-full"
            stencilComponent={CircleStencil}
            stencilProps={{ movable: true, resizable: true }}
            onUpdate={(cropper) => previewRef.current?.update(cropper)}
          />

          {/* Preview */}
          <div className="flex justify-center">
            <CropperPreview
              ref={previewRef}
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button
            size="icon"
            variant="outline"
            onClick={handleZoomIn}
            title="Zoom in"
            aria-label="Zoom in"
            className="text-lightblue-900 border-2 border-lightblue-100 hover:bg-lightblue-50 hover:text-lightblue-700"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom out"
            className="text-lightblue-900 border-2 border-lightblue-100 hover:bg-lightblue-50 hover:text-lightblue-700"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleRotate}
            title="Rotate 90°"
            aria-label="Rotate 90 degrees"
            className="text-lightblue-900 border-2 border-lightblue-100 hover:bg-lightblue-50 hover:text-lightblue-700"
          >
            <RotateCw className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleFlip}
            title="Flip horizontally"
            aria-label="Flip horizontally"
            className="text-lightblue-900 border-2 border-lightblue-100 hover:bg-lightblue-50 hover:text-lightblue-700"
          >
            <FlipHorizontal className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleReset}
            title="Reset crop"
            aria-label="Reset crop"
            className="text-lightblue-900 border-2 border-lightblue-100 hover:bg-lightblue-50 hover:text-lightblue-700"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>

        {/* Save / Cancel */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-orange-500 border-2 border-orange-500 hover:bg-orange-50 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-lightblue-600 hover:bg-lightblue-800 w-full sm:w-auto"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
