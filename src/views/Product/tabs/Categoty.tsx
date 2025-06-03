import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LinearProgress, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { productApi } from "apis/product";
import { SearchField } from "components/Fields";
import { NoDataPanel } from "components/NoDataPanel";
import { MultiSelect, ValueSelectorType } from "components/Selectors";
import { ALL_OPTION } from "constants/index";
import { PRODUCT_LABEL } from "constants/product/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import filter from "lodash/filter";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TParams } from "types/Param";
import { TProduct } from "types/Product";
import { TSelectOption } from "types/SelectOption";
import { fDate } from "utils/date";
import { searchAlgorithm } from "utils/strings";
import { Span } from "components/Texts";
import { useNavigate } from "react-router-dom";

const paramDetault = {
  limit: 100,
  page: 1,
  count: 0,
};

interface CategoryWithProduct extends TSelectOption {
  products?: TProduct[];
}

const Category = () => {
  const {
    attributes: { category, supplier },
  } = useAppSelector(getDraftSafeSelector("product"));

  const [data, setData] = useState<CategoryWithProduct[]>([]);
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<TParams>();

  const categoryOptions = useMemo(
    () =>
      reduce(
        category,
        (prev: TSelectOption[], cur) => [
          ...prev,
          { ...cur, label: cur.name || "", value: cur.id?.toString() || "", ...paramDetault },
        ],
        [],
      ),
    [category],
  );
  const supplierOptions = useMemo(
    () =>
      reduce(
        supplier,
        (prev: TSelectOption[], cur) => [
          ...prev,
          { ...cur, label: cur.name || "", value: cur.id?.toString() || "", ...paramDetault },
        ],
        [],
      ),
    [supplier],
  );

  const onFilterDataByCategory = (value: ValueSelectorType) => {
    setParams((prev) => ({ ...prev, category: value === "all" ? undefined : value }));
  };

  const onSetData = useCallback(
    (categoryId: string | number, value: Partial<CategoryWithProduct>) => {
      setData((prev) => {
        const rowIndex = prev.findIndex((item) => item.value === categoryId);
        const dataClone = [...prev];
        dataClone[rowIndex] = { ...dataClone[rowIndex], ...value };
        return dataClone;
      });
    },
    [],
  );

  useEffect(() => {
    setData(categoryOptions);
  }, [categoryOptions]);

  const dataSearching = useMemo(() => {
    let dataClone = [...data];
    // searching
    if (search) {
      dataClone = filter(dataClone, (item) => searchAlgorithm(item.label, search));
    }
    // category param
    if (params?.category) {
      dataClone = dataClone.filter((item) =>
        (params.category as string[]).includes(item.value.toString()),
      );
    }
    return dataClone;
  }, [data, search, params]);

  return (
    <Box pb={[5, 4, 3, 2, 1]}>
      <Header
        categoryOptions={categoryOptions}
        onFilterCategory={onFilterDataByCategory}
        onSearch={setSearch}
      />
      <Grid container spacing={1}>
        {dataSearching.map((item) => (
          <Grid item xs={12} lg={6} key={item.value}>
            <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Typography>
                    {`${item.label} `}
                    <Span color="success">{`${item.total_products || item.count || 0} ${
                      PRODUCT_LABEL.product
                    }`}</Span>
                  </Typography>
                  <Span color={"secondary"}>{`${item.total_inventory || 0} ${
                    PRODUCT_LABEL.total_inventory
                  }`}</Span>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <ProductTable
                  categoryItem={item}
                  setCategory={onSetData}
                  supplierOptions={supplierOptions}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Category;

// ------------ HEADER
const Header = ({
  categoryOptions,
  onFilterCategory,
  onSearch,
}: {
  categoryOptions: TSelectOption[];
  onFilterCategory: (value: ValueSelectorType) => void;
  onSearch: (value: string) => void;
}) => {
  return (
    <Grid container py={2} spacing={1}>
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
        <SearchField onSearch={onSearch} fullWidth />
      </Grid>
      <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
        <MultiSelect
          options={[ALL_OPTION, ...categoryOptions]}
          onChange={onFilterCategory}
          outlined
          title={PRODUCT_LABEL.category}
        />
      </Grid>
    </Grid>
  );
};
// ------------- ProductTable
const ProductTable = ({
  categoryItem,
  setCategory,
  supplierOptions,
}: {
  supplierOptions: TSelectOption[];
  categoryItem: CategoryWithProduct;
  setCategory: (id: string | number, value: Partial<CategoryWithProduct>) => void;
}) => {
  const navigate = useNavigate();

  const { value, products, loading, limit, page, count = 0 } = categoryItem;
  const isDataAvailable = !!products?.length;

  const getData = useCallback(
    async (params?: TParams) => {
      setCategory(value, { ...params, loading: true });
      const res = await productApi.get<TProduct>({
        params: { category: [value], limit, page, ...params },
      });
      if (res.data) {
        const { results = [], count = 0 } = res.data;
        setCategory(value, { products: results, loading: false, count });
        return;
      }
      setCategory(value, { loading: false });
    },
    [value, setCategory, limit, page],
  );

  useEffect(() => {
    if (!isDataAvailable) {
      getData();
    }
  }, [getData, isDataAvailable]);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 440, td: { fontSize: "0.825rem" } }}>
        {loading && <LinearProgress />}
        <Table sx={{ minWidth: 450 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">{PRODUCT_LABEL.name}</TableCell>
              <TableCell align="left">{PRODUCT_LABEL.is_active}</TableCell>
              <TableCell align="left">{PRODUCT_LABEL.supplier}</TableCell>
              <TableCell align="left">{PRODUCT_LABEL.created}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.length ? (
              map(products, (row) => {
                const supplier = supplierOptions.find((item) => item.value === row.supplier);
                return (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">
                      {/* <ListVariantDrawer product={row} /> */}
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/product/list/simple-variant?product=${row.id}`)}
                      >
                        {row.name}
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      {row.is_active ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell align="left">{supplier?.label}</TableCell>
                    <TableCell align="left">{fDate(row.created)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center" colSpan={4} sx={{ position: "static" }}>
                  <NoDataPanel showImage />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 50, 100, 500, 1000]}
        component="div"
        count={count}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={(_, value) => getData({ page: value + 1 })}
        onRowsPerPageChange={(value) => getData({ limit: parseInt(value.target.value) })}
        labelRowsPerPage=""
      />
    </Box>
  );
};
