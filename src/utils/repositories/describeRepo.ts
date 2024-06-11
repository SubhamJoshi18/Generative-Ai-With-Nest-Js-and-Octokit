import GenAiSevices from 'src/geminiAi/gemini.Ai.service';

export const describeReposAi = async (repoList: Array<any>) => {
  let responseList: any[] = [];

  for (let i = 0; i < repoList.length; i++) {
    const summary = await GenAiSevices.describePrompt(repoList[i]);
    console.log(summary);
    responseList.push(summary);
  }

  console.log(responseList);
  return responseList;
};
