import {
  Controller,
  Post,
  Req,
  Res,
  Query,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PullRequestDto } from 'src/github/dtos/pullRequestDdto';
import { GithubPrService } from 'src/github/services/github/githubPr.service';

@Controller('github')
export class GithubPrController {
  constructor(private readonly githubprService: GithubPrService) {}
  @Post('fetch-prs')
  async fetchPullRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    try {
      const octo_token = req.octo_token;
      const repoName = query.repoName;
      const response = await this.githubprService.fetchPullRequestService(
        octo_token,
        repoName,
      );
      return res.status(201).json({
        response,
      });
    } catch (err: Error | any) {
      if (err instanceof Error) {
        return res.status(401).json({
          message: err.message,
        });
      }
      return res.status(500).json({
        message: err.message,
        name: err.name,
      });
    }
  }

  @Post('create-prs')
  @UsePipes(new ValidationPipe())
  async createPullRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
    @Body() pullrequestDto: PullRequestDto,
  ) {
    try {
      const octo_token = req.octo_token;
      const repoName = query.repoName;
      const response = await this.githubprService.createPullRequest(
        octo_token,
        repoName,
        pullrequestDto,
      );
      return res.status(201).json({
        response,
      });
    } catch (err: Error | any) {
      if (err instanceof Error) {
        return res.status(401).json({
          message: err.message,
        });
      }
      return res.status(500).json({
        message: err.message,
      });
    }
  }

  @Post('fetch-file')
  async fetchFileFromPr(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
    @Body() body: any,
  ) {
    try {
      const octo_token = req.octo_token;
      const repoName = query.repoName;
      const pullNumber = body.pullNumber;
      const response = await this.githubprService.fetchFileFromPrService(
        octo_token,
        repoName,
        pullNumber,
      );
      return res.status(201).json({
        response,
      });
    } catch (err) {
      return res.status(401).json({
        message: err.message,
      });
    }
  }
}
