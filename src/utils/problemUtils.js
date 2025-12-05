const axios = require('axios');




const getLanguageId = (lang) => {
    const language={
        "c++":105,
        "java":91,
        "javascript":102

    }
    return language[lang.toLowerCase()];
}

const submitBatch=async(submissions)=>{
const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key':  process.env.JUDGE0_API,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};
async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
		console.error(error);
	}
}

 return await fetchData();


}


// const wating=async(time)=>{

//   setTimeout(()=>{
//     return 1
//   },time)
// }

// const submitToken=async(resultToken)=>{


// const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: resultToken?.join(','),
//     base64_encoded: 'false',
//     fields: '*'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_API,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data
// 	} catch (error) {
// 		console.error(error);
// 	}
// }
// while(true){

//   const result = await fetchData();
//    const isResultObident=result?.submissions?.every(r=>r.status_id>2)

//    if(isResultObident){
//      return result.submissions
//    }
//    await wating(2000)
// }

// }

const wating = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken?.join(','),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': '040b2089b6mshca3ef57af5f8aaap11b739jsn8347e4e585d6',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      // console.log('axios')
      // console.log(response)
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // max 10 retries (10 seconds total if 1s delay each time)
  for (let i = 0; i < 10; i++) {
    const result = await fetchData();
    if (!result || !result.submissions) continue;

    const allDone = result.submissions.every(r => r.status_id > 2);
    if (allDone) {
      return result.submissions;
    }

    await wating(1000); // wait 1 second before next check
  }

  throw new Error("Timeout: Judge0 did not complete within expected time.");
}


 const problemValidate = async (testCases, referenceSolution) => {
  try {
    for (const { language, completeCode } of referenceSolution) {
        const languageId = getLanguageId(language);
// console.log('test')
        const submissions = testCases.map((testCase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.output,
        }));
// console.log('test')
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((result) => result.token);
// console.log('test')
        const testResult = await submitToken(resultToken);
// console.log(testResult)
        for (let i = 0; i < testResult.length; i++) {
          const element = testResult[i];
          // console.log(`[${language}] Test case ${i + 1}: status_id=${element.status_id}, status=${element.status?.description}`);
          // console.log('test')
          if (element.status_id != 3) {
            // console.log(`Test ${i + 1} failed. Output: ${element.stdout || 'N/A'}, Expected: ${testCases[i].output}`);
            throw new Error(
              `Reference solution for ${language} failed on test case ${i + 1}`
            );
          }
        }
      }
  } catch (error) {
    throw new Error("Validation failed: " + error.message);
  }
      
    };


module.exports={problemValidate,getLanguageId,submitBatch,submitToken}