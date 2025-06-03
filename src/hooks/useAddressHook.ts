import { useCallback, useEffect, useState } from "react";
import { addressServices } from "services/address";
import { TDistrict, TProvince, TWard } from "types/Address";
import { TSelectOption } from "types/SelectOption";
import map from "lodash/map";

const useAddressHook = () => {
  const [locationResource, setLocationResource] = useState<{
    provinces: TProvince[];
    districts: TDistrict[];
    wards: TWard[];
  }>({
    provinces: [],
    districts: [],
    wards: [],
  });

  const [localtionOptions, setLocaltionOptions] = useState<{
    provinceOptions: TSelectOption[];
    districtOptions: TSelectOption[];
    wardOptions: TSelectOption[];
  }>({ provinceOptions: [], districtOptions: [], wardOptions: [] });

  const getWards = useCallback(async (districtId?: string) => {
    if (districtId) {
      const wards = await addressServices.getWard(districtId);
      setLocationResource((prev) => ({ ...prev, wards }));

      const wardOptions: TSelectOption[] = map(wards, (item) => ({
        value: item.code,
        label: item.label,
      }));
      setLocaltionOptions((prev) => ({ ...prev, wardOptions }));
    }
  }, []);

  const getDistricts = useCallback(async (provinceId?: string) => {
    if (provinceId) {
      const districts = await addressServices.getDistrict(provinceId);
      setLocationResource((prev) => ({ ...prev, districts, wards: [] }));

      const districtOptions: TSelectOption[] = map(districts, (item) => ({
        value: item.code,
        label: item.label,
      }));
      setLocaltionOptions((prev) => ({ ...prev, districtOptions, wardOptions: [] }));
    }
  }, []);

  const getProvinces = useCallback(async () => {
    const provinces = await addressServices.getProvince();
    setLocationResource((prev) => ({ ...prev, provinces, districts: [], wards: [] }));

    const provinceOptions: TSelectOption[] = map(provinces, (item) => ({
      value: item.code,
      label: item.label,
    }));
    setLocaltionOptions((prev) => ({
      ...prev,
      provinceOptions,
      districtOptions: [],
      wardOptions: [],
    }));
  }, []);

  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  return { ...locationResource, ...localtionOptions, getWards, getDistricts, setLocationResource };
};

export default useAddressHook;
