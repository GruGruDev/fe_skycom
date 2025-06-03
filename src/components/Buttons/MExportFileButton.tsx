import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";
import { userApi } from "apis/user";
import { ACTION_NAME } from "constants/activity";
import { LABEL } from "constants/label";
import useAuth from "hooks/useAuth";
import { ACTION_TYPE } from "types/Activity";
import { TStyles } from "types/Styles";
import { writeFile } from "utils/xlsxFile";

export type MExportFileProps = {
  data?: unknown[];
  fileName?: string;
  handleFormatData?: (item: { [key: string]: unknown }) => unknown;
};

export const MExportFileButton = ({ data = [], fileName, handleFormatData }: MExportFileProps) => {
  const { user } = useAuth();

  const exportFileLog = async () => {
    await userApi.create({
      endpoint: "action-log/",
      payload: {
        user: user?.id,
        action_name: ACTION_NAME.EXPORT_FILE,
        action_type: ACTION_TYPE.Export,
        message: fileName,
      },
      message: null,
    });
  };

  const handleEport = () => {
    writeFile({ defaultData: data, handleFormatData, fileName: fileName });
    exportFileLog();
  };
  return (
    <Button onClick={handleEport} variant="outlined">
      <ExitToAppIcon style={styles.icon} />
      {LABEL.EXPORT}
    </Button>
  );
};

const styles: TStyles<"icon"> = {
  icon: {
    fontSize: "1.6rem",
    marginRight: 4,
  },
};
