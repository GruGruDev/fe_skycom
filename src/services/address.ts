import { addressApi } from "apis/address";
import { TAddress, TDistrict, TProvince, TWard } from "types/Address";

const getProvince = async () => {
  const result = await addressApi.get<TProvince>({
    params: { limit: 100, page: 1 },
    endpoint: "provinces/",
  });

  if (result?.data) {
    const { results = [] } = result.data;
    return results;
  }
  return [];
};

const getDistrict = async (province_id: string) => {
  const result = await addressApi.get<TDistrict>({
    endpoint: "districts/",
    params: { province_id, limit: 100, page: 1 },
  });
  if (result?.data) {
    const { results = [] } = result.data;
    return results;
  }
  return [];
};
const getWard = async (district_id: string) => {
  const result = await addressApi.get<TWard>({
    endpoint: "wards/",
    params: { district_id, limit: 100, page: 1 },
  });
  if (result?.data) {
    const { results = [] } = result.data;
    return results;
  }
  return [];
};

const handleCreateLocation = async (address: TAddress) => {
  if (address.ward) {
    const res = await addressApi.create<TAddress>({
      params: { ...address, ward: address.ward?.ward_id },
      endpoint: "addresses/",
    });

    if (res.data) {
      return res.data;
    } else {
      return;
    }
  }
};

const handleUpdateLocation = async (address: TAddress) => {
  const res = await addressApi.update<TAddress>({
    params: {
      ...address,
      ward: address.ward?.ward_id,
    },
    endpoint: `addresses/${address.id}/`,
  });

  if (res.data) {
    return res.data;
  } else {
    return;
  }
};

const handleDeleteLocation = async (id: string) => {
  const res = await addressApi.remove<TAddress>({
    endpoint: `addresses/${id}/`,
  });

  return res;
};

export const addressServices = {
  getProvince,
  getDistrict,
  getWard,
  handleCreateLocation,
  handleUpdateLocation,
  handleDeleteLocation,
};
