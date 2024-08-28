import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { DashboardLayout } from "../../components/painel-layout";
import { NovoCoroinha } from "../../components/coroinhas/cadastro-coroinha";
import Link from "next/link";

const Page = () => (
  <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Link href="/coroinhas">
          <Button color="success" variant="contained">
            Voltar
          </Button>
        </Link>
        <Typography sx={{ mb: 3, textAlign: "center" }} variant="h4">
          Novo coroinha
        </Typography>
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item lg={20} md={6} xs={12}>
            <NovoCoroinha />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
