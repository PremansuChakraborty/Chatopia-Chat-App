import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./index.css";
import Popup from "./Popup";
import Navbar from "./navbar";

function App() {
  const [user, setUser] = useState([]);
  const [mBox, setMbox] = useState("");
  const [roomMBox, setroomMBox] = useState("");
  const [roomJoin, setroomJoin] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomMessages, setroomMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [privateMessages, setprivateMessages] = useState([]);
  const [privateMBox, setPrivateMBox] = useState("");
  const [reciverId, setReciverId] = useState("");
  const [userName, setuserName] = useState("");

  const socket = useMemo(() => {
    return io("http://localhost:8000");
  }, []);

  useEffect(() => {
    socket.on("new-user", (users) => setUser(users));

    socket.on("incomingMessage", (messageArray) => setMessages(messageArray));
    socket.on("roomId", (room) => {
      setRoomId(room);
      setroomJoin(room);
    });
    socket.on("incomingRoomMessage", (obj) => {
      setroomMessages((roomMessages) => [...roomMessages, obj]);
    });
    socket.on("incomingPrivateMessage", (obj) => {
      setprivateMessages((privateMessages) => [...privateMessages, obj]);
    });

    return () => {
      socket.off("new-user");
      socket.off("incomingMessage");
    };
  }, [socket]);

  return (
    <>
    <Navbar/>
      {userName === "" && <Popup setuserName={setuserName} />}
      <div className="flex flex-col md:flex-row items-center md:space-x-6 md:space-y-0 p-2">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-3/6 mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            User List
          </h1>
          <h2 className="text-sm sm:text-lg font-medium text-center mb-4">
            Total Active Users: {user.length}
          </h2>
          <div className="bg-gray-200 text-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
            {user.map((id) => (
              <h3 key={id} className="py-2 text-sm sm:text-base">
                {id}
              </h3>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/4 lg:w-1/6 mx-auto mt-6">
          <button
            onClick={() => {
              socket.emit("createRoomId", "");
            }}
            className="w-full bg-blue-500 text-white p-2 rounded-lg mb-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Room
          </button>
          {roomId && (
            <h1 className="text-center text-lg font-semibold text-blue-500 mb-2">
              {roomId}
            </h1>
          )}

          <form className="mb-4">
            <input
              type="text"
              placeholder="Enter RoomId"
              value={roomJoin}
              onChange={(e) => setroomJoin(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                socket.emit("joinRoom", roomJoin);
                setRoomId(roomJoin);
              }}
              className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full md:w-1/4 lg:w-1/6">
          <h1 className="text-sm sm:text-lg font-semibold text-gray-800">
            User Name: {userName}
          </h1>
          <h1 className="text-xs sm:text-sm text-blue-500">
            UserId: {socket.id}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center space-x-6 space-y-2 p-2">
        <form className="bg-green-200 p-6 rounded-lg shadow-md w-full md:w-1/3 lg:w-4/12 mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Public Chat
          </h1>
          <div className="mb-4 max-h-64 overflow-y-auto">
            {messages.map((obj, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg w-fit p-2 mb-2"
              >
                <h3 className="font-semibold text-gray-800">
                  {obj.name === userName ? "You" : obj.name} ({obj.id}):
                </h3>
                <p className="text-gray-600">{obj.message}</p>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter Your Message"
            value={mBox}
            onChange={(e) => setMbox(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              socket.emit("newMessage", {
                name: userName,
                id: socket.id,
                message: mBox,
              });
              setMbox("");
            }}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>

        {roomId && (
          <form className="bg-red-200 p-6 rounded-lg shadow-md w-full md:w-1/3 lg:w-4/12 mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              Room: {roomId} Chat
            </h1>
            <div className="mb-4 max-h-64 overflow-y-auto">
              {roomMessages.map((obj, index) => (
                <div
                  key={index}
                  className="bg-gray-100 w-fit rounded-lg p-3 mb-2"
                >
                  <h3 className="font-semibold text-gray-800">
                    {obj.name === userName ? "You" : obj.name} ({obj.id}):
                  </h3>
                  <p className="text-gray-600">{obj.mess}</p>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Enter Room Message"
              value={roomMBox}
              onChange={(e) => setroomMBox(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                socket.emit("newRoomMessage", {
                  rid: roomJoin,
                  id: socket.id,
                  message: roomMBox,
                  name: userName,
                });
                setroomMBox("");
              }}
              className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </form>
        )}

        <form className="bg-blue-200 p-6 rounded-lg shadow-md w-full md:w-1/3 lg:w-4/12 mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Private Chat
          </h1>
          <div className="mb-4 max-h-64 overflow-y-auto">
            {privateMessages.map((obj, index) => (
              <div
                key={index}
                className="bg-gray-100 w-fit rounded-lg p-3 mb-2"
              >
                <h3 className="font-semibold text-gray-800">
                  {obj.name} ({obj.id}):
                </h3>
                <p className="text-gray-600">{obj.mess}</p>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter Receiver Id"
            value={reciverId}
            onChange={(e) => setReciverId(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter Private Message"
            value={privateMBox}
            onChange={(e) => setPrivateMBox(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {reciverId && privateMBox && (
            <button
              onClick={(e) => {
                e.preventDefault();
                socket.emit("newPrivateMessage", {
                  to: reciverId,
                  from: socket.id,
                  message: privateMBox,
                  name: userName,
                });
                setprivateMessages((privateMessages) => [
                  ...privateMessages,
                  {
                    id: socket.id,
                    mess: privateMBox,
                    name: "You",
                  },
                ]);
                setPrivateMBox("");
                setReciverId("");
              }}
              className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
