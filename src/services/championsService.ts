import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "firebase/index"

async function getAllChampions() {
  const res = await getDocs(collection(db, "champions"));
  return res.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id
    }
  });
}

async function updateChampion(data) {
  const docRef = doc(db, "champions", data.id);
  await updateDoc(docRef, data);
}

async function deleteChampion(id: string) {
  await deleteDoc(doc(db, "champions", id));
}

const services = {
  getAllChampions,
  updateChampion,
  deleteChampion
};

export default services;
