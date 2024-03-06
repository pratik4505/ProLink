import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import debounce from "lodash/debounce";
import {API} from "../../utils/api"
import { MoonLoader } from "react-spinners";
import { MdClear } from "react-icons/md";



const Search = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const setInitialValue = () => {
    setUsers([]);
    setPosts([]);
    setCompanies([]);
    setLoading(false);
  };

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((q) => {
        setLoading(true);
        const encodedQuery = encodeURIComponent(q);
        API
          .get(`/search?q=${encodedQuery}`)
          .then((res) => {
            const { posts, users, companies } = res.data;
            setPosts(posts);
            setUsers(users);
            setCompanies(companies);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }, 800),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setInitialValue();
      return;
    }

    debouncedHandleSearch(value);
  };

  const clearValues = () => {
    setInitialValue();
    setInputValue("");
  };

  useEffect(() => {
    return () => {
      setInitialValue();
    };
  }, []);

  return (
    <div className="">
      <div className="relative">
        <input
          type="text"
          id="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for people, posts or Companies"
          className="h-10 py-1 bg-white border w-full md:w-[660px] rounded-full text-sm shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-500 transition duration-300 pl-3 pr-10"
          aria-label="Search"
          autoComplete="off"
        />
        {inputValue !== "" && (
          <button
            className="absolute top-0 right-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
            onClick={clearValues}
          >
            <MdClear />
          </button>
        )}
      </div>

      {inputValue !== "" && (
        <div
          onBlur={() => clearValues()}
          className="absolute start-0 md:start-auto w-screen top-12 md:w-[660px] bg-white border rounded-md shadow-md"
        >
          {loading && (
            <div className="flex items-center justify-center py-2 px-2">
              <MoonLoader size={20} color={"#008cff"} />
              <span className="ml-2">Searching...</span>
            </div>
          )}

          {users.length > 0 && (
            <ul className="z-30">
              {users.map((user) => (
                <li key={user._id} className="border-b py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/Profile/${user._id}`);
                      clearValues();
                    }}
                    className="block text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={user.imageUrl}
                          alt={user.userName}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {user.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.summary}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {posts.length > 0 && (
            <ul className="z-30">
              {posts.map((post) => (
                <li key={post._id} className="border-b py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/Post/${post._id}`);
                      clearValues();
                    }}
                    className="block text-sm text-gray-700 hover:text-blue-500 cursor-pointer"
                  >
                    <div className="flex items-center">
                      {/* <div className="flex-shrink-0">
                        <img
                          src={post.imageUrl}
                          alt={post.userName}
                          className="h-8 w-8 rounded-full object-cover"
                          loading="lazy"
                        />
                      </div> */}
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">
                          {post.content}
                        </div>
                        {/* <div className="text-sm text-gray-500">
                          Posted by {post.userName} 
                        </div> */}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
