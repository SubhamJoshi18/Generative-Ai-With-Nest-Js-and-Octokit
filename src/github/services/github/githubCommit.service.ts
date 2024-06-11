import { HttpException, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { User } from 'src/models/User.model';
@Injectable()
export class GithubCommitService {
  async getAllCommit(octoToken: string, repoName: string) {
    const octokit = new Octokit({
      auth: octoToken,
    });
    const { data: user } = await octokit.request('GET /user');
    if (user.login.length === 0) {
      throw new HttpException('Invalid Github Authentication', 401);
    }
    const owner = user.login;
    const repo = repoName;
    const response: any = await octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    let commitMessage: Array<any | object> = [];
    commitMessage = response.data.map((data: any) => data.commit.message);
    console.log(commitMessage);

    return commitMessage;
  }

  async compareCommitService(octoToken: string, repoName: string) {
    const octokit = new Octokit({
      auth: octoToken,
    });

    const { data: user } = await octokit.request('GET /user');
    if (user.login.length === 0) {
      throw new HttpException('Github Authentication Failed', 401);
    }
    const owner = user.login;
    const repo = repoName;
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 5,
    });
    commits.forEach((commit) => {
      console.log(`Commit Sha : ${commit.sha}`);
      console.log(`Commit Message : ${commit.commit.message}`);
      console.log('....');
    });

    const data: any = await octokit.rest.repos.listBranches({
      owner,
      repo,
    });
    console.log(data.data);
  }
}
