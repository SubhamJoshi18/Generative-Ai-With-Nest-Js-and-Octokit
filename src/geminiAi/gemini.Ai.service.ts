import { GoogleGenerativeAI } from '@google/generative-ai';

class GenAiSevices {
  public static connectToModel = () => {
    const genAI = new GoogleGenerativeAI(
      'AIzaSyBaEgt7pS0EqU3KzA1d8-DNrBaJegYYwv4' as string,
    );
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
    });
    return model;
  };

  public static summarizeCode = async (code: any) => {
    const prompt = `Give summary of this code: ${code}`;
    const response = await this.connectToModel().generateContent(prompt);
    const reply = response.response.text();
    return reply;
  };

  public static reviewCode = async (prevCode: any, newCode: any) => {
    const prompt = `Compare The Previous Code and New Code and Give me the result Good Or Bad At Last, This is the NewCode : ${newCode} Now Compare it With Previous Code ${prevCode}`;
    const response = await this.connectToModel().generateContent(prompt);
    const reply = response.response.text();
    return reply;
  };
  public static reviewPrChanges = async (code: any) => {
    const prompt = `This prompt is being used while interacting with the google gemini api. So give me concise and clear answer to the following question because I need a short response. Give PR for following patch: ${code}. This should be short meaning just review and give what can be improved or what errors can be fixed. Also the answer should be in paragraph instead of points. Don't start of by saying this "this patch includes this" or "patch  is this". If everything is ok say everything is okay and no need for changes . if code needs changes suggest changes and if there are error point out the error of how it should be done but dont give the code on how to fix it .just give what should be done in error thats it.Make the review comment short and sweet.`;
    const response = await this.connectToModel().generateContent(prompt);
    const reply = response.response.text();
    return reply;
  };

  public static describePrompt = async (message: string) => {
    const prompt = `This Message is for the Client Please Elaborate the Message so that client understands it , This is Git Repositories of the Client Please Describe Its Repository${message}`;
    const response = await this.connectToModel().generateContent(prompt);
    const reply = response.response.text();
    return reply;
  };

  public static describeLanguage = async (repoName: string, message: any) => {
    console.log(message);
    const prompt = `Repository Name:${repoName} 
    Description:
    Please elaborate on the languages used in the user repository mentioned above. The Object Format includes the following languages and their respective line counts:    ${message}


    Kindly provide a detailed explanation of the role each language plays within this repository and elaborate on their usage based on the line counts provided.
    `;
    const response = await this.connectToModel().generateContent(prompt);
    const reply = response.response.text();
    return reply;
  };
}

export default GenAiSevices;
