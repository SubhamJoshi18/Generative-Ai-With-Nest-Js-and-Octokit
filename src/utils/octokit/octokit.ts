import { Octokit } from '@octokit/rest';

export const octo: any = (token) => {
  return new Octokit({
    auth: token,
  });
};
