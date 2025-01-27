export enum ApiResponseCode {
  SUCCESS = 200, // 成功
  FAIL = 500,
  USER_ID_INVALID = 10001, // 用户id无效
  USER_NOT_EXIST = 10002, // 用户id无效
  USER_EXIST = 10003, //用户已存在
  PASSWORD_ERR = 10004, //密码错误
  COMMON_CODE = 20000, //通用错误码
  FILE_ERROR = 30000, //文件错误
  FORBIdEN = 403, //没有权限
}
