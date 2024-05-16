import {
  ref,
  getDownloadURL,
  // getBlob,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-storage.js";
import { storage } from "/firebase.js";

const buttonRef = document.querySelector("#dl-button");
const imageRef = document.querySelector("#img");

const handleDownload = async () => {
  const fileName = "";
  const fileRef = ref(storage, `images/${fileName}`);
  const url = await getDownloadURL(fileRef);
  console.log(url);

  // imgタグに反映
  imageRef.setAttribute("src", url);

  // ファイルをダウンロード
  const data = await fetch(url);
  const blob = await data.blob();

  // aタグを使用する場合
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  // FileSaverを使用する場合
  // saveAs(blob);

  // SDKからデータを直接ダウンロード（v9.5から利用可）
  // const blob = await getBlob(fileRef);
};

buttonRef.addEventListener("click", handleDownload);
