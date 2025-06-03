import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { NumberInputField } from "components/Fields";
import { MultiSelect, ValueSelectorType } from "components/Selectors";
import { Span } from "components/Texts";
import { PRODUCT_LABEL } from "constants/product/label";
import { useCancelToken } from "hooks/useCancelToken";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { productServices } from "services/product";
import { TAttribute } from "types/Attribute";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { TProductMaterial } from "types/Product";
import { TSelectOption } from "types/SelectOption";
import sumBy from "lodash/sumBy";
import uniqBy from "lodash/uniqBy";
import { forOf } from "utils/forOf";
import { fFloatToString, formatFloatToString } from "utils/number";

type Props = {
  params?: TParams;
  setParams?: (params: TParams) => void;
  methods: UseFormReturn<any, object>;
};

const ListMaterial = (props: Props) => {
  const { materials = [] } = props.methods.watch();
  const { newCancelToken } = useCancelToken();

  const [expanded, setExpanded] = useState(false);
  const [params, setParams] = useState<TParams>({ ...props.params, limit: 30, page: 1 });

  const [data, setData] = useState<TDGridData<Partial<TProductMaterial>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    if (expanded) {
      setData((prev) => ({ ...prev, loading: true }));

      const res = await productServices.getListMaterial({
        ...params,
        limit: 30,
        page: 1,
        cancelToken: newCancelToken(),
      });
      if (res) {
        const { results, count = 0 } = res;
        setData((prev) => ({
          ...prev,
          data: uniqBy([...materials, ...results, ...prev.data], "id"),
          count,
          loading: false,
        }));
        return;
      }
      setData((prev) => ({ ...prev, loading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, newCancelToken, params, materials.toString()]);

  const handleLoadMoreMaterial = useCallback(async () => {
    if (expanded && !data.loading && (params.page as number) > 1) {
      const res = await productServices.getListMaterial({
        ...params,
        cancelToken: newCancelToken(),
      });
      if (res) {
        const { results, count = 0 } = res;
        setData((prev) => ({ ...prev, data: [...prev.data, ...results], count, loading: false }));
        return;
      }
    }
  }, [newCancelToken, params, data.loading, expanded]);

  const handleChangeMaterials = (values: ValueSelectorType) => {
    const dataClone = [...data.data];
    let materialSelected: TAttribute[] = [];

    forOf(values as string[], (item) => {
      const materialIndex = data.data.findIndex((att: TAttribute) => att.id === item);
      materialSelected = [...materialSelected, data.data[materialIndex]];
      dataClone[materialIndex] = { ...dataClone[materialIndex], selected: true };
    });
    // const newMaterials = reduce(
    //   values as string[],
    //   (prev: TVariantDetail["materials"] = [], cur) => {
    //     const material = materials.find((item: TAttribute) => item.id === cur);
    //     if (material) {
    //       prev = [...prev, material];
    //     } else {
    //       const material = data.data.find((item: TAttribute) => item.id === cur);
    //       if (material) {
    //         prev = [...prev, { ...material, quantity: 1 }];
    //       }
    //     }
    //     return prev;
    //   },
    //   [],
    // );
    setData((prev) => ({ ...prev, data: dataClone }));
    props.methods.setValue("materials", materialSelected, { shouldDirty: true });
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    handleLoadMoreMaterial();
  }, [handleLoadMoreMaterial]);

  const materialOptions = useMemo(() => {
    return reduce(
      data.data,
      (prev: TSelectOption[], cur) => {
        return [...prev, { label: cur.name || "", value: cur.id || "", selected: cur.selected }];
      },
      [],
    );
  }, [data.data]);

  const materialIds = useMemo(() => {
    return reduce(
      materials,
      (prev: string[], cur) => {
        return [...prev, cur?.id];
      },
      [],
    );
  }, [materials]);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded((prev) => !prev)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Button variant="contained">{PRODUCT_LABEL.add_material}</Button>
          <Span>{`${materials.length} ${PRODUCT_LABEL.material}`}</Span>
          <Span>{`${PRODUCT_LABEL.total_weight} ${fFloatToString(
            sumBy(materials, (item: Partial<TProductMaterial>) =>
              formatFloatToString(item?.weight || 0),
            ),
            4,
          )}`}</Span>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <MultiSelect
          options={materialOptions}
          onChange={handleChangeMaterials}
          value={materialIds}
          loadMoreData={
            data.count > (params.limit as number) * (params.page as number)
              ? () => setParams((prev) => ({ ...prev, page: (prev.page as number) + 1 }))
              : undefined
          }
          handleGetOptions={(input) => {
            setParams((prev) => ({ ...prev, page: 1, search: input }));
          }}
          selectorId={`list-material`}
          outlined
          fullWidth
          shrink
          title={PRODUCT_LABEL.list_material}
          isShowLoading={data.loading}
        />
      </AccordionDetails>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {materials.map((item: Partial<TProductMaterial>, index: number) => {
          return item ? (
            <>
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.name}
                  secondary={item.SKU_code}
                  sx={{
                    span: { fontSize: "0.825rem" },
                    p: { fontSize: "0.7rem !important" },
                    width: "100%",
                  }}
                />
                <NumberInputField
                  onChangeFloat={(value) =>
                    props.methods.setValue(
                      `materials.${index}`,
                      { id: item.id, weight: value, name: item.name, SKU_code: item.SKU_code },
                      { shouldDirty: true },
                    )
                  }
                  value={item.weight}
                  size="small"
                  minQuantity={1}
                  sx={{ width: 150 }}
                  fixedDigits={4}
                />
              </ListItem>
              <Divider component="li" />
            </>
          ) : null;
        })}
      </List>
    </Accordion>
  );
};

export default ListMaterial;
