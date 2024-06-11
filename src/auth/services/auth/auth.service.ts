import { registerDto } from './../../dtos/registerDto';
import { postTokenDto } from './../../dtos/postTokenDto';
import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { passwordStrength } from 'check-password-strength';
import { User } from 'src/models/User.model';
import { Model } from 'mongoose';
import { Hashing } from 'src/utils/encode';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from 'src/auth/dtos/loginDto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    // @Inject('HASHING') private readonly hashing: Hashing,
  ) {}

  async postTokenService(postTokenDto: postTokenDto) {
    if (postTokenDto.token.length !== 8 && typeof postTokenDto === 'string') {
      throw new HttpException('Please Enter A valid', 401);
    }
    const octoKit = new Octokit({
      auth: postTokenDto.token,
    });
    const { data: user } = await octoKit.request('GET /user');
    if (Object.keys(user).length === 0) {
      throw new UnauthorizedException(
        'Invalid Access Token , Please Enter A Valid Access Token',
      );
    }
    const message = `${user.login} Has Been Authenticated SuccessFully`;
    return message;
  }

  async registerUser(registerDto: registerDto) {
    const { username, password, email } = registerDto;

    console.log(username, password, email);
    const checkExistsUser = await this.userModel.find({
      $or: [{ username: username }, { email: email }],
    });
    if (checkExistsUser.length > 0) {
      throw new HttpException(
        'User or Email Already Exists, Please Try Another One',
        401,
      );
    }
    const strengthPassword = passwordStrength(password).value;
    if (strengthPassword.match('weak')) {
      throw new HttpException(
        `${strengthPassword}, Please Enter A Strong Password }`,
        401,
      );
    }
    const newUser = new this.userModel({
      username: username,
      email: email,
      password: Hashing.encodePassword(password),
    });
    await newUser.save();
    const message = `${newUser.username} Has Been Registered SuccessFully`;
    return message;
  }

  async loginUser({ username, password }: LoginDto) {
    const hashing = new Hashing();
    const checkExistsUser = await this.userModel.findOne({
      username: username,
    });
    console.log(checkExistsUser);
    if (checkExistsUser.email === null || '') {
      throw new HttpException('User Name Does not Exists', 401);
    }
    const checkPassword = await bcrypt.compare(
      password,
      checkExistsUser.password,
    );
    if (!checkPassword) {
      throw new UnauthorizedException();
    }
    const payload = {
      user_id: checkExistsUser._id,
      user_name: checkExistsUser.username,
    };
    console.log('Line no 94');
    const token = this.jwtService.sign(payload);
    const response = {
      access_token: token,
      user_id: checkExistsUser._id,
      user_name: checkExistsUser.username,
    };
    console.log('Line no 99');
    return response;
  }
}
