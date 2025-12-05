const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware =require("../middleware/userMidddleware")
const {problemCreate , problemUpdate,problemDelete , getProblem ,getAllProblem,solvedProblem,submittedProblem} = require("../controller/userProblem");


problemRouter.post("/create",adminMiddleware, problemCreate);
problemRouter.patch("/update/:id",adminMiddleware, problemUpdate);
problemRouter.delete("/delete/:id",adminMiddleware, problemDelete);

problemRouter.get("/getProblem/:id",userMiddleware, getProblem);
problemRouter.get("/allProblem", userMiddleware, getAllProblem);
problemRouter.get("/solved",userMiddleware, solvedProblem);
problemRouter.get("/submittedProblem/:id",userMiddleware, submittedProblem);

module.exports = problemRouter;









