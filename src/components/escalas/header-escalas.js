import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export const HeaderEscalas = () => (
  <Box>
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginBottom: 5,
      }}
    >
      <Typography sx={{ m: 1 }} variant="h4">
        Escalas
      </Typography>
      <Box sx={{ m: 1, display: "flex" }}>
        <Link href="/cadastros/nova-escala" color="primary">
          <Button color="primary" variant="contained">
            Nova Escala
          </Button>
        </Link>
      </Box>
    </Box>
  </Box>
);
