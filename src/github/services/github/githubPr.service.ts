import { HttpException, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { PullRequestDto } from 'src/github/dtos/pullRequestDdto';
interface IFetchPrResponse {
  numberId: number;
  message: string;
  state: string;
  prTitle: string;
  prBody: string | null;
  head: {
    branch: string;
    user: string | null | undefined;
    sha: string;
  };
  base: {
    branch: string;
    user: string | null | undefined;
    sha: string;
  };
}
@Injectable()
export class GithubPrService {
  async fetchPullRequestService(octoToken: string, repoName: string) {
    const octokit = new Octokit({
      auth: octoToken,
    });
    const { data: user } = await octokit.request('GET /user');
    if (user.login.length === 0) {
      throw new HttpException('Github Authentication Failed', 403);
    }
    const owner = user.login;
    const repo = repoName;
    console.log(owner, repo);
    const { data: prs } = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls',
      {
        owner,
        repo,
      },
    );

    const checkGithub = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });

    if (!checkGithub.status.toString().startsWith('2')) {
      throw new HttpException('Github Repository Does Not Exists', 401);
    }

    const checkPullRequests = prs.length > 0;
    if (!checkPullRequests) {
      throw new HttpException(
        'This Repository Does not Contain Pull Request Currenlty',
        401,
      );
    }
    const prsList: IFetchPrResponse[] = [];

    prs.map((pr) => {
      prsList.push({
        numberId: pr.number,
        state: pr.state,
        message: `PR REQUEST : "${pr.title}" .This is a PR to merge changes from branch ${pr.head.ref} -> ${pr.base.ref} `,
        prTitle: pr.title,
        prBody: pr.body,
        head: {
          branch: pr.head.ref,
          user: pr.head.user?.login,
          sha: pr.head.sha,
        },
        base: {
          branch: pr.base.ref,
          user: pr.base.user?.login,
          sha: pr.base.sha,
        },
      });
    });

    const responseObject = {
      message: `Pull Request For ${repo} Fetched SuccessFully`,
      prs: prsList,
    };
    return responseObject;
  }

  async createPullRequest(
    octoToken: string,
    repoName: string,
    pullrequestDto: PullRequestDto,
  ) {
    const octokit = new Octokit({
      auth: octoToken,
    });
    const { data: user } = await octokit.request('GET /user');
    const owner = user.login;
    const repo = repoName;
    const title = pullrequestDto.title;
    const body = pullrequestDto.body;
    const head = pullrequestDto.head;
    const base = pullrequestDto.base;

    const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner,
      repo,
      title,
      body,
      head, //branch where your change are implemented
      base, // branch you want to merge into
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    console.log(response);
    return response;
  }

  async fetchFileFromPrService(
    octoToken: string,
    repoName: string,
    pullNumber: number | any,
  ) {
    const octokit = new Octokit({
      auth: octoToken,
    });
    const { data: user } = await octokit.request('GET /user');

    const { data: prFiles } = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      {
        owner: user.login,
        repo: repoName,
        pull_number: pullNumber,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    return prFiles;
  }
}
