import React, { useState } from "react";

const Popup = ({setuserName}) => {

     const[name,setName]=useState("")
  return (
    <div className="relative">
      {/* Popup Card visible if name is null */}
    (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Please enter your name:
            </h2>
            <form>
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-2 mb-4 rounded-md w-full"
                onChange={(e)=>setName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-3 rounded-lg w-full"
                onClick={(e)=>{
                  e.preventDefault();
                  setuserName(name)
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )
    </div>
  );
};

export default Popup;
