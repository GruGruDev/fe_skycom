import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { LABEL } from "constants/label";
import { useNavigate } from "react-router-dom";

type Props = {
  linkLabel?: string;
  link?: string;
  onNavigate?: () => void;
};

const HeaderPage = (props: Props) => {
  const { link = "", linkLabel = LABEL.RETURN_LIST, onNavigate } = props;
  const navigate = useNavigate();

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      mt={1}
      style={styles.stack}
      color="primary.dark"
      onClick={() => {
        navigate(link);
        onNavigate?.();
      }}
    >
      <KeyboardDoubleArrowLeftIcon style={styles.icon} />
      <Typography fontSize="0.82rem">{linkLabel}</Typography>
    </Stack>
  );
};

export default HeaderPage;

const styles = {
  stack: { cursor: "pointer" },
  icon: { fontSize: "1.3rem" },
};
