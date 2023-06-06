import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "firebase/index"

async function getAllSynergys() {
  const res = await getDocs(collection(db, "synergys"));
  return res.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id
    }
  });
}

async function updateSynergy(data: {id: string}) {
  const docRef = doc(db, "synergys", data.id);
  await updateDoc(docRef, data);
}

async function deleteSynergy(id: string) {
  await deleteDoc(doc(db, "synergys", id));
}

const services = {
  getAllSynergys,
  updateSynergy,
  deleteSynergy
};

export default services;
