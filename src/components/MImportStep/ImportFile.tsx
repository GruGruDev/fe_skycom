import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import { ImportFileProps, MImportFileButton } from "components/Buttons";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { TSx } from "types/Styles";

export interface ImportProps {
  dataExcel: [string][];
  file?: File;
  /** disable submit step */
  /** import file và đọc dữ liệu trong file */
  isSubmitted: boolean;
  /** xác nhận dữ liệu từ file */
  submitDataExcel: () => void;
  importExcel?: ImportFileProps;
}
export const ImportFile = ({
  dataExcel,
  isSubmitted,
  submitDataExcel,
  importExcel,
  file,
}: ImportProps) => {
  return (
    <>
      <Grid item xs={12} lg={4} sx={styled.grid}>
        <MImportFileButton {...importExcel} />
        <FormHelperText
          style={{
            display: dataExcel.length <= 0 && isSubmitted ? "inline-block" : "none",
          }}
          error={dataExcel.length <= 0 && isSubmitted}
        >
          {VALIDATION_MESSAGE.SELECT_FILE_PLEASE}
        </FormHelperText>
      </Grid>
      {dataExcel.length > 0 || file ? (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={submitDataExcel} sx={{ mt: 1, mr: 1 }}>
            {LABEL.CONTINUE}
          </Button>
        </Box>
      ) : null}
    </>
  );
};

const styled: TSx<"grid"> = {
  grid: {
    padding: "10px 0px",
    div: {
      margin: "0px",
    },
  },
};
