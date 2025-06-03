import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import omitBy from "lodash/omitBy";
import reduce from "lodash/reduce";
import { fDateTime } from "./date";

export const requiredRule = {
  isValid: (value: string | number) => value?.toString().trim().length > 0,
  errorText: () => LABEL.CLICK_TO_UPDATE,
};

export const phoneRule = {
  isValid: (phone: string) => !!phone,
  errorText: () => VALIDATION_MESSAGE.FORMAT_PHONE,
};

export const dateRule = {
  isValid: (value: string) => (fDateTime(value) ? true : false),
  errorText: () => VALIDATION_MESSAGE.REQUIRE_PAYMENT_DATE,
};

/**
 *
 * @author ngovanvien1010
 * @param changed là object chứa trường của cột đã thay đổi kèm theo index của row
 * @param validationStatus là trạng thái lỗi trước đó nếu có
 * @param validationRules  scope để check các trường
 * @var isValid kiểm tra giá trị thay đổi có match với validateRules không
 * @var rowStatus chứa các trường lỗi thuộc 1 dòng
 * @var acc là một trường trong các trường lỗi của @var rowStatus
 * @var field là tên trường thay đổi dữ liệu
 * @returns các trường lỗi của nhiều dòng trong bảng
 */

export const validate = (
  changed: {
    [key: string]: any;
  },
  validationStatus: {
    [key: string]: any;
  },
  validationRules: any,
) =>
  Object.keys(changed).reduce((status: { [key: string]: any }, id) => {
    let rowStatus = validationStatus[id] || {};
    if (changed[id]) {
      rowStatus = {
        ...rowStatus,
        ...Object.keys(changed[id]).reduce((acc, field) => {
          const isValid = validationRules[field]?.isValid(changed[id][field]);
          return isValid === false
            ? // nếu giá trị trường lỗi bị thay đổi thì tạo object message
              {
                ...acc,
                [field]: {
                  isValid: false,
                  error: validationRules[field]?.errorText(changed[id][field]),
                },
              }
            : // khi giá trị trường đúng
              { ...acc, [field]: undefined };
        }, {}),
      };
      // xoá bỏ các trường đúng
      rowStatus = omitBy(rowStatus, (item) => item === undefined);
    }

    if (Object.keys(rowStatus).length > 0) {
      // nếu có trường bị lỗi thì kế thừa từ lỗi trước đó và chèn tiếp vào
      return { ...validationStatus, ...status, [id]: rowStatus };
    } else {
      //nếu khong có trường nào bị lỗi của row thì xoá row đó ra khỏi validationStatus thông qua id
      delete status[id];
      delete validationStatus[id];
      return { ...validationStatus, ...status };
    }
  }, {});

export function getDifferentKeyValues<T>(
  obj1: { [key: string]: any } = {},
  obj2: { [key: string]: any } = {},
): Partial<T> {
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  const differentKeyValues: { [key: string]: any } = {};

  allKeys.forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      differentKeyValues[key] = obj2[key];
    }
  });

  return differentKeyValues as Partial<T>;
}

export const dirtyRHF = <T extends { [key: string]: any }>(
  form: T,
  dirtyFields: { [key: string]: any },
) => {
  return reduce(
    Object.keys(dirtyFields),
    (prev: any, cur: string) => {
      return { ...prev, [cur]: form?.[cur] };
    },
    {},
  );
};
