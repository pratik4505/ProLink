import GlobalContext from "../../context/GlobalContext";
import Post from "./Post";
import { API } from "../../utils/api";
import { useState, useEffect,useContext } from "react";
import FallbackLoading from "../loader/FallbackLoading";
const baseUrl = import.meta.env.VITE_SERVER_URL;
const postPerPage = 3;
export default function Feeds() {
  const gloContext=useContext(GlobalContext);
  const [loadMore, setLoadMore] = useState(false);
  
 
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      gloContext.setFeedsData([...gloContext.feedsData, ...gloContext.tempData]);
      setLoadMore(false);
      const response = await API.get(
        `/getFeeds?limit=${postPerPage}&afterDate=${
          gloContext.tempData[gloContext.tempData.length - 1].createdAt
        }`
      );
      const newData = response.data;

      gloContext.setTempData(newData);
      if (newData.length > 0) {
        setLoadMore(true);
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    }
  };

  const initialLoad = async () => {
    try {
      
      const response1 = await API.get(
        `/getFeeds?limit=${postPerPage}&afterDate=${new Date().toISOString()}`,
       
      );
      if (response1.status===200) {
        const postResponse1 = response1.data;
       
        if (postResponse1.length > 0) {
          gloContext.setFeedsData(postResponse1);
          const response2 = await API.get(
            `/getFeeds?limit=${postPerPage}&afterDate=${
              postResponse1[postResponse1.length - 1].createdAt
            }`
          );
          const postResponse2 = response2.data;
          if (postResponse2.length > 0) {
            gloContext.setTempData(postResponse2);
            setLoadMore(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    
    if(gloContext.feedsData.length===0)
    initialLoad();
    else
   { setLoading(false);
    setLoadMore(true);

   }
  }, []);

  if (loading) {
    return <FallbackLoading />;
  }

  return (
    <div className="flex flex-col">
      {gloContext.feedsData.map((feedData) => {
       return <Post key={feedData._id} postData={feedData} />;
      })}
      {loadMore && <button onClick={loadData}>Load More</button>}
    </div>
  );
}
