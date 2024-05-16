import { auth } from "./firebase.js";

const logoutButtonRef = document.querySelector("#logout-button");

auth.onAuthStateChanged((user) => {
  if (!user) {
    location.href = "/login.html";
  }
});

logoutButtonRef.addEventListener("click", () => auth.signOut());
