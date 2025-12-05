const Problem = require("../model/problem");
const Submissions = require("../model/submissions");
const { getLanguageId,submitBatch,submitToken } = require("../utils/problemUtils");

const userSubmision = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      res.status(400).send("some field missing");
    }

    //fetch problem by db
    const problem =await Problem.findById(problemId);
    // console.log(problem)

    // case

    const submitedResult = await Submissions.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCaseTotal: problem?.hiddenTestCases?.length
    });

    const languageId = getLanguageId(language);

    const submissions = problem.hiddenTestCases?.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    // console.log("submissions"+submissions)

    const submitResult = await submitBatch(submissions);
    // console.log("submitresult"+submitResult)
    const resultToken = await submitResult?.map((result) => result.token);
    const testResult = await submitToken(resultToken);

    // update the Submissions
    let runtime = 0;
    let memory = 0;
    let testCasePassed = 0;
    let status = "accpted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasePassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage = test.stderr;
        }
      }
    }

    // update the result in db

    submitedResult.status = status;
    submitedResult.runtime = runtime;
    submitedResult.memory = memory;
    submitedResult.errorMessage = errorMessage;
    submitedResult.testCasePassed = testCasePassed;

    await submitedResult.save();

    if(!req.result.problemSolved.includes(problemId)){
      req.result.problemSolved.push(problemId)
      await req.result.save()
    }

    res.status(201).send(submitedResult);
  } catch (error) {
    // console.log(error)
    res.status(500).send("Error:"+error);
  }
};


const runCode=async(req,res)=>{
try {
  // console.log('test')
    const userId = req.result._id;
    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
     return res.status(400).send("some field missing");
    }

    //fetch problem by db
    const problem =await Problem.findById(problemId);
    // console.log(problem)

    // case

    // const submitedResult = await Submissions.create({
    //   userId,
    //   problemId,
    //   code,
    //   language,
    //   status: "pending",
    //   testCaseTotal: problem?.hiddenTestCases?.length
    // });

    const languageId = getLanguageId(language);

    const submissions = problem.testCases?.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    // console.log("submissions"+submissions)

    const submitResult = await submitBatch(submissions);
    // console.log("submitresult"+submitResult)
    const resultToken = await submitResult?.map((result) => result.token);
    const testResult = await submitToken(resultToken);
    // console.log(testResult)

    res.status(201).send(testResult);
  } catch (error) {
    console.log(error)
    res.status(500).send("Error:"+error);
  }
}

module.exports={userSubmision,runCode}