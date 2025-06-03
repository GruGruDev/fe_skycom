import React from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { TGridSize } from "types/GridLayout";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const AudioColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: string }) => {
    return <Mp3ControlDialog maxWidth="md" url={value} title={"Audio"} />;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default AudioColumn;

const wrapIconStyle = { borderRadius: 3, padding: 2 };
const iconStyle = { fontSize: 18 };

interface DialogProps {
  title?: string;
  maxWidth?: TGridSize;
  url?: string;
}

export const Mp3ControlDialog = ({ maxWidth, title, url }: DialogProps) => {
  const [play, setPlay] = React.useState<boolean>(false);

  return (
    <>
      {url && (
        <IconButton
          sx={{ backgroundColor: "warning.main", color: "text.primary" }}
          style={wrapIconStyle}
          onClick={() => setPlay(true)}
        >
          <PlayArrowIcon style={iconStyle} />
        </IconButton>
      )}
      <Dialog open={play} maxWidth={maxWidth} fullWidth onClose={() => setPlay(false)}>
        <DialogTitle>
          <div style={titleStyle}>
            {title && <Typography variant="h4"> {title} </Typography>}
            <CloseIcon style={closeIconStyle} onClick={() => setPlay(false)} />
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <audio controls style={audioStyle}>
            <source src={url} type="audio/mpeg" />
          </audio>
        </DialogContent>
      </Dialog>
    </>
  );
};

const titleStyle = { display: "flex", justifyContent: "space-between" };
const closeIconStyle = { fontSize: 25, color: "#595959", cursor: "pointer" };
const audioStyle = { width: "100%" };
