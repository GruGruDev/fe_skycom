import { SxProps, Theme, styled, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { TStyles } from "types/Styles";

export const TitleDrawer = styled(Typography)(() => ({
  fontWeight: 700,
  lineHeight: 1.55556,
  fontSize: "1rem",
}));

export const Section = styled(Paper)(() => ({
  padding: 16,
}));

export const TitleSection = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "0.82rem",
}));

export const TextInfo = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "0.82rem",
}));

export const LabelInfo = styled(Typography)(() => ({
  fontSize: "0.82rem",
  color: "#637381",
}));

export const SubLabelInfo = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: "0.82rem",
}));

export const TitleGroup = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "0.82rem",
}));

export const WrapperSection = ({
  title,
  children,
  containerSx,
  loading,
}: {
  title?: string;
  children: React.ReactNode | JSX.Element;
  containerSx?: SxProps<Theme>;
  loading?: boolean;
}) => {
  return (
    <Section elevation={3} sx={containerSx}>
      {title && (
        <>
          <TitleSection>{title}</TitleSection>
          <Divider style={styles.sectionDivider} />
        </>
      )}
      <Box py={2}>{loading ? <LinearProgress /> : children}</Box>
    </Section>
  );
};

export const BadgeLabel = ({
  children,
  number,
}: {
  children: string | React.ReactNode;
  number: number;
}) => {
  const theme = useTheme();

  return (
    <Box display={"flex"}>
      <Box> {children} </Box>
      {number > 0 && (
        <Box display={"flex"} alignItems="center">
          <Box
            bgcolor={theme.palette.secondary.main}
            color={theme.palette.text.primary}
            borderRadius={"50%"}
            ml={1}
            px={1}
            fontSize={"0.7rem"}
          >
            {number}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const FormControlLabelStyled = styled(FormControlLabel)(() => ({
  "& .MuiTypography-root.MuiFormControlLabel-label": {
    fontWeight: 600,
    fontSize: "0.82rem",
  },
}));

const styles: TStyles<"sectionDivider"> = {
  sectionDivider: { marginTop: 8, marginBottom: 8 },
};
