import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import Stack from "@mui/material/Stack";
import { WIDTH_DEVICE } from "constants/index";
import { useState } from "react";
import { PreviewImage } from "../../../components/Images";
import { TImage } from "types/Media";
import { TStyles } from "types/Styles";

interface Props {
  images?: Partial<TImage[]>;
}

export function ImageCarousel(props: Props) {
  const { images = [] } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndexs = images.length;

  const handleNext = () => {
    setActiveIndex((prevActiveIndex) => prevActiveIndex + 1);
  };

  const handleBack = () => {
    setActiveIndex((prevActiveIndex) => prevActiveIndex - 1);
  };

  return (
    <Stack flexDirection="column" justifyContent="space-between" alignItems="center">
      <PreviewImage
        width="100%"
        height="100%"
        style={{
          ...styles.image,
          height: WIDTH_DEVICE < 1200 ? "325px" : "200px",
        }}
        wrapImgSx={{ alignItems: "center" }}
        src={images?.[activeIndex]?.image}
      />
      {maxIndexs > 0 && (
        <MobileStepper
          variant="text"
          steps={maxIndexs}
          position="static"
          activeStep={activeIndex}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeIndex === maxIndexs - 1}>
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeIndex === 0}>
              <KeyboardArrowLeft />
            </Button>
          }
        />
      )}
    </Stack>
  );
}

const styles: TStyles<"image"> = {
  image: { objectFit: "contain", borderRadius: "8px", alignItems: "center" },
};
