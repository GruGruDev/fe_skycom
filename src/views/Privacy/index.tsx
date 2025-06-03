import { Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { PageWithTitle } from "components/Page";
import darkLogo from "assets/images/logo.png";
import lightLogo from "assets/images/logo.png";
import { useTheme } from "@mui/material/styles";
import { privacy1, privacy2 } from "./assets";
import { TStyles } from "types/Styles";
import { LABEL } from "constants/label";

const Privacy = () => {
  const theme = useTheme();
  return (
    <PageWithTitle title={LABEL.PRIVACY} style={styles.page}>
      <img
        src={theme.palette.mode === "light" ? lightLogo : darkLogo}
        height={86}
        style={styles.img}
      />
      <Grid container px={{ xs: 2, sm: 4, md: 8, lg: 16, xl: 24 }} py={2}>
        <Typography component="h2" style={styles.title}>
          CHÍNH SÁCH
        </Typography>
        <TitleTermLabel>{`BẢO MẬT THÔNG TIN`}</TitleTermLabel>
        <TermLabel>{privacy1}</TermLabel>
        <TermLabel>{privacy2}</TermLabel>
        <Link href="/" style={styles.link}>{`<<< Quay lại trang chủ`}</Link>
      </Grid>
    </PageWithTitle>
  );
};

export default Privacy;

const TermLabel = styled(Typography)(() => ({
  textAlign: "justify",
  marginTop: 16,
  textIndent: 32,
}));

const TitleTermLabel = styled(Typography)(() => ({
  width: "100%",
  marginTop: 18,
  fontWeight: "bold",
}));

const styles: TStyles<"page" | "title" | "link" | "img"> = {
  page: { padding: 12, display: "flex", flexDirection: "column", alignItems: "center" },
  title: { fontSize: "1.6rem", fontWeight: "bold", marginBottom: 12 },
  link: { marginTop: 12 },
  img: { marginTop: 12, marginBottom: 12 },
};
