import type { Response } from 'express';

export type NetIssue = {
  code: string;
  message: string;
  field?: string;
};

export class NetworkError<T extends string, I extends Record<string, string>> {
  public issues: Array<I | NetIssue> = [];
  public name: T;
  public statusCode: number;
  constructor(
    statusCode = 500,
    name: T = 'UnhandledError' as T,
    ...issues: Array<I | NetIssue>
  ) {
    this.name = name;
    this.statusCode = statusCode;
    if (issues) this.issues = this.issues.concat(issues);
  }

  public addIssue(...issue: Array<I & NetIssue>) {
    this.issues = this.issues.concat(issue);
  }

  public toJSON() {
    return { issues: this.issues, name: this.name };
  }

  public send(res: Response) {
    res.status(this.statusCode).json(this);
  }
}
