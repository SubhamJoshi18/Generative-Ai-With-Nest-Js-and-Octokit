import { UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Octokit } from '@octokit/rest';
import { Model } from 'mongoose';
import { User } from 'src/models/User.model';
import { octo } from 'src/utils/octokit/octokit';

interface IreqObject {
  octo_token: string;
  pathReq: string | any;
  repoName: string;
  username?: any;
  message?: any;
}

export interface Iuser {
  user_id: string;
  user_name: string;
  iat: number;
  exp: number;
}

export class GitHubCrudServices {
  constructor(@InjectModel(User.name) private user: Model<User>) {}
  async getFileContentServices(reqObject: IreqObject | any) {
    const octokit = new Octokit({
      auth: reqObject.octo_token,
    });
    const { data: user } = await octokit.request('GET /user');
    const owner = user.login;
    const repo = reqObject.repoName;
    const path = reqObject.pathReq;
    console.log(owner, repo, path);
    const response: any = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
      },
    );

    const content = Buffer.from(response.data.content, 'base64').toString(
      'utf-8',
    );
    console.log(content);
    const forwardRes = {
      FILE_Content: content,
    };
    return forwardRes;
  }

  async createFileContentService(reqObject: IreqObject) {
    const octokit = new Octokit({
      auth: reqObject.octo_token,
    });
    const { data: user } = await octokit.request('GET /user');
    const owner = user.login;
    const repo = reqObject.repoName;
    const path = reqObject.pathReq;
    const message = reqObject.message;
    const content = Buffer.from(message).toString('base64');
    const checkExistsUser = await this.user.findOne({
      username: reqObject.username,
    });
    if (!checkExistsUser) {
      throw new UnauthorizedException('User Does not Have Committer');
    }
    const committer = {
      name: user.login,
      email: checkExistsUser.email,
    };
    const sha = await this.getFileSha(reqObject.octo_token, owner, repo, path);

    const response = await octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
        message,
        committer,
        content,
        sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    return response;
  }

  async deleteFileContent(reqObject: IreqObject) {
    const octokit = new Octokit({
      auth: reqObject.octo_token,
    });
    const { data: user } = await octokit.request('GET /user');
    const owner = user.login;
    const repo = reqObject.repoName;
    const path = reqObject.pathReq;
    const message = reqObject.message;
    console.log(repo, path, message);
    const content = Buffer.from(message).toString('base64');
    const checkExistsUser = await this.user.findOne({
      username: reqObject.username,
    });
    if (!checkExistsUser) {
      throw new UnauthorizedException('User Does not Have Committer');
    }
    const committer = {
      name: user.login,
      email: checkExistsUser.email,
    };
    const sha = await this.getFileSha(reqObject.octo_token, owner, repo, path);

    const response = await octokit.request(
      'DELETE /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
        message,
        committer,
        content,
        sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    return response;
  }

  async getFileSha(token: string, owner: string, repo: string, path: string) {
    try {
      const octokit = new Octokit({
        auth: token,
      });
      const { data }: any = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner,
          repo,
          path,
        },
      );
      return data?.sha;
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  //Ai
}
