const Problem = require("../model/problem");
const Submissions = require("../model/submissions");
const User = require("../model/user");
const { problemValidate } = require("../utils/problemUtils");
const sulationVideo = require("../model/sulationVideo");

const problemCreate = async (req, res) => {
  const { testCases, referenceSolution } = req.body;
  // console.log('test')

  try {
    await problemValidate(testCases, referenceSolution);

    // console.log("Validation successful");

    const newproblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });
    res.status(201).send("Problem created successfully");
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};

const problemUpdate = async (req, res) => {
  const { id } = req.params;
  const { testCases, referenceSolution } = req.body;

  try {
    if (!id) {
      res.status(400).send("id is missing");
    }

    const findproblem = await Problem.findById(id);

    if (!findproblem) {
      res.status(400).send("Problem is not present server");
    }

    await problemValidate(testCases, referenceSolution);

    // console.log("Validation successful");

    const newUpdate = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    res.status(201).send("Problem update successfully");
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};

const problemDelete = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(400).send("id is missing");
    }

    const problemDelete = await Problem.findByIdAndDelete(id);

    if (!problemDelete) {
      res.status(400).send("problem is missing");
    }
    res.status(200).send("Problem Delete Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Delete Error:" + error);
  }
};

const getProblem = async (req, res) => {
  // console.log('last parms',+req.params)
  const { id } = req.params;
  // console.log(req.params)
  try {
    // console.log(id)
    if (!id) {
      return req.status(400).send("id is missing");
    }
    // console.log('test')
    const getProblem = await Problem.findById(id).select(
      " _id title description difficulty tags testCases startCode"
    );
    // console.log('test')

    if (!getProblem) {
      return res.status(400).send("problem is not find");
    }

    const videos = await sulationVideo.findOne({ problemId: id });

    // console.log("videos", videos);
    if (videos) {
      const responseData = {
        ...getProblem.toObject(),
        secureUrl: videos.secureUrl,
        cloudinaryPublicIdl: videos.cloudinaryPublicId,
        thumbnailUrl: videos.thumbnailUrl,
        duration: videos.duration,
      };
      // console.log("responseData", responseData);
     return res.status(200).send(responseData);
    }
    // console.log(getProblem)
    res.status(200).send(getProblem);
  } catch (error) {
    // console.log(error)
    res.status(500).send("Error:" + error);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const allProblem = await Problem.find({});

    if (!allProblem === 0) {
      res.status(400).send("Problem not found");
    }

    res.status(200).send(allProblem);
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};

const solvedProblem = async (req, res) => {
  try {
    const UserId = req.result._id;
    const solved = await User.findById(UserId).populate({
      path: "problemSolved",
      select: "_id title description difficulty tags",
    });

    res.status(200).send(solved.problemSolved);
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const ans = await Submissions.find({ userId, problemId });

    if (ans.length == 0) {
      res.status(200).send("Submmision not found");
    }

    res.status(200).send(ans);
  } catch (error) {
    res.status(500).send("error:" + error);
  }
};

module.exports = {
  problemCreate,
  problemUpdate,
  problemDelete,
  getProblem,
  getAllProblem,
  solvedProblem,
  submittedProblem,
};
