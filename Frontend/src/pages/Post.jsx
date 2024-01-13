import { useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GlobalContext from "../context/GlobalContext";
import Post from "../Components/post/Post";
import FallbackLoading from "../Components/loader/FallbackLoading";
const baseUrl = import.meta.env.VITE_BASE_URL;
export default function Home() {
  const [post, setPost] = useState(null); // Initialize post as null
  const { postId } = useParams();
  const gloContext = useContext(GlobalContext);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Assuming you have credentials set in your axios configuration
        const response = await axios.get(`${baseUrl}/getPost/${postId}`, {
          withCredentials: true,
        });
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    // Fetch data when the component mounts
    fetchPostData();
  }, [postId]); // Fetch data whenever postId changes

  // You can customize the loading indicator based on your design
  if (!post) {
    return <FallbackLoading />;
  }

  return (
    <Post postData={post} />
  );
}
