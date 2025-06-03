import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState } from "react";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { orderApi } from "apis/order";
import { BUTTON } from "constants/button";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
// import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";
import { TSheetType } from "types/Sheet";
import { TStyles } from "types/Styles";
import { showError } from "utils/toast";

import successSound from "assets/sounds/successSFX.mp3";
import errorSound from "assets/sounds/errorSFX.mp3";
import TableResultSheetScanned from "./TableResultSheetScanned";
import useSound from "hooks/useSound";
import { WAREHOUSE_LABEL } from "constants/warehouse/label";
interface Props {
  open: boolean;
  type: TSheetType;
}
interface ScanListType {
  order_key: string;
  is_confirm: boolean;
  message: string;
}

let html5QrCode: Html5Qrcode | undefined;

let qrboxFunction = function (viewfinderWidth: number, viewfinderHeight: number) {
  let minEdgePercentage = 0.5; // 70%
  let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
  let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
  return {
    width: qrboxSize,
    height: qrboxSize,
  };
};

const brConfig = {
  fps: 10,
  qrbox: qrboxFunction,
  aspectRatio: 1,
  disableFlip: true,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true,
  },
  formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
  verbose: true,
};

const validateCode = (code: string) => {
  //check mã đơn phải bắt đầu:  #OD và có độ dài lớn hơn 6
  //EX: #OD000014
  return code && code[0] === "#" && code.length > 6 && /^OD\d+$/.test(code.slice(1));
};

function ScanOption(props: Props) {
  const { open, type } = props;
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [scannedList, setScannedList] = useState<ScanListType[]>([]);
  const [waitingScan, setWaitingScan] = useState(false);
  const [sequenceCode, setSequenceCode] = useState<string>("");
  const [playbackRate] = useState(0.9);

  const playSuccess = useSound(successSound, { volume: 0.9, playbackRate: playbackRate });

  const playError = useSound(errorSound, { volume: 0.9, playbackRate: playbackRate });

  useEffect(() => {
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode(`reader`, brConfig);
    }
    return () => {
      handleStop();
    };
  }, [open]);

  useEffect(() => {
    if (validateCode(code) && sequenceCode) handleConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, sequenceCode]);

  const handleHtml5QrCode = () => {
    const qrCodeSuccessCallback = (decodedText: string) => {
      validateCode(decodedText) && setCode(decodedText);
    };

    const qrCodeErrorCallback = () => {};

    html5QrCode?.start(
      { facingMode: "environment" },
      brConfig,
      qrCodeSuccessCallback,
      qrCodeErrorCallback,
    );
  };
  const handleStartScan = async () => {
    setWaitingScan(true);
    const resultApi = await orderApi.get({
      endpoint: "confirm/logs/turn",
    });

    if (resultApi.data) {
      const { turn } = resultApi.data as any;
      setSequenceCode(turn);
    } else {
      showError(RESPONSE_MESSAGES.ERROR);
    }

    handleHtml5QrCode();
    setWaitingScan(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    let newList = JSON.parse(JSON.stringify(scannedList));
    const resultApi = await orderApi.create<{ id: string; name: string }>({
      params: { order_key: code, sheet_type: type, turn: sequenceCode },
      endpoint: "sheets/confirm/",
    });

    if (resultApi?.data) {
      playSuccess.play();
      newList = [
        ...newList,
        {
          order_key: code,
          is_confirm: true,
          message: RESPONSE_MESSAGES.SCAN_SUCCESS,
        },
      ];
    } else {
      const { error } = (resultApi || {}) as any;
      playError.play();
      newList = [
        ...newList,
        {
          order_key: code,
          is_confirm: false,
          message: error?.data?.length ? error?.data[0] : RESPONSE_MESSAGES.ERROR_TRY_AGAIN,
        },
      ];
    }

    setScannedList(newList);
    setLoading(false);
  };

  const handleStop = () => {
    try {
      html5QrCode
        ?.stop()
        .then(() => {
          html5QrCode?.clear();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DialogContent sx={styles.dialogContent}>
      {loading && <LinearProgress />}
      {!sequenceCode && (
        <Box sx={styles.overlay}>
          {waitingScan ? (
            <LinearProgress color="primary" sx={{ width: "100%" }} />
          ) : (
            <Stack>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                size="large"
                onClick={handleStartScan}
                sx={{ mt: 30 }}
              >
                {BUTTON.START_SCAN_CODE}
              </Button>
            </Stack>
          )}
        </Box>
      )}

      {loading ? (
        <LinearProgress />
      ) : (
        <TextField
          value={code}
          inputRef={(input) => input?.focus()}
          onChange={(e) => {
            const { value } = e.target;
            const arr = value.split("#");
            setCode(arr?.[arr.length - 1] ? `#${arr?.[arr.length - 1]}` : "");
          }}
          style={styles.codeInput}
          placeholder={WAREHOUSE_LABEL.enter_order_key}
          autoFocus
          fullWidth
          variant="standard"
        />
      )}

      <Stack>
        <Box
          id={`reader`}
          sx={{
            "& video": {
              width: "100%!important",
              height: "100%",
              overflow: "hidden",
            },
          }}
        />
      </Stack>

      <Box sx={styles.wrapList}>{<TableResultSheetScanned sheets={scannedList} />}</Box>
    </DialogContent>
  );
}

export default ScanOption;

const styles: TStyles<
  | "button"
  | "table"
  | "code"
  | "message"
  | "icon"
  | "wrapList"
  | "codeInput"
  | "dialogContent"
  | "overlay"
> = {
  button: {
    borderRadius: 8,
    width: "50%",
    fontSize: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  code: {
    color: "success.main",
    fontSize: "2rem",
    fontWeight: 700,
  },
  message: {
    fontSize: "1rem",
    fontWeight: 600,
    paddingBottom: 3,
    textAlign: "center",
  },
  icon: {
    fontSize: "5rem",
  },
  wrapList: {
    height: "500px",
    overflowY: "auto",
  },
  codeInput: {
    padding: "1rem",
  },
  dialogContent: {
    padding: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    minWidth: 320,
    paddingTop: 4,
    position: "relative",
  },
  overlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
  },
};
