import { firestore } from "./firebase.js";

window.onload = async () => {
  // データの追加
  // const value = {
  //   task: "hogehoge",
  //   status: 1,
  //   createdAt: new Date(),
  // };
  // await firestore.collection("todos1").add(value);
  //
  // データの読み取り（1件）
  // const docId = "1wC2qFrH6HeBZsyEfJCb";
  // const doc = await firestore.collection("todos").doc(docId).get();
  // console.log(doc);
  // console.log(doc.id);
  // const data = doc.data();
  // console.log(data.createdAt.toDate());
  //
  // データの読み取り（複数）
  // const snapShot = await firestore.collection("todos").get();
  // const todos = snapShot.docs.map((doc) => ({
  //   id: doc.id,
  //   status: doc.data().status,
  //   task: doc.data().task,
  // }));
  // console.log(todos);
  //
  // データの更新
  // const docId = "1wC2qFrH6HeBZsyEfJCb";
  // await firestore.collection("todos").doc(docId).update({
  //   task: "mogemoge",
  // });
  //
  // データの削除
  // const docId = "1wC2qFrH6HeBZsyEfJCb";
  // await firestore.collection("todos").doc(docId).delete();
  //
  // リアルタイム更新の取得
  // const docId = "4tBWowvE5LUaD9pzIXQN";
  // firestore
  //   .collection("todos")
  //   .doc(docId)
  //   .onSnapshot((doc) => {
  //     console.log("Current data: ", doc.data());
  //   });
  //
  // 複数のクエリを用いた取得（絞り込み、並び替え、ページ）
  const snapShot = await firestore
    .collection("todos")
    .where("status", "==", 4)
    .orderBy("task")
    .startAt("moge")
    // .startAt(doc)
    .limit(3)
    .get();
  const todos = snapShot.docs.map((doc) => ({
    id: doc.id,
    status: doc.data().status,
    task: doc.data().task,
  }));
  console.log(todos);
};
