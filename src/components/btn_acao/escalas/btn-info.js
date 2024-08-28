import { Container, Grid, TextField, InputLabel, Button } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { alertaCopy } from "../alertas";

export const InfoEscalas = () => {
  const [escala, setEscala] = useState(null);
  const router = useRouter();
  const data = router.query.data ? JSON.parse(router.query.data) : null;

  useEffect(() => {
    const fetchEscala = async () => {
      if (data) {
        try {
          const escalaRef = doc(db, "escalas", data);
          const escalaDoc = await getDoc(escalaRef);

          if (escalaDoc.exists()) {
            const escalaData = escalaDoc.data();

            // Verifica se existe uma referência de capela
            if (escalaData.id_capela) {
              const capelaRef = doc(db, "capelas", escalaData.id_capela.id);
              const capelaDoc = await getDoc(capelaRef);

              if (capelaDoc.exists()) {
                const capelaData = capelaDoc.data();

                // Buscar detalhes dos coroinhas e objetos litúrgicos
                const coroinhaDetails = await Promise.all(
                  escalaData.coroinhas.map(async (coroinhaRef) => {
                    const coroinhaDoc = await getDoc(coroinhaRef.id_coroinha);
                    return coroinhaDoc.exists() ? coroinhaDoc.data() : null;
                  })
                );

                const objetoDetails = await Promise.all(
                  escalaData.coroinhas.map(async (coroinhaRef) => {
                    const objetoDoc = await getDoc(coroinhaRef.id_objeto);
                    return objetoDoc.exists() ? objetoDoc.data() : null;
                  })
                );

                setEscala({
                  ...escalaData,
                  nome_capela: capelaData.nome_capela,
                  coroinhas: coroinhaDetails.filter(Boolean), // Remove nulos
                  objetosLiturgicos: objetoDetails.filter(Boolean), // Remove nulos
                });
              } else {
                console.log("Capela não encontrada!");
              }
            } else {
              setEscala(escalaData);
            }
          } else {
            console.log("Documento não encontrado!");
          }
        } catch (error) {
          console.error("Ops, deu erro na listagem do id", error);
        }
      }
    };

    fetchEscala();
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEscala((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBack = () => {
    router.push("/escalas");
  };

  const generateScheduleText = (escala) => {
    let text = `ARQUIDIOCESE DE FORTALEZA PARÓQUIA DE SÃO JOSÉ \n\n`;
    text += `${escala.tipo_cerimonia}\n\n`;
    text += `Escala do dia: ${formatarDataBrasileira(escala.data_escala)}\n\n`;
    text += `${escala.nome_capela} - ${escala.horario_missa}\n\n`;

    escala.coroinhas.forEach((coroinha, index) => {
      const objetoLiturgico = escala.objetosLiturgicos[index];
      text += `${objetoLiturgico?.nome_objeto}: `;
      text += `${coroinha?.nome_coroinha}\n`;
    });

    return text;
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    document.body.removeChild(textArea);
  };

  const share = () => {
    if (!escala) return;

    const scheduleText = generateScheduleText(escala);

    if (navigator.share) {
      navigator
        .share({
          title: "ARQUIDIOCESE DE FORTALEZA PARÓQUIA DE SÃO JOSÉ ",
          text: scheduleText,
        })
        .then(() => {
          console.log("Escala compartilhada com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao compartilhar a escala:", error);
        });
    } else {
      copyToClipboard(scheduleText);
      alertaCopy();
    }
  };

  if (!escala) return null;

  const formatarDataBrasileira = (data) => {
    let dataObj;

    if (data instanceof Date) {
      dataObj = data;
    } else if (typeof data?.toDate === "function") {
      dataObj = data.toDate();
    } else if (typeof data === "string" || typeof data === "number") {
      dataObj = new Date(data);
    } else {
      return "Data inválida";
    }

    const dia = String(dataObj.getUTCDate()).padStart(2, "0");
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0");
    const ano = dataObj.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Container>
      <Grid
        container
        spacing={2}
        mt={3}
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Escala do dia: {formatarDataBrasileira(escala.data_escala)}</h1>
        <Grid>
          <Button
            variant="contained"
            color="success"
            onClick={share}
            style={{ margin: 4 }}
          >
            <ShareIcon />
          </Button>
          <Button variant="contained" onClick={handleBack}>
            Voltar
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label="Nome da capela"
            name="nome_capela"
            value={escala.nome_capela}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label="Horário da Missa"
            name="horario_missa"
            value={escala.horario_missa}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label="Tipo de Cerimônia"
            name="tipo_cerimonia"
            value={escala.tipo_cerimonia}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label="Data da Escala"
            name="data_escala"
            value={formatarDataBrasileira(escala.data_escala)}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      {escala.coroinhas.length > 0 ? (
        escala.coroinhas.map((coroinha, index) => (
          <Grid container spacing={2} alignItems="center" mt={3} key={index}>
            <Grid item xs={12} sm={6}>
              <InputLabel>Coroinha</InputLabel>
              <TextField
                fullWidth
                disabled
                value={coroinha?.nome_coroinha || ""}
                placeholder="Nome do Coroinha"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Função</InputLabel>
              <TextField
                fullWidth
                disabled
                value={escala.objetosLiturgicos[index]?.nome_objeto || ""}
                placeholder="Função"
              />
            </Grid>
          </Grid>
        ))
      ) : (
        <p>Nenhum coroinha encontrado.</p>
      )}
    </Container>
  );
};
