import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

const baseUrl = import.meta.env.VITE_SERVER_URL;
let chatsPerPage = 5;

export default function AddChatPopup(props) {
  const [chatData, setChatData] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const dataLoad = async () => {
    try {
      const response = await fetch(`${baseUrl}/message/getPossibleChats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chats: props.chats,
          limit: chatsPerPage,
          skip: chatData.length,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setChatData((prevData) => [...prevData, ...data]);
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      } else {
        console.error("Failed to fetch possible chats");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching possible chats:",
        error
      );
    }
  };

  useEffect(() => {
    dataLoad();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    props.onCancel();
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="flex item-center items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="popup-content card p-6">
                {chatData.map((data) => (
                  <div className="brand" key={data._id}>
                    {data.imageUrl && (
                      <img
                        height="40"
                        src={`${baseUrl}/${data.imageUrl}`}
                        alt=""
                      />
                    )}
                    <h1>{data.userName}</h1>
                    <button onClick={() => props.chatAdder(data._id)}>
                      Add
                    </button>
                  </div>
                ))}
                {loadMore && <button onClick={dataLoad}>Load More</button>}
              </div>
              <div className="mt-4 p-4 bg-gray-50 text-right">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
