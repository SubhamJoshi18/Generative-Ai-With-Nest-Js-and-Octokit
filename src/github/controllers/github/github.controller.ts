import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';

import { postTokenDto } from 'src/auth/dtos/postTokenDto';
import { GithubService } from 'src/github/services/github/github.service';
import { Request } from 'express';
import { describeReposAi } from 'src/utils/repositories/describeRepo';
import GenAiSevices from 'src/geminiAi/gemini.Ai.service';

import { handleResposne } from 'src/helpers/responseHandler';
import { Response } from 'express';

declare module 'express' {
  interface Request {
    octokit?: any;
    octo_token?: any;
  }
}
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}
  @Get('test')
  testing(@Req() req: Request) {
    console.log(req.octokit);
    return req.octokit;
  }

  @Post('token')
  async postToken(@Body() postTokenDto: postTokenDto, @Res() res: Response) {
    try {
      console.log('I reached here');
      const response = await this.githubService.postTokenService(postTokenDto);
      return res.status(201).json({
        token: postTokenDto.token,
        message: response,
      });
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Get('publicRepo')
  async getAllPublicRepo(@Req() req: Request) {
    try {
      const octo_token = req.octo_token;

      const octo = req.octokit;
      const username = octo.login;

      const response = await this.githubService.getAllPubRepo(
        octo_token,
        username,
      );
      return response;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Get('describeRepo')
  async describeRepos(@Req() req: Request) {
    try {
      const octo_token = req.octo_token;
      const octo = req.octokit;
      const username = octo.login;

      const response = await this.githubService.describeRepo(
        octo_token,
        username,
      );

      try {
        const responseList = await describeReposAi(response);
        console.log('Descriptions of all repositories:', responseList);
        return responseList;
      } catch (error) {
        console.error('Error describing repositories:', error);
        return { message: error.message };
      }
    } catch (err) {
      return { message: err.message };
    }
  }

  @Get('getRepo')
  async getRepo(@Req() req: Request, @Query() query: any) {
    try {
      const octo_token = req.octo_token;
      const repoName = query.repoName;
      const response = await this.githubService.getRepo(repoName, octo_token);
      return response;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  @Get('desRepo')
  async describeLanguageRepo(@Req() req: Request, @Query() query: any) {
    try {
      const octo_token = req.octo_token;
      const repoName = query.repoName;
      const response = await this.githubService.getRepo(repoName, octo_token);
      console.log(response.Description);
      try {
        console.log('Hi');
        const responseList = await GenAiSevices.describeLanguage(
          query.repoName,
          response.Description,
        );
        return responseList;
      } catch (error) {
        console.error('Error describing repositories Languages:', error);
        return { message: error.message };
      }
    } catch (err) {
      return { message: err.message };
    }
  }
  catch(error) {
    console.log(error);
    return { message: error.message };
  }

  @Post('fetchFileRepo')
  async fetchFileFromRepoAndSummarize(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    try {
      const octo_token = req.octo_token;
      const repoName = query.repoName;
      const path = req.body.path;
      const responseData =
        await this.githubService.fetchFileFromRepoAndSummarize(
          octo_token,
          repoName,
          path,
        );
      return handleResposne(
        res,
        200,
        'File From Fetched SuccessFully',
        responseData,
      );
    } catch (error) {
      if (error instanceof Error) {
        return {
          message: error.message,
        };
      }
      return {
        message: error.message,
      };
    }
  }
}
