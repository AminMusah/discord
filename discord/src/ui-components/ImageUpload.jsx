import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Upload } from "lucide-react";
import firebase from "../../firebase/firebase";
import "firebase/compat/storage";

const ImageUpload = ({ setFile, file }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onFileSelected = (e) => {
    let file = e.target.files[0];
    var storageRef = firebase.storage().ref("/discord/" + file.name);

    let uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setLoading("Upload is " + progress + "% done");
        console.log("Upload is " + progress + "% done");
        setUploading(true);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            setLoading("Upload is paused");
            setUploading(false);
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            setLoading("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        setUploading(false);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setLoading("");
          setUploading(false);
          setSelectedFile(downloadURL);
          setFile(downloadURL);
        });
      }
    );
  };

  const handleUploadButtonClick = () => {
    // Trigger the file input click when the button is clicked
    fileInputRef.current.click();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      {selectedFile.length > 0 || file?.length > 0 ? (
        <div className="relative group flex justify-center cursor-pointer mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden border border-black">
          <div className="absolute z-40 inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              onClick={() => {
                setSelectedFile("");
                setFile("");
              }}
            >
              <Trash className="h-4 w-4" color="red" />
            </Button>
          </div>
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <img
              className="object-cover transition-transform group-hover:scale-105"
              alt="Image"
              src={selectedFile || file}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          </div>
        </div>
      ) : (
        <div className="pt-6">
          <div className="text-center">
            {uploading ? (
              ""
            ) : (
              <Upload
                className="mx-auto h-12 w-12 text-gray-400 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleUploadButtonClick();
                }}
              />
            )}
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {uploading ? "uploading...please wait :)" : "Upload an image"}
            </h3>

            <div className="mt-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileSelected}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
      {/* <div className="mb-4 flex items-center gap-4">
        {selectedFile.length > 0 || file?.length > 0 ? (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => {
                  setSelectedFile("");
                  setFile("");
                }}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>

            <img
              className="object-cover"
              alt="Image"
              src={selectedFile || file}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          </div>
        ) : null}
      </div>
      <p className="text-black text-xs mb-4">{loading}</p>
      <Button
        type="button"
        disabled={false}
        onClick={handleUploadButtonClick}
        className="mb-4 text-white bg-black"
      >
        <ImagePlus className="h-4 w-4 mr-2 " />
        Upload an Image
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileSelected}
      /> */}
    </div>
  );
};

export default ImageUpload;
