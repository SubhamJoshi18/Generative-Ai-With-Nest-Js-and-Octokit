import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

export class Hashing {
  public static encodePassword(rawPassword: string) {
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const genSalt = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawPassword, genSalt);
  }
}
