const formRef = document.querySelector("#form");
const inputRef = document.querySelector("#input");

// const handleSubmit1 = async (e) => {
//   e.preventDefault();
//   const file = inputRef.files[0];
//   const formData = new FormData();
//   formData.append("avatar", file);
//   await fetch("/profile", {
//     method: "POST",
//     body: formData,
//   });
// };

const handleSubmit2 = async (e) => {
  e.preventDefault();
  const files = inputRef.files;
  const formData = new FormData();
  for (const file of files) {
    formData.append("photos", file);
  }
  await fetch("/photos/upload", {
    method: "POST",
    body: formData,
  });
};

// formRef.addEventListener("submit", handleSubmit1);
formRef.addEventListener("submit", handleSubmit2);
