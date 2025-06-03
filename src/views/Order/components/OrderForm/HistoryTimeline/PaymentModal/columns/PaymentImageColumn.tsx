import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { fileApi } from "apis/file";
import { orderApi } from "apis/order";
import { MImportFileButton } from "components/Buttons";
import HandlerImage from "components/Images/HandlerImage";
import { useState } from "react";
import { IMAGE_TYPE, TImage } from "types/Media";

const COLUMN_NAMES = ["images"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onRefresh: () => void;
}

export const PaymentImageColumn = ({ for: columnNames = [], onRefresh, ...props }: Props) => {
  const Formatter = ({ value, row }: { value?: TImage[]; row?: any }) => {
    const [loading, setLoading] = useState(false);

    const handeUploadImage = async (acceptedFiles: File) => {
      setLoading(true);
      const result = await fileApi.uploadImage({
        endpoint: "images/",
        params: { image: acceptedFiles, type: IMAGE_TYPE.PM, payment: row.id },
      });

      if (result?.data) {
        const { data } = result;

        await handleUpdatePaymentImage(data.id);
        setLoading(false);
      }
    };

    const handleUpdatePaymentImage = async (imageId: string) => {
      const res = await orderApi.update({
        endpoint: `payments/${row.id}/`,
        params: { image_id: imageId },
      });

      if (res.data) {
        onRefresh();
      }
    };

    return value?.length ? (
      <Stack spacing={0.5}>
        {value?.map((item) => {
          return <HandlerImage value={item} key={item.id} preview height={48} width={48} onlyOne />;
        })}
      </Stack>
    ) : (
      <Stack>
        {loading && <LinearProgress sx={{ mb: 1 }} />}
        <MImportFileButton onGet={handeUploadImage} accept=".jpg.jpge,.png,.svg" />
      </Stack>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
