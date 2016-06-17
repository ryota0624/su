export const packNumber = (num) => {
  const strNum = String(num);
  if(strNum.length === 3) {
    return strNum;
  } else {
    const packNum = 3 - strNum.length;
    if(packNum === 1) {
      return '0' + strNum;
    } else if(packNum === 2) {
      return '00' + strNum;
    }
  }
};

