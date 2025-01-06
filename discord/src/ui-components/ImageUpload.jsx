import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { File, ImagePlus, Trash, Upload, X } from "lucide-react";
import firebase from "../../firebase/firebase";
import "firebase/compat/storage";
import { toast } from "sonner";

const ImageUpload = ({ setFile, file, endpoint, submit }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState("");
  const [uploading, setUploading] = useState(false);
  const [ext, setExt] = useState("");

  const fileInputRef = useRef("");

  useEffect(() => {
    setIsMounted(true);
    checkFileTypeFromUrl(file);
  }, []);

  const checkFileTypeFromUrl = (url) => {
    // Extract the file extension from the URL
    const fileExtension = url?.split(".").pop()?.split("?")[0];

    // Determine the file type based on the extension
    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      console.log("The file is an image.");
      setExt("img");
    } else if (["pdf", ".txt", "docx"].includes(fileExtension)) {
      console.log("The file is a PDF.");
      setExt("file");
    } else {
      console.log("The file type is unknown or not supported.");
      setExt("not supported");
    }
  };

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
        toast.info("Upload is " + progress.toFixed(2) + "% done");
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
          toast.success("Upload is done :)");
          setLoading("");
          setUploading(false);
          setSelectedFile(downloadURL);
          setFile(downloadURL);
          checkFileTypeFromUrl(downloadURL);
          submit(downloadURL);
        });
      }
    );
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // This should work if the ref is correct
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      {endpoint === "messageFile" &&
      (selectedFile.length > 0 || file?.length > 0) ? (
        ext === "file" ? (
          <div className="relative flex  items-center p-2 mt-2 rounded-md bg-gray-300">
            <File className="h-10 w-10 stroke-indigo-400 " />
            <div className="max-w-[400px] overflow-hidden">
              <a
                href={selectedFile || file}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                {file}
              </a>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile("");
                  setFile("");
                }}
                className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
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
        )
      ) : endpoint === "serverImage" &&
        (selectedFile.length > 0 || file?.length > 0) ? (
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
      ) : endpoint === "profileImage" &&
        (selectedFile.length > 0 || file?.length > 0) ? (
        <div
          className={`relative group flex justify-center cursor-pointer mx-3 h-[88px] w-[88px] rounded-full group-hover:rounded-[16px] transition-all overflow-hidden border border-black`}
          onClick={(e) => {
            e.preventDefault();
            handleUploadButtonClick();
          }}
        >
          <div className="absolute z-40 inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {selectedFile === "" ? (
              <Upload />
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setSelectedFile("");
                  setFile("");
                }}
              >
                <Trash className="h-4 w-4" color="red" />
              </Button>
            )}
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
        <div className={`pt-6 ${endpoint === "profileImage" && "pt-0"}`}>
          <div className="text-center">
            {uploading ? (
              ""
            ) : endpoint === "profileImage" ? (
              <div
                className="relative group flex justify-center cursor-pointer mx-3 h-[88px] w-[88px] rounded-full group-hover:rounded-[16px] transition-all overflow-hidden border border-black"
                onClick={(e) => {
                  e.preventDefault();
                  handleUploadButtonClick();
                }}
              >
                <div className="relative max-w-[200px] h-[200px] rounded-md overflow-hidden">
                  <img
                    className="object-cover transition-transform group-hover:scale-105"
                    alt="Image"
                    src={
                      file ||
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  />
                </div>
              </div>
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
              {uploading
                ? "uploading...please wait :)"
                : endpoint === "serverImage"
                ? "Upload an image"
                : endpoint === "messageFile"
                ? "Upload a file"
                : endpoint === "profileImage"
                ? ""
                : ""}
            </h3>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        accept={
          endpoint === "serverImage"
            ? "image/*"
            : endpoint === "messageFile"
            ? "*/*"
            : ""
        }
        onChange={onFileSelected}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
