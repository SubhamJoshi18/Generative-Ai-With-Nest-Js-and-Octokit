import { Controller, Get, Res, Req, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { GithubService } from 'src/github/services/github/github.service';
import { GithubCommitService } from 'src/github/services/github/githubCommit.service';

@Controller('github')
export class GithubCommitController {
  constructor(private readonly githubCommitService: GithubCommitService) {}
  @Get('commits')
  async getCommits(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ): Promise<any> {
    try {
      const octo_token = req.octo_token;
      const repoName = query.repoName;
      const response = await this.githubCommitService.getAllCommit(
        octo_token,
        repoName,
      );
      return res.status(201).json({
        Latest_Commit_Message: response,
      });
    } catch (err: Error | any) {
      if (err instanceof Error) {
        console.log(err.name, err.message);
        return res.status(401).json({ message: err.message });
      }
    }
  }

  @Get('compare')
  async compareCommit(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    try {
      const octo_token = req.octo_token;
      const response = await this.githubCommitService.compareCommitService(
        octo_token,
        query.repoName,
      );
      return response;
    } catch (err: Error | any) {
      if (err instanceof Error) {
        return res.status(401).json({
          message: err.message,
        });
      }
    }
  }
}
