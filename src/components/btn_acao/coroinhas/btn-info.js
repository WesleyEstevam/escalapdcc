import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export const InfoCoroinha = () => {
  const [coroinha, setCoroinha] = useState(null);
  const router = useRouter();
  const data = router.query.data ? JSON.parse(router.query.data) : null;

  useEffect(() => {
    if (data) {
      const docRef = doc(db, "coroinhas", data);

      // Busca o documento e atualiza o estado
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setCoroinha(docSnap.data());
          } else {
            console.log("Nenhum documento encontrado com o ID fornecido");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar o documento: ", error);
        });
    }
  }, [data]);

  const handleChange = (event) => {
    // Supondo que você tenha um estado `values` configurado para isso
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <div
        style={{
          margin: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Coroinhas</h1>
        <Link href="/coroinhas">
          <Button
            startIcon={<ArrowBackIcon fontSize="small" />}
            variant="contained"
          >
            Voltar
          </Button>
        </Link>
      </div>
      <form autoComplete="off" noValidate>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <label>Nome do coroinha:</label>
                <TextField
                  fullWidth
                  name="nome_coroinha"
                  onChange={handleChange}
                  disabled
                  value={coroinha ? coroinha.nome_coroinha : ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <label>Altura:</label>
                <TextField
                  fullWidth
                  name="altura_coroinha" // Corrigido de "alura" para "altura_coroinha"
                  onChange={handleChange}
                  disabled
                  value={coroinha ? coroinha.altura_coroinha : ""}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <label>Sexo:</label>
                <TextField
                  fullWidth
                  name="sexo_coroinha" // Corrigido para corresponder ao nome do campo
                  onChange={handleChange}
                  disabled
                  value={coroinha ? coroinha.sexo_coroinha : ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <label>Tipo:</label>
                <TextField
                  fullWidth
                  name="tipo_coroinha"
                  onChange={handleChange}
                  disabled
                  value={coroinha ? coroinha.tipo_coroinha : ""}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </>
  );
};
