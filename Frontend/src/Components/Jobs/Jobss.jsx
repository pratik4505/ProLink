import React, { useState, useEffect, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { FaSearchDollar } from "react-icons/fa";
import { FaResearchgate } from "react-icons/fa";
import { FaSearchPlus } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import "./jobss.scss";

import AllJob from "./AllJob";
import Currjob from "./Currjob";
const jobToFetch = 5;
const baseUrl = import.meta.env.VITE_SERVER_URL;
export default function Jobss() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [company, setCompany] = useState("");
  const [jobsData, setJobsData] = useState([]);
  const [currJobData, setCurrJobData] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [isAll, setIsAll] = useState(true);

  const jobHandler = (data) => {
    setCurrJobData(data);
    console.log(currJobData);
  };

  const loadJobHandler = useCallback(async () => {
    const skip = jobsData.length;
    const limit = jobToFetch;

    try {
      const response = await fetch(
        `${baseUrl}/jobs/getJobs?skip=${skip}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Server Error");
      }

      const { jobOpenings, moreDocuments } = await response.json();
     
      setJobsData((prevData) => [...prevData, ...jobOpenings]);
      setLoadMore(moreDocuments);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, [jobsData, setJobsData, setLoadMore]);

  const searchJobs = async () => {
    try {
      const queryParams = new URLSearchParams({
        jobTitle,
        location,
        industry,
        company,

        limit: jobToFetch,
        lastId: jobsData.length > 0 ? jobsData[jobsData.length - 1]._id : "NA",
      });

      const response = await fetch(
        `${baseUrl}/jobs/getJobSearch?${queryParams}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();

        setJobsData((prevJobs) => [...prevJobs, ...data.jobOpenings]);
        setLoadMore(data.moreDocuments);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const searchSwitchHandler = () => {
    setIsAll((prev) => {
      if (prev) {
        setJobsData([]);
        searchJobs();
      }
      return false;
    });
  };

  const allSwitchHandler = () => {
    setIsAll((prev) => {
      if (!prev) {
        setLocation("");
        setJobTitle("");
        setIndustry("");
        setCompany("");
        setJobsData([]);
        setLoadMore(false);
        loadJobHandler();
      }
      return true;
    });
  };

  useEffect(() => {
    loadJobHandler();
  }, []);

  return (
    <>
    
      <div className="jobs">
        <div className="jobs-search">
           <div className="jobs-header">
            <h1 className="h1-jobs"><b>Job Hunt</b></h1>
            <button type="button" className="btn btn-primary search-jobs-btn" onClick={searchSwitchHandler}><b>Search</b></button>
            <button type="button" className="btn btn-primary all-jobs-btn" onClick={allSwitchHandler}><b>Jobs</b></button>  
        </div>    
          <input
            type="text"
            placeholder="Job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          
        </div>
        <div className="all_jobs">
        {currJobData && <Currjob data={currJobData} />}
          {jobsData.map((jobData) => (
            <AllJob key={jobData._id} data={jobData} onClick={jobHandler} />
          ))}
          {loadMore && (
            <button
              className="load_more"
              onClick={isAll ? loadJobHandler : searchJobs}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </>
  );
}
