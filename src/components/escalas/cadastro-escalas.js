import React, { useState, useEffect } from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { alertaCadastro } from "../btn_acao/alertas";
import { db } from "../../firebase/firebase";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  doc,
  orderBy,
} from "firebase/firestore";

const CadastrarEscala = () => {
  const [capelas, setCapelas] = useState([]);
  const [nomesCoroinhas, setNomesCoroinhas] = useState([]);
  const [nomesObjetosLiturgicos, setNomesObjetosLiturgicos] = useState([]);
  const [escala, setEscala] = useState({
    id_capela: "",
    horario_missa: "",
    tipo_cerimonia: "",
    data_escala: "",
  });
  const [coroinhas, setCoroinhas] = useState([
    { id_coroinha: "", id_objeto: "" },
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [step, setStep] = useState(1);
  const [coroinhasComErro, setCoroinhasComErro] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEscala({
      ...escala,
      [name]: value,
    });
  };

  const handleChangeCoroinha = (index, atributo, value) => {
    const novasCoroinhas = [...coroinhas];
    novasCoroinhas[index][atributo] = value;
    setCoroinhas(novasCoroinhas);
  };

  useEffect(() => {
    const fetchCapelas = async () => {
      try {
        const capelasRef = collection(db, "capelas");
        const querySnapshot = await getDocs(capelasRef);
        const capelasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome_capela,
        }));
        setCapelas(capelasData);
      } catch (error) {
        console.error("Erro ao buscar o nome da capela:", error);
      }
    };

    const fetchNomesCoroinhas = async () => {
      try {
        const coroinhasRef = collection(db, "coroinhas");
        const queryAtivos = query(coroinhasRef, where("status", "==", "ativo"));
        const querySnapshot = await getDocs(queryAtivos);
        const coroinhasData = querySnapshot.docs.map((doc) => ({
          id_coroinha: doc.id,
          nome_coroinha: doc.data().nome_coroinha,
        }));

        // Ordena a lista de coroinhas pelo nome em ordem ascendente
        const coroinhasOrdenados = coroinhasData.sort((a, b) =>
          a.nome_coroinha.localeCompare(b.nome_coroinha)
        );

        setNomesCoroinhas(coroinhasOrdenados);
      } catch (error) {
        console.error("Erro ao buscar nomes dos coroinhas:", error);
      }
    };

    const fetchNomesObjetosLiturgicos = async () => {
      try {
        const objetosRef = collection(db, "objetos_liturgicos");
        const querySnapshot = await getDocs(objetosRef);
        const objetosData = querySnapshot.docs.map((doc) => ({
          id_objeto: doc.id,
          nome_objeto: doc.data().nome_objeto,
        }));

        // Ordena a lista de objetos litúrgicos pelo nome em ordem ascendente
        const objetosOrdenados = objetosData.sort((a, b) =>
          a.nome_objeto.localeCompare(b.nome_objeto)
        );

        setNomesObjetosLiturgicos(objetosOrdenados);
      } catch (error) {
        console.error("Erro ao buscar os objetos litúrgicos:", error);
      }
    };

    fetchCapelas();
    fetchNomesCoroinhas();
    fetchNomesObjetosLiturgicos();
  }, [db]);

  const navigate = useRouter();

  const handleNextStep = () => {
    setStep(2);
  };

  const verificarAlturaCoroinhas = async (idCoroinha1, idCoroinha2) => {
    try {
      const coroinha1DocRef = doc(db, "coroinhas", idCoroinha1);
      const coroinha2DocRef = doc(db, "coroinhas", idCoroinha2);

      const coroinha1Doc = await getDoc(coroinha1DocRef);
      const coroinha2Doc = await getDoc(coroinha2DocRef);

      if (!coroinha1Doc.exists() || !coroinha2Doc.exists()) {
        throw new Error("Um ou ambos os coroinhas não foram encontrados.");
      }

      const alturaCoroinha1 = coroinha1Doc.data().altura_coroinha;
      const alturaCoroinha2 = coroinha2Doc.data().altura_coroinha;

      // Verifica a diferença de altura e retorna uma mensagem se for significativa
      if (Math.abs(alturaCoroinha1 - alturaCoroinha2) > 0.2) {
        return "Muita diferença de altura";
      }

      return null; // Retorna null se não houver problemas
    } catch (error) {
      console.error("Erro ao verificar a altura dos coroinhas:", error);
      throw error;
    }
  };

  const handleSaveEscala = async () => {
    setCoroinhasComErro([]);

    if (
      coroinhas.length === 0 ||
      coroinhas.some((c) => !c.id_coroinha || !c.id_objeto)
    ) {
      console.error(
        "Por favor, adicione pelo menos um coroinha com seu objeto litúrgico."
      );
      setSnackbarMessage(
        "Por favor, adicione pelo menos um coroinha com seu objeto litúrgico."
      );
      setSnackbarOpen(true);
      return;
    }

    const objetosLiturgicosEspecificos = [
      "8au3rJzj1QmXX2te1fWw",
      "av0lZuHiKEV9x2LsvYLS",
      "QUMn6OBjvLzIGWWoqop8",
    ];

    const coroinhasParaVerificar = coroinhas.filter((coroinha) =>
      objetosLiturgicosEspecificos.includes(coroinha.id_objeto)
    );

    if (coroinhasParaVerificar.length >= 2) {
      for (let i = 0; i < coroinhasParaVerificar.length; i++) {
        for (let j = i + 1; j < coroinhasParaVerificar.length; j++) {
          const resultado = await verificarAlturaCoroinhas(
            coroinhasParaVerificar[i].id_coroinha,
            coroinhasParaVerificar[j].id_coroinha
          );
          if (resultado) {
            // Se houver uma mensagem de erro, mostre-a
            setSnackbarMessage(resultado);
            setSnackbarOpen(true);
            setCoroinhasComErro([
              coroinhasParaVerificar[i].id_coroinha,
              coroinhasParaVerificar[j].id_coroinha,
            ]);
            return;
          }
        }
      }
    }

    try {
      // Crie uma referência ao documento da capela
      const capelaRef = doc(db, "capelas", escala.id_capela);

      // Mapeie coroinhas e objetos litúrgicos como referências
      const coroinhasRefs = coroinhas.map(({ id_coroinha, id_objeto }) => ({
        id_coroinha: doc(db, "coroinhas", id_coroinha),
        id_objeto: doc(db, "objetos_liturgicos", id_objeto),
      }));

      await addDoc(collection(db, "escalas"), {
        ...escala,
        id_capela: capelaRef, // Armazena a referência da capela
        coroinhas: coroinhasRefs, // Armazena as referências dos coroinhas e objetos
      });

      alertaCadastro();
      navigate.push("/escalas");
    } catch (error) {
      console.error("Ops! Ocorreu um erro:", error);
      setSnackbarMessage("Ops! Ocorreu um erro ao salvar a escala.");
      setSnackbarOpen(true);
    }
  };

  const addCoroinha = () => {
    setCoroinhas([...coroinhas, { id_coroinha: "", id_objeto: "" }]);
  };

  const deletarLinha = (index) => {
    setCoroinhas((prevCoroinhas) => {
      const novasCoroinhas = [...prevCoroinhas];
      novasCoroinhas.splice(index, 1);
      return novasCoroinhas;
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const getCoroinhaErrorStyle = (idCoroinha) => {
    return coroinhasComErro.includes(idCoroinha)
      ? { borderColor: "red", borderWidth: "2px", borderStyle: "solid" }
      : {};
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        textAlign="center"
        m={3}
      >
        <Typography variant="h4" textAlign="center">
          {step === 1 ? "Nova Escala" : "Adicionar Coroinhas"}
        </Typography>
        <Box />
      </Box>
      <Container>
        {step === 1 ? (
          <>
            <Grid container spacing={2} mt={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Nome da Igreja</InputLabel>
                  <Select
                    name="id_capela"
                    value={escala.id_capela}
                    onChange={handleChange}
                  >
                    {capelas.map((capela) => (
                      <MenuItem key={capela.id} value={capela.id}>
                        {capela.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Horário da Missa</InputLabel>
                  <Select
                    name="horario_missa"
                    value={escala.horario_missa}
                    onChange={handleChange}
                  >
                    <MenuItem value="07:00h">07:00h</MenuItem>
                    <MenuItem value="09:00h">09:00h</MenuItem>
                    <MenuItem value="11:00h">11:00h</MenuItem>
                    <MenuItem value="15:00h">15:00h</MenuItem>
                    <MenuItem value="17:00h">17:00h</MenuItem>
                    <MenuItem value="18:00h">18:00h</MenuItem>
                    <MenuItem value="18:30h">18:30h</MenuItem>
                    <MenuItem value="19:00h">19:00h</MenuItem>
                    <MenuItem value="19:30h">19:30h</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="tipo_cerimonia"
                  label="Tipo de Cerimônia"
                  fullWidth
                  value={escala.tipo_cerimonia}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="data_escala"
                  label="Data"
                  type="date"
                  fullWidth
                  value={escala.data_escala}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextStep}
              >
                Avançar
              </Button>
            </Box>
          </>
        ) : (
          <>
            {coroinhas.map((coroinha, index) => (
              <Grid
                container
                spacing={2}
                alignItems="center"
                mt={3}
                key={index}
              >
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel>Coroinha</InputLabel>
                    <Select
                      value={coroinha.id_coroinha}
                      onChange={(e) =>
                        handleChangeCoroinha(
                          index,
                          "id_coroinha",
                          e.target.value
                        )
                      }
                      style={getCoroinhaErrorStyle(coroinha.id_coroinha)}
                    >
                      <MenuItem value="">
                        <em>-</em>
                      </MenuItem>
                      {nomesCoroinhas.map((coroinha) => (
                        <MenuItem
                          key={coroinha.id_coroinha}
                          value={coroinha.id_coroinha}
                        >
                          {coroinha.nome_coroinha}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel>Objeto Litúrgico</InputLabel>
                    <Select
                      value={coroinha.id_objeto}
                      onChange={(e) =>
                        handleChangeCoroinha(index, "id_objeto", e.target.value)
                      }
                      style={getCoroinhaErrorStyle(coroinha.id_coroinha)}
                    >
                      {nomesObjetosLiturgicos.map((objeto) => (
                        <MenuItem
                          key={objeto.id_objeto}
                          value={objeto.id_objeto}
                        >
                          {objeto.nome_objeto}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    color="secondary"
                    onClick={() => deletarLinha(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Box display="flex" justifyContent="center" mt={3}>
              <Button variant="contained" color="primary" onClick={addCoroinha}>
                Adicionar Coroinha
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveEscala}
                sx={{ ml: 2 }}
              >
                Salvar
              </Button>
            </Box>
          </>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CadastrarEscala;
