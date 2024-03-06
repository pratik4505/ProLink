const JobOpening = require("../../models/jobOpening");

exports.getJobs = async (req, res) => {
  const { skip, limit } = req.query;
  const userId = req.userId;

  try {
    const jobOpenings = await JobOpening.find()
      .skip(Number(skip))
      .limit(Number(limit));

    const jobsWithApplicationStatus = jobOpenings.map((job) => ({
      ...job._doc,
      hasApplied: job.appliedBy.includes(userId),
    }));

    const count = await JobOpening.countDocuments();

    const moreDocuments = skip + limit < count;

    res
      .status(200)
      .json({ jobOpenings: jobsWithApplicationStatus, moreDocuments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobSearch = async (req, res) => {
  try {
    const { jobTitle, industry, location, company, limit, lastId ,skip} = req.query;

    const query = {};
    if(lastId!=='NA') query._id = lastId;
    if (jobTitle) query.jobTitle = jobTitle;
    if (industry) query.industry = industry;
    if (location) query.location = location;
    if (company) query.companyName = company;

   
    if (Object.keys(query).length === 0) {
      const jobOpenings = [];
      const moreDocuments = false;

      return res.status(200).json({ jobOpenings, moreDocuments });
    }

    const jobOpenings = await JobOpening.find(query)
    .limit(Number(limit));

    const userId = req.userId;

    for (let i = 0; i < jobOpenings.length; i++) {
      const hasApplied = jobOpenings[i].appliedBy.includes(userId);

      jobOpenings[i] = {
        ...jobOpenings[i]._doc,
        hasApplied,
      };
    }
    
    const count = await JobOpening.countDocuments(query);

    const moreDocuments = skip + limit < count;

    res.status(200).json({ jobOpenings, moreDocuments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
