import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const submit = async () => {
    await axios.post(
      `${API_URL}/reset-password/${token}`,
      { password }
    );
    alert("Password changed successfully");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl mb-4">Create New Password</h2>
      <input
        type="password"
        className="border p-2 w-full"
        placeholder="New Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button
        onClick={submit}
        className="bg-green-600 text-white w-full py-2 mt-3"
      >
        Reset Password
      </button>
    </div>
  );
}