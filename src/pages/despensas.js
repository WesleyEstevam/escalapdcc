import { Box, Container } from "@mui/material";
import { DashboardLayout } from "../components/painel-layout";
import { Despensas } from "../components/despensas/header";

const Page = () => (
  <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Despensas />
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
