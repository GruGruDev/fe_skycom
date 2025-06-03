import Stack from "@mui/material/Stack";
import defaultImage from "assets/images/logo.jpeg";
import { PreviewImage, PreviewImageProps } from "components/Images";
import isString from "lodash/isString";
import { TImage } from "types/Media";
import { TStyles } from "types/Styles";

type HandleImageProps = {
  onlyOne?: boolean;
  value?: Partial<TImage>[] | Partial<TImage> | string[];
} & PreviewImageProps;

const HandlerImage = ({
  value,
  onlyOne = true,
  width = 42,
  height = 42,
  preview = true,
  ...props
}: HandleImageProps) => {
  if (!value) {
    return (
      <PreviewImage
        width={width}
        height={height}
        preview={preview}
        {...props}
        src={defaultImage}
        style={styles.image}
      />
    );
  }
  if (!Array.isArray(value)) {
    const image = value;

    if (isString(image)) {
      return (
        <Stack spacing={0.5}>
          <PreviewImage
            width={width}
            height={height}
            preview={preview}
            {...props}
            src={image}
            key={image}
          />
        </Stack>
      );
    }

    return (
      <Stack spacing={0.5}>
        <PreviewImage
          width={width}
          height={height}
          preview={preview}
          {...props}
          src={image.image}
          key={image.id}
        />
      </Stack>
    );
  }
  if (onlyOne) {
    if (isString(value[0])) {
      return (
        <Stack spacing={0.5}>
          <PreviewImage width={width} height={height} preview={preview} {...props} src={value[0]} />
        </Stack>
      );
    }
    // tìm ảnh default
    const image = (value as TImage[])?.find((item) => item.is_default) || value?.[0];

    return (
      <Stack spacing={0.5}>
        <PreviewImage
          width={width}
          height={height}
          preview={preview}
          {...props}
          src={(image as TImage)?.image}
          key={(image as TImage)?.id}
        />
      </Stack>
    );
  }
  return (
    <Stack spacing={0.5}>
      {value.map((item, index) => {
        if (isString(item)) {
          return <PreviewImage {...props} src={item} key={index} />;
        }
        return <PreviewImage {...props} src={item.image} key={item.id} />;
      })}
    </Stack>
  );
};

export default HandlerImage;

const styles: TStyles<"image"> = {
  image: { margin: "4px", boxShadow: "none", opacity: 0.6 },
};
