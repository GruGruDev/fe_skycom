import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { MExpandMoreIconButton } from "components/Buttons";
import { LABEL } from "constants/label";
import { useState } from "react";
import { TStyles } from "types/Styles";

export interface WrapFilterChipProps {
  children?: React.ReactNode | JSX.Element;
  keysFilter?: string[];
  style?: React.CSSProperties;
  onClearAll: (keysFilter: string[]) => void;
}

export const WrapFilterChip = ({
  children,
  keysFilter = [],
  onClearAll,
  style = {},
}: WrapFilterChipProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return keysFilter?.length > 0 ? (
    <>
      <Stack direction="row" style={{ ...styles.stack, ...containerStyle, ...style }}>
        <Button
          variant="outlined"
          size="small"
          style={buttonStyle}
          onClick={() => onClearAll(keysFilter)}
        >
          {LABEL.CLEAR_FILTER}
        </Button>
        <Tooltip title={expanded ? LABEL.HIDDEN_FILTER : LABEL.SHOW_FILTER}>
          <MExpandMoreIconButton
            sx={{
              height: 30,
              width: 30,
              border: "1px solid",
              mt: 1,
              borderColor: "primary.main",
            }}
            expand={`${expanded}`}
            onClick={handleExpandClick}
            aria-expanded={expanded}
          />
        </Tooltip>
      </Stack>
      <Stack direction="row" style={{ ...styles.stack, ...containerStyle, ...style }}>
        <Collapse in={expanded} timeout="auto" collapsedSize={54} style={containerStyle}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              py: 0.5,
            }}
          >
            {children}
          </Box>
        </Collapse>
      </Stack>
    </>
  ) : null;
};

const containerStyle = { width: "100%" };
const buttonStyle = { marginTop: 8, marginRight: 8 };

const styles: TStyles<"stack"> = {
  stack: { marginRight: 4 },
};
