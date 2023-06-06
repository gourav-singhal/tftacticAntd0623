import { auth } from "firebase/index"
import { signInWithEmailAndPassword } from "firebase/auth"
import { LoginFormData } from "components/auth/LoginForm/LoginForm"

function loginWithEmailAndPassword(values: LoginFormData) {
  return signInWithEmailAndPassword(auth, values.email, values.password);
}

export {
  loginWithEmailAndPassword
}