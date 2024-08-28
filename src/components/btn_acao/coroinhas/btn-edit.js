import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { alerta } from "../alertas";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase"; // Certifique-se de que esta importação está correta

export const EditCoroinha = () => {
  const [coroinha, setCoroinha] = useState({
    nome_coroinha: "",
    sexo_coroinha: "",
    altura_coroinha: "",
    tipo_coroinha: "",
  });

  const router = useRouter();
  const data = router.query.data ? JSON.parse(router.query.data) : null; //ID do coroinha

  // Carregar os dados do coroinha quando o componente for montado
  useEffect(() => {
    const fetchCoroinha = async () => {
      if (data) {
        try {
          // Cria a referência ao documento Firestore
          const docRef = doc(db, "coroinhas", data);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCoroinha({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.log("Nenhum documento encontrado!");
            setCoroinha({
              nome_coroinha: "",
              sexo_coroinha: "",
              altura_coroinha: "",
              tipo_coroinha: "",
            });
          }
        } catch (error) {
          console.log(
            "Ops, deu erro na obtenção dos dados do coroinha:",
            error
          );
        }
      }
    };

    fetchCoroinha();
  }, [data]);

  // Atualizar as informações de cada input
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário

    const updatedCoroinha = {
      ...coroinha,
      altura_coroinha: parseFloat(coroinha.altura_coroinha) || 0, // Assegura que é um número
    };

    if (data) {
      try {
        // Cria a referência ao documento que será atualizado
        const docRef = doc(db, "coroinhas", data);

        // Verifica se o documento existe antes de tentar atualizar
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          console.error("Documento não encontrado para atualizar");
          return;
        }

        // Atualiza o documento com os novos dados
        await updateDoc(docRef, updatedCoroinha);

        // Redireciona e mostra alerta após a atualização
        router.push("/coroinhas");
        alerta();
      } catch (error) {
        console.error("Ops, deu erro na atualização:", error);
      }
    }
  };

  // Atualiza o estado com as mudanças nos inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCoroinha((prev) => ({
      ...prev,
      [name]: name === "altura_coroinha" ? value : value,
    }));
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
          <Button variant="contained">Voltar</Button>
        </Link>
      </div>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <InputLabel>Nome do coroinha</InputLabel>
                <TextField
                  fullWidth
                  name="nome_coroinha"
                  onChange={handleChange}
                  value={coroinha?.nome_coroinha ?? ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Altura</InputLabel>
                <TextField
                  fullWidth
                  name="altura_coroinha"
                  type="number" // Ensure it's a number input
                  onChange={handleChange}
                  value={coroinha?.altura_coroinha ?? ""}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <InputLabel>Sexo</InputLabel>
                <TextField
                  fullWidth
                  name="sexo_coroinha"
                  onChange={handleChange}
                  value={coroinha?.sexo_coroinha ?? ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Tipo</InputLabel>
                <TextField
                  fullWidth
                  name="tipo_coroinha"
                  value={coroinha?.tipo_coroinha ?? ""}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button variant="contained" color="secondary" type="submit">
                    Atualizar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </>
  );
};
