import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "firebase/index"

async function getAllItems() {
  const res = await getDocs(collection(db, "items"));
  return res.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });
}

async function updateItem(data: { id: string; }) {
  const docRef = doc(db, "items", data.id);
  await updateDoc(docRef, data);
}

async function deleteItem(id: string) {
  await deleteDoc(doc(db, "items", id));
}

const services = {
  getAllItems,
  updateItem,
  deleteItem
};

export default services;
