import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "firebase/index"

async function getAllTeamComps() {
  const res = await getDocs(collection(db, "teamcomps"));
  return res.docs.map((doc) =>{
    return {
      id: doc.id,
      ...doc.data()
    }
  });
}

async function updateItem(data: { id: string; }) {
  const docRef = doc(db, "teamcomps", data.id);
  await updateDoc(docRef, data);
}

async function deleteTeamComp(id: string) {
  await deleteDoc(doc(db, "teamcomps", id));
}

const services = {
  getAllTeamComps,
  updateItem,
  deleteTeamComp
};

export default services;
