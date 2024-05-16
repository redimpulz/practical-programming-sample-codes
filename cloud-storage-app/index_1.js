import {
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-storage.js";
import { storage } from "/firebase.js";

const inputRef = document.querySelector("#input");
const formRef = document.querySelector("#form");

const handleChange = () => {
  const file = inputRef.files[0];
  console.log(file.name);
  console.log(file.type);
  console.log(file.size);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const file = inputRef.files[0];
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const filePath = `images/${fileName}`;
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);
  console.log("Uploaded a blob or file!");

  const url = getFileUrl(filePath);
  console.log(url);
};

inputRef.addEventListener("change", handleChange);
formRef.addEventListener("submit", handleSubmit);

const bucketName = "";
const getFileUrl = (filePath) => {
  const encodedFilePath = encodeURIComponent(filePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFilePath}?alt=media`;
};
