import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { NextFunction, Request } from 'express';
import { octo } from 'src/utils/octokit/octokit';

export class ValdiateOctokit implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const octokit_token = req.headers['octokit_key'];
    console.log(octokit_token);
    if (!octokit_token) {
      throw new UnauthorizedException('Octokit Token Is Required');
    }

    const octokit = new Octokit({
      auth: octokit_token.toString(),
    });
    const { data: user } = await octokit.request('GET /user');
    if (Object.keys(user).length === 0) {
      throw new UnauthorizedException(
        'Invalid Access Token , Please Enter A Valid Access Token',
      );
    }
    if (user) {
      req['octo_token'] = octokit_token;
      req['octokit'] = user;
      next();
    }
  }
}
