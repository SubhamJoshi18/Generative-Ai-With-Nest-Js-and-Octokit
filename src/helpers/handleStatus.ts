enum statusConstants {
  SUCCESS = 'Success',
  FAIL = 'Fail',
  ERROR = 'Error',
}
const { SUCCESS, FAIL, ERROR } = statusConstants;

const handleStatus = (statusCode: number) => {
  if (`${statusCode}`.startsWith('2')) {
    return SUCCESS;
  } else if (`${statusCode}`.startsWith('4')) {
    return FAIL;
  } else {
    return ERROR;
  }
};
export default handleStatus;
