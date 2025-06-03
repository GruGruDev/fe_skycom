import { customerApi } from "apis/customer";
import { CustomerDTO } from "types/Customer";
import { addressServices } from "./address";

const handleAddCustomer = async (form: CustomerDTO) => {
  const { name, address, phone, birthday, customer_care_staff, gender } = form;

  // API create require 1 sdt => lấy sđt đầu để thêm
  const res = await customerApi.create({
    endpoint: "",
    params: { name, phone: phone, birthday, customer_care_staff, gender },
  });
  if (res?.data?.id) {
    if (address?.ward?.ward_id) {
      await addressServices.handleCreateLocation({
        ward: address?.ward,
        is_default: true,
        address: address?.address,
        customer: res.data.id,
        type: "CT",
      });

      return res.data;
    }
    return res.data;
  } else {
    return;
  }
};

const handleUpdateCustomer = async (form: CustomerDTO) => {
  const { name, address, birthday, customer_care_staff, gender } = form;
  const res = await customerApi.update({
    endpoint: `${form?.id}/`,
    params: { name, birthday, customer_care_staff, gender },
  });
  if (res?.data?.id) {
    // address từ form có ID và khác "new" thì update, không thì create
    if (address?.id && address?.id !== "new") {
      await addressServices.handleUpdateLocation({
        ward: address?.ward,
        is_default: true,
        address: address?.address,
        customer: res.data.id,
        id: address?.id,
        type: "CT",
      });
    } else {
      if (address?.ward?.ward_id) {
        await addressServices.handleCreateLocation({
          ward: address?.ward,
          is_default: true,
          address: address?.address,
          customer: res.data.id,
          type: "CT",
        });
      }
    }
    return res.data;
  } else {
    return;
  }
};

export const customerSerives = { handleAddCustomer, handleUpdateCustomer };
