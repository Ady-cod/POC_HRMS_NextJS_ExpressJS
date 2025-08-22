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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full flex flex-col gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Crop Your Image</h2>
          <p className="text-sm text-gray-500">
            Adjust the crop area and preview your image before saving.
          </p>
        </div>
        {/* Cropper */}
        <Cropper
          ref={cropperRef}
          src={image}
          className="cropper h-[400px] w-full"
          stencilComponent={CircleStencil}
          stencilProps={{ movable: true, resizable: true }}
          onUpdate={(cropper) => previewRef.current?.update(cropper)}
        />

        {/* Preview */}
        <div className="flex justify-center">
          <CropperPreview
            ref={previewRef}
            className="w-32 h-32 rounded-full overflow-hidden border"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button size="icon" variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline" onClick={handleRotate}>
            <RotateCw className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline" onClick={handleFlip}>
            <FlipHorizontal className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline" onClick={handleReset}>
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>

        {/* Save / Cancel */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
