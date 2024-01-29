import { memo, useMemo } from "react";
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import accept and decline icons
import { FaRegUser } from "react-icons/fa";
const baseUrl = import.meta.env.VITE_BASE_URL;
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const RequestItem = memo(function RequestItem({ mkey, request, handleRequest }) {
  const memoizedComponent = useMemo(() => {
    return (
      <div key={request.key} className="p-4 bg-white rounded-lg shadow-md mb-4 w-full md:w-[300px] my-2 min-w-[260px] ">
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-10 w-10 rounded-full">
            {/* Display user image with lazy loading */}
           {request.fromUser.imageUrl? <img
              className="cursor-pointer rounded-full"
              src={`${baseUrl}/${request.fromUser.imageUrl}`}
              alt={request.fromUser.userName}
              loading="lazy"
            />:<FaRegUser  className="h-full w-[10%] mr-2" />}
          </div>
          <div className="ml-2">
            <p className="text-xl font-medium text-black">{request.fromUser.userName}</p>
          </div>
        </div>

        <p className="text-lg text-grey-900 mt-4">{`${capitalizeFirstLetter(request.type)} Request`}</p>

      

        {/* Accept and Decline icons with onClick handlers */}
        <div className="flex justify-end gap-3">
          <FaCheck
            className="cursor-pointer text-green-500 mr-2"
            size={28}
            onClick={() => handleRequest(mkey,request,"accept")} // Pass the unique key to the handler
          />
          <FaTimes
          size={28}
            className="cursor-pointer text-red-500"
            onClick={() => handleRequest(mkey,request,"decline")} // Pass the unique key to the handler
          />
        </div>
        <p className="text-xs text-gray-400">{request.createdAt}</p>
      </div>
    );
  }, [request, mkey, handleRequest]);

  return memoizedComponent;
});

export default RequestItem;
