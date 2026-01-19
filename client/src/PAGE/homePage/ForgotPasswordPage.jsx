import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../api";



export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault()
    await axios.post(`${API_URL}/forgot-password`, { email });
    alert("Check your Gmail for reset link");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* BACKGROUND */}
      <img
        src="/images/plmro.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* CENTER */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="relative w-full max-w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl">

          {/* Glass overlay */}
          <div className="absolute inset-0 bg-[#2D4F2B] backdrop-blur-md" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-10">

            <img
              src="/images/logo2.gif"
              alt="Logo"
              className="h-20 mb-4"
            />

            <h2 className="text-2xl font-bold text-[#FFF1CA] mb-2">
              Forgot Password
            </h2>

            <p className="text-[#FFF1CA]/80 text-sm text-center mb-6">
              Enter your Gmail to receive a reset link
            </p>

          <form action="" className="w-full" onSubmit={submit}>
            <div class="[--clr:#2D4F2B] relative flex flex-row items-center font-sans w-full my-3">
              
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                name="email"
                required
                aria-invalid="false"
                placeholder=" "
                spellcheck="false"
                autocomplete="off"
                id="email"
                type="email"
                class=" peer rounded-xl text-[#2D4F2B] pl-10 h-[45px] pr-[40px] leading-normal appearance-none resize-none box-border text-base w-full block text-left border-2 border-solid border-[#2D4F2B] bg-[#FFF1CA] rounded-[10px] m-0 outline-0 focus-visible:outline-0 focus-visible:border-[#708A58] focus-visible:ring-4 focus-visible:ring-[#708a582e] transition-all duration-200"
              />

              <label
                class="text-[#2D4F2B] cursor-text text-[--clr] inline-block z-0 text-sm mb-px font-bold text-start select-none absolute duration-300 transform origin-[0] translate-x-[40px] 
                  peer-focus-visible:text-[#FFF1CA]
                  peer-focus-visible:translate-x-[5px] 
                  peer-focus-visible:translate-y-[-38px] 
                  peer-[:not(:placeholder-shown)]:translate-x-[5px] 
                  peer-[:not(:placeholder-shown)]:translate-y-[-38px] 
                  peer-[:not(:placeholder-shown)]:text-[#708A58]"
                for="email"
              >
                Email Address
              </label>

              <span
                class="pointer-events-none absolute z-[+1] left-0 top-0 bottom-0 flex items-center justify-center size-[40px] text-[#2D4F2B] peer-focus-visible:text-[#708A58]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor">
                  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                  <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
                </svg>
              </span>

              <div
                class="group w-[40px] absolute top-0 bottom-0 right-0 flex items-center justify-center text-[#2D4F2B] peer-focus-visible:text-[#708A58]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor">
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                <span
                  class="text-xs absolute bg-[#2D4F2B] text-[#FFF1CA] font-bold cursor-default select-none rounded-[4px] px-2 py-1 opacity-0 right-0 -z-10 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-[calc(100%+10px)]"
                >
                  Required!
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="
                inline-block w-full py-3 my-3 rounded-2xl font-bold text-[#FFF1CA] 
                bg-[#2D4F2B] border-1 border-[#708A58]
                shadow-[0px_5px_0px_0px_#708A58]
                hover:translate-y-[5px]
                hover:shadow-none
                hover:bg-[#708A58]
                
                
                transition-all duration-150 ease-in-out
              "
            >
              SEND RESET LINK
            </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}