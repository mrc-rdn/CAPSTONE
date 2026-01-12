import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../api";



export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await axios.post(`${API_URL}/forgot-password`, { email });
    alert("Check your Gmail for reset link");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl mb-4">Forgot Password</h2>
      <input
        className="border p-2 w-full"
        placeholder="Enter Gmail"
        onChange={e => setEmail(e.target.value)}
      />
      <button
        onClick={submit}
        className="bg-blue-600 text-white w-full py-2 mt-3"
      >
        Send Reset Link
      </button>
    </div>
  );
}
