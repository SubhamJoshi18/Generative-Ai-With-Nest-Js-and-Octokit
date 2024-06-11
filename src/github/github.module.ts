import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GithubController } from './controllers/github/github.controller';
import { GithubService } from './services/github/github.service';
import { ValidateToken } from 'src/middleware/validateToken.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ValdiateOctokit } from 'src/middleware/validateOctokit';
import { GitHubCrudServices } from './services/github/githubCrud.service';
import { GithubCrudController } from './controllers/github/githubCrud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import userSchema, { User } from 'src/models/User.model';
import { GithubCommitController } from './controllers/github/githubCommit.controller';
import { GithubCommitService } from './services/github/githubCommit.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'randomKey',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  controllers: [GithubController, GithubCrudController, GithubCommitController],
  providers: [GithubService, GitHubCrudServices, GithubCommitService],
})
export class GithubModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateToken)
      .forRoutes(GithubController, GithubCrudController);
    consumer
      .apply(ValdiateOctokit)
      .exclude(
        { path: '/github/token', method: RequestMethod.ALL },
        { path: '/auth/register', method: RequestMethod.ALL },
        { path: '/auth/login', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
