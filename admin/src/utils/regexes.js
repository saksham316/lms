export const nameRegex = /^[a-zA-Z ]+$/i;

export const shopNameRegex =
  /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!]{2,}$/i;

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

export const indianMobileRegex = /^[6-9]\d{9}$/i;

export const restrictZeroOnFirstPlace = /^([1-9]*|[1-9]*\.[1-9]{1}?[1-9]*)$/i;

export const websiteRegex =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/i;

export const customFieldregex = /^[a-zA-Z0-9 -]*$/i;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/i