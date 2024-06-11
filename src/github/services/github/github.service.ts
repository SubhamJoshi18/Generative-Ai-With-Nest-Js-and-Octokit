import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { postTokenDto } from 'src/auth/dtos/postTokenDto';
import GenAiSevices from 'src/geminiAi/gemini.Ai.service';
import { octo } from 'src/utils/octokit/octokit';
import { describeReposAi } from 'src/utils/repositories/describeRepo';
import { handleResposne } from 'src/helpers/responseHandler';
@Injectable()
export class GithubService {
  async postTokenService(postTokenDto: postTokenDto) {
    if (postTokenDto.token.length !== 8 && typeof postTokenDto === 'string') {
      throw new HttpException('Please Enter A valid', 401);
    }
    const octokit = octo(postTokenDto.token);
    const { data: user } = await octokit.request('GET /user');
    console.log(user);
    if (Object.keys(user).length === 0) {
      throw new UnauthorizedException(
        'Invalid Access Token , Please Enter A Valid Access Token',
      );
    }
    console.log('Hello World');
    const message = `${user.login} Has Been Authenticated SuccessFully`;
    return message;
  }

  async getAllPubRepo(token: string, username: string) {
    const octokit = new Octokit({
      auth: token,
    });

    const userInfo = await octokit.request('GET /user');
    console.log(userInfo);
    const testing = await octokit.request('GET /users/{username}/repos', {
      username: username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const RepoList = testing.data.map((data) => data.name);
    return RepoList.length > 0
      ? { info: userInfo, RepoList }
      : ['No Repos Available'];
  }

  async describeRepo(token: string, username: string) {
    const octokit = new Octokit({
      auth: token,
    });

    const testing = await octokit.request('GET /users/{username}/repos', {
      username: username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const RepoList = testing.data.map((data) => data.name);
    return RepoList;
  }
  async getRepo(repoName: any, token: string) {
    const octokit = new Octokit({
      auth: token,
    });
    const { data: user } = await octokit.request('GET /user');
    if (user.login.length === 0) {
      throw new UnauthorizedException();
    }
    console.log(user.login);

    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/languages',
      {
        owner: user.login,
        repo: repoName,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    for (const key in response.data) {
      const values = response.data[key];
      console.log(`${key} :  ${Number(values)}`);
    }
    const responseToSend = {
      Repository: repoName,
      Description: response.data,
    };
    return responseToSend;
  }

  async fetchFileFromRepoAndSummarize(
    token: string,
    repoName: string,
    path: any,
  ) {
    console.log('I reached here');
    const octokit = new Octokit({
      auth: token,
    });
    const { data: user } = await octokit.request('GET /user');
    if (user.login.toString().length == 0) {
      throw new UnauthorizedException('Github Authentication Failed');
    }
    const { data: fileData } = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: user.login,
        repo: repoName,
        path: path,
      },
    );

    console.log(fileData);
    if (Array.isArray(fileData) || fileData.type !== 'file') {
      throw new HttpException('The Specified Path is not a file', 400);
    }
    const content = fileData.content
      ? Buffer.from(fileData.content, 'base64').toString()
      : 'No Content';

    const summary = await GenAiSevices.summarizeCode(content);

    const responseData = { 'Code Summary': summary };
    return responseData;
  }
}
