export const responseSuccess = (args: any = {}) => {
  return {
    success: true,
    data:{
      ...args
    }
  };
};

export const responseError = (message: string, args: any = {}) => {
  return {
    success: false,
    error:{text: message},
    data:{
      ...args
    }
  };
};
