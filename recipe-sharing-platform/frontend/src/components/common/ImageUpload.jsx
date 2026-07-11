import { useState, useRef } from "react";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadImageToServer, deleteImageFromServer } from "../../api/uploadService";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 5;

const ImageUpload = ({ value, onChange, label = "Recipe Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const handleFile = async (file) => {
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadImageToServer(file, setProgress);
      onChange({ url: result.url, publicId: result.publicId });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value?.publicId) {
      try {
        await deleteImageFromServer(value.publicId);
      } catch {
        // Non-blocking
      }
    }
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>

      {value?.url ? (
        <div className="relative w-full h-56 rounded-xl overflow-hidden group">
          <img src={value.url} alt="Recipe preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium transition-opacity"
            >
              <FiX /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {uploading ? (
            <div className="w-3/4 text-center">
              <FiImage className="mx-auto text-primary-500 mb-2" size={28} />
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Uploading... {progress}%</p>
            </div>
          ) : (
            <>
              <FiUploadCloud className="text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Click or drag an image here</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, or WEBP — max {MAX_SIZE_MB}MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
