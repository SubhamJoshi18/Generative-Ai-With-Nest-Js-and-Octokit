import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import handleStatus from './handleStatus';

interface IResponseJson {
  statusCode: string | number;
  status: string | number;
  message: string;
  data?: any;
  dataLength?: any;
}

export const handleResposne = (
  res: Response | any,
  statusCode: number,
  message: string,
  data: any = null,
  length: any = null,
) => {
  const ResponseJson: IResponseJson = {
    statusCode: `${statusCode} ` || HttpStatus.NOT_FOUND,
    status: handleStatus(statusCode),
    message: message,
  };
  if (data) {
    ResponseJson.data = data;
    ResponseJson.dataLength = length;
  }
};
