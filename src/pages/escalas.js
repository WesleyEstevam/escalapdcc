import { Box, Container } from "@mui/material";
import { DashboardLayout } from "../components/painel-layout";
import { Escalas } from "../components/escalas/listagem-escalas";
import { HeaderEscalas } from "../components/escalas/header-escalas";

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
        <HeaderEscalas />
        <Box>
          <Escalas />
        </Box>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
