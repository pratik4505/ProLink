import { memo, useMemo } from "react";
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import accept and decline icons

const RequestItem = memo(function RequestItem({ mkey, request, handleRequest }) {
  const memoizedComponent = useMemo(() => {
    return (
      <div key={request.key} className="p-4 bg-white rounded-lg shadow-md mb-4  ">
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-8 w-8">
            {/* Display user image with lazy loading */}
            <img
              className="rounded-full cursor-pointer"
              src={request.fromUser.imageUrl}
              alt={request.fromUser.userName}
              loading="lazy"
            />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-800">{request.fromUser.userName}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{`${request.type} request`}</p>

        <p className="text-xs text-gray-400">{request.createdAt}</p>

        {/* Accept and Decline icons with onClick handlers */}
        <div className="flex">
          <FaCheck
            className="cursor-pointer text-green-500 mr-2"
            onClick={() => handleRequest(mkey,request,"accept")} // Pass the unique key to the handler
          />
          <FaTimes
            className="cursor-pointer text-red-500"
            onClick={() => handleRequest(mkey,request,"decline")} // Pass the unique key to the handler
          />
        </div>
      </div>
    );
  }, [request, mkey, handleRequest]);

  return memoizedComponent;
});

export default RequestItem;
