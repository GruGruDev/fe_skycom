/* eslint-disable vietnamese/vietnamese-words */
import { PHONE_REGEX } from "constants/index";
import reduce from "lodash/reduce";
import { showSuccess } from "./toast";
import { LABEL } from "constants/label";

export const regexAlphanumeric = (str: string) => {
  return str.replace(/[^a-zA-Z0-9\s]/gi, "") as string;
};

export const regexNumeric = (str: string) => {
  return str.replace(/[^0-9\s]/gi, "") as string;
};

export const isVietnamesePhoneNumber = (phone: string = "") => {
  return PHONE_REGEX.test(phone);
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const toSimplest = (str = "") => {
  str = str.toString();
  if (str) {
    str = str.toLowerCase();
    str = str.replace(/ /g, "");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\r\n|\r|\n|\t/g, ""); //
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      "",
    );

    str = str.replace(/ + /g, "");
  } else {
    str = "";
  }
  return str;
};

export function linkifyUtil(text: string) {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function matchPhoneNumber(input = "") {
  if (input.length > 9) {
    const frontRegex = /0(.+)/;
    const behindRegex = /(.+)[0-9]/;
    const match = input.match(frontRegex);
    return match?.[0].match(behindRegex)?.[0] || input;
  }
  return input;
}

export const searchAlgorithm = (value1?: string, value2?: string) => {
  if (!value1 || !value2) {
    return true;
  }
  return (
    toSimplest(value1).includes(toSimplest(value2)) ||
    toSimplest(value2).includes(toSimplest(value1))
  );
};

export const searchAlgorithmV2 = (
  data: any[],
  getValueToSearch: (item: any) => string,
  value?: string,
) => {
  if (!data.length || !value) {
    return data;
  }
  // break value bởi khoảng trắng thành mãng => toSimplest mỗi item
  const toSimplestValueList = value.split(" ").map((item) => toSimplest(item));
  const valueToSearchList = reduce(
    data,
    (prev: any[], cur) => {
      let isMatch = false;
      let i = 0;
      do {
        isMatch = toSimplest(getValueToSearch(cur)).includes(toSimplestValueList[i]);
        i++;
      } while (isMatch === false && i < toSimplestValueList.length);

      return isMatch ? [...prev, cur] : prev;
    },
    [],
  );
  return valueToSearchList;
};

export const isUuid = (id?: string) => {
  return id
    ? /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
    : false;
};

export const maskedPhone = (phone: string, _showCount: number = 3) =>
  // phone.substring(0, phone.length - showCount).replace(/\d/g, "*") +
  // phone.substring(phone.length - showCount, phone.length);
  phone;

export function containsNumber(inputString: string) {
  const regex = /\d/;
  return regex.test(inputString);
}

export const copyUtil = (value: string) => {
  navigator.clipboard.writeText(value);
  showSuccess(LABEL.COPIED);
};
