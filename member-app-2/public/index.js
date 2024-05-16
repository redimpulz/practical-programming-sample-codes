import { auth } from "./firebase.js";

const ulRef = document.querySelector("ul");
const inputRef = document.querySelector("#todo-task");
const selectRef = document.querySelector("#todo-status");
const editItemIdRef = document.querySelector("#edit-item-id");
const submitButtonRef = document.querySelector("#submit-button");
const cancelButtonRef = document.querySelector("#cancel-button");
const logoutButtonRef = document.querySelector("#logout-button");

auth.onAuthStateChanged(async (user) => {
  if (user) {
    await handleGetItems();
  } else {
    location.href = "/login.html";
  }
});

const getStatusName = (status) =>
  status === 1
    ? "IMCOMPLETE"
    : status === 2
    ? "PROGRESS"
    : status === 3
    ? "PENDING  "
    : "COMPLETE";

const handleResetForm = () => {
  inputRef.value = "";
  selectRef.value = "";
  editItemIdRef.value = "";
  submitButtonRef.textContent = "Add Item";
};

const handleSelectEditItem = ({ id, task, status }) => {
  editItemIdRef.value = id;
  inputRef.value = task;
  selectRef.value = status;
  submitButtonRef.textContent = "Edit Item";
};

const handleGetItems = async () => {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch("/todo", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const todos = await res.json();

  while (ulRef.firstChild) {
    ulRef.removeChild(ulRef.firstChild);
  }

  inputRef.value = "";

  todos.forEach((todo) => {
    const spanRef = document.createElement("span");
    const liRef = document.createElement("li");
    spanRef.textContent = `${todo.task} - ${getStatusName(todo.status)}`;
    liRef.appendChild(spanRef);

    const editButtonRef = document.createElement("button");
    editButtonRef.textContent = "edit";
    liRef.appendChild(editButtonRef);
    editButtonRef.addEventListener("click", () =>
      handleSelectEditItem({
        id: todo.id,
        task: todo.task,
        status: todo.status,
      })
    );

    const deleteButtonRef = document.createElement("button");
    deleteButtonRef.textContent = "delete";
    liRef.appendChild(deleteButtonRef);
    deleteButtonRef.addEventListener("click", () => handleDeleteItem(todo.id));

    ulRef.appendChild(liRef);
  });
};

const handleAddItem = async () => {
  const value = inputRef.value;
  const status = selectRef.value;
  const idToken = await auth.currentUser.getIdToken();
  await fetch("/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ task: value, status }),
  });
  await handleGetItems();
};

const handleEditItem = async () => {
  const id = editItemIdRef.value;
  const task = inputRef.value;
  const status = selectRef.value;
  const idToken = await auth.currentUser.getIdToken();
  await fetch(`/todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ task, status }),
  });
  await handleGetItems();
};

const handleDeleteItem = async (id) => {
  const idToken = await auth.currentUser.getIdToken();
  await fetch(`/todo/${id}`, {
    method: "DELETE",
    Authorization: `Bearer ${idToken}`,
  });
  await handleGetItems();
};

submitButtonRef.addEventListener("click", async () => {
  if (submitButtonRef.textContent === "Edit Item") {
    await handleEditItem();
  } else {
    await handleAddItem();
  }
  handleResetForm();
});

cancelButtonRef.addEventListener("click", handleResetForm);
logoutButtonRef.addEventListener("click", () => auth.signOut());
