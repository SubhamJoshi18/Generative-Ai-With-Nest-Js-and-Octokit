import { Request, Response } from 'express';
import {
  GitHubCrudServices,
  Iuser,
} from '../../services/github/githubCrud.service';
import {
  Get,
  Controller,
  Post,
  Query,
  Req,
  Res,
  Delete,
  Put,
} from '@nestjs/common';
import { handleResposne } from 'src/helpers/responseHandler';
import GenAiSevices from 'src/geminiAi/gemini.Ai.service';

@Controller('github')
export class GithubCrudController {
  constructor(private readonly GitHubCrudServices: GitHubCrudServices) {}

  @Post('getFileContent')
  async getFileContent(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const octo_token = req.octo_token; // Assuming the token is in the headers
      if (!octo_token) {
        return res.status(400).json({ message: 'Octo token missing' });
      }

      const pathReq = req.body.path;
      const repoName = query.repoName;

      if (!pathReq || !repoName) {
        return res.status(400).json({ message: 'Path or repoName missing' });
      }

      const reqObject = {
        octo_token,
        pathReq,
        repoName,
      };
      console.log(reqObject);
      const response =
        await this.GitHubCrudServices.getFileContentServices(reqObject);

      const formattedXml = this.formatContent(response.FILE_Content);

      return res.status(200).json({
        message: 'File Content',
        FILE_Content: formattedXml,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  }

  formatContent(content: string): string {
    return content
      .replace(/\\n\s+/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .trim();
  }

  @Put('updateFileContent')
  async updateFileContent(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log(req.user);
      const octo_token = req.octo_token;
      if (!octo_token) {
        return res.status(400).json({ message: 'Octo token missing' });
      }

      const pathReq = req.body.path;
      const repoName = query.repoName;
      const User: any = req.user;
      const username = User.user_name;
      const message = req.body.message;

      if (!pathReq || !repoName) {
        return res.status(400).json({ message: 'Path or repoName missing' });
      }

      const reqObject = {
        octo_token,
        pathReq,
        repoName,
        username,
        message,
      };

      const previousContent =
        await this.GitHubCrudServices.getFileContentServices(reqObject);
      const response =
        await this.GitHubCrudServices.createFileContentService(reqObject);
      console.log(response);
      return res.status(200).json({
        previousContent: previousContent,
        message: 'Created File SuccessFully',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  }
  @Delete('deleteFileContent')
  async deleteFileContent(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log(req.user);
      const octo_token = req.octo_token;
      if (!octo_token) {
        return res.status(400).json({ message: 'Octo token missing' });
      }

      const pathReq = req.body.path;
      const repoName = query.repoName;
      const User: any = req.user;
      const username = User.user_name;
      const message = req.body.message;

      if (!pathReq || !repoName) {
        return res.status(400).json({ message: 'Path or repoName missing' });
      }

      const reqObject = {
        octo_token,
        pathReq,
        repoName,
        username,
        message,
      };

      const response =
        await this.GitHubCrudServices.deleteFileContent(reqObject);
      console.log(response);
      return res.status(201).json({
        message: `${pathReq} Delete SuccessFully`,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  }

  @Get('reviewCode')
  async reviewCode(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log(req.user);
      const octo_token = req.octo_token;
      if (!octo_token) {
        return res.status(400).json({ message: 'Octo token missing' });
      }

      const pathReq = req.body.path;
      const repoName = query.repoName;
      const User: any = req.user;
      const username = User.user_name;
      const message = req.body.message;

      if (!pathReq || !repoName) {
        return res.status(400).json({ message: 'Path or repoName missing' });
      }

      const reqObject = {
        octo_token,
        pathReq,
        repoName,
        username,
        message,
      };

      const previousContent =
        await this.GitHubCrudServices.getFileContentServices(reqObject);
      console.log(previousContent);
      const checkCode = await GenAiSevices.reviewCode(
        previousContent.FILE_Content,
        message,
      );
      return res.status(201).json({
        previousContent: previousContent.FILE_Content,
        newContent: message,
        review: checkCode,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }

      http: return res.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  }

  @Get('summarizeCode')
  async summarizeCode(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log(req.user);
      const octo_token = req.octo_token;
      if (!octo_token) {
        return res.status(400).json({ message: 'Octo token missing' });
      }

      const pathReq = req.body.path;
      const repoName = query.repoName;
      const User: any = req.user;
      const username = User.user_name;
      const message = req.body.message;

      if (!pathReq || !repoName) {
        return res.status(400).json({ message: 'Path or repoName missing' });
      }

      const reqObject = {
        octo_token,
        pathReq,
        repoName,
        username,
        message,
      };

      const fileContent =
        await this.GitHubCrudServices.getFileContentServices(reqObject);
      const responseFromAi = await GenAiSevices.summarizeCode(
        fileContent.FILE_Content,
      );

      return res.status(201).json({
        message: 'Code Summarization',
        response: responseFromAi,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }

      http: return res.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  }
}
