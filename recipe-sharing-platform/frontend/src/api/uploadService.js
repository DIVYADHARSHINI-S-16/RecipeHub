import axiosInstance from "./axiosInstance";

export const uploadImageToServer = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axiosInstance.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    },
  });

  return data;
};

export const deleteImageFromServer = async (publicId) => {
  const { data } = await axiosInstance.delete(`/upload/${encodeURIComponent(publicId)}`);
  return data;
};
