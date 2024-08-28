import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { useRouter } from "next/router";

export function Login() {
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.error("Problema ao realizar a autenticação:", error);
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexGrow: 1,
          backgroundColor: "#FFFAFA",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <img
            src="static/imgSaoTarcisio.jpg"
            style={{
              margin: "10px",
              width: "200px",
              borderRadius: "10px",
            }}
          />
          <Typography
            variant="h5"
            style={{
              fontFamily: "Poppins",
              fontSize: "5vh",
              fontWeight: "300",
              textAlign: "center",
              fontStyle: "medium",
            }}
          >
            Pastoral dos Coroinhas e
          </Typography>
          <Typography
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              fontSize: "5vh",
              fontFamily: "Poppins",
              fontStyle: "thin",
              fontWeight: "50",
            }}
          >
            CERIMONIÁRIOS
          </Typography>
          <Divider
            sx={{
              display: "flex",
              marginLeft: "auto",
              backgroundColor: "orange",
              width: "100px",
              height: "7px",
            }}
          />
          <Box
            sx={{
              my: "10%",
              borderRadius: "15px",
              p: "20px",
            }}
          >
            <Box sx={{ py: 2 }}>
              <Button
                color="error"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleSubmit}
              >
                Entrar
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Login;
