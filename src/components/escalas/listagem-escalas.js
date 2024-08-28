import {
  Box,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import InfoIcon from "@mui/icons-material/Info";
import { DeletarItem } from "../btn_acao/btn-delet";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const Escalas = () => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const router = useRouter();

  // LISTAGEM DE ESCALAS
  useEffect(() => {
    const fetchEscalas = async () => {
      try {
        const escalasRef = collection(db, "escalas");
        const querySnapshot = await getDocs(escalasRef);

        const escalasData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const escalaData = doc.data();
            const capelaRef = escalaData.id_capela;

            // Convertendo a data_escala para Date, se necessário
            const dataEscala =
              escalaData.data_escala instanceof Date
                ? escalaData.data_escala
                : new Date(escalaData.data_escala);

            let nomeCapela = "Capela não encontrada";

            // Verificando se a referência da capela é válida
            if (capelaRef && capelaRef.id) {
              const capelaDoc = await getDoc(capelaRef);
              if (capelaDoc.exists()) {
                nomeCapela = capelaDoc.data().nome_capela;
              }
            }

            return {
              id_escala: doc.id,
              nome_capela: nomeCapela,
              data_escala: dataEscala,
              ...escalaData,
            };
          })
        );

        setEscalas(escalasData);
      } catch (error) {
        console.error("Erro ao buscar escalas:", error);
      }
    };
    fetchEscalas();
  }, []);

  async function handleFindOne(tipoPessoa) {
    try {
      router.push(
        `/telas_acao/escalas/btn-info?data=${JSON.stringify(
          tipoPessoa.id_escala
        )}`
      );
    } catch (error) {
      console.error("ops, erro ao listar id " + error);
    }
  }

  async function handleDelete(itemId) {
    try {
      // Referência ao documento a ser deletado
      const escalaRef = doc(db, "escalas", itemId);

      // Deletar o documento no Firestore
      await deleteDoc(escalaRef);

      // Atualizar a lista de escalas após a exclusão
      const novaLista = escalas.filter((escala) => escala.id_escala !== itemId);
      setEscalas(novaLista);
    } catch (error) {
      console.error("ops, erro ao deletar " + error);
    }
  }

  const formatarDataBrasileira = (data) => {
    let dataObj;

    // Verifica se 'data' é um objeto Date; se não for, tenta convertê-lo
    if (data instanceof Date) {
      dataObj = data;
    } else if (typeof data?.toDate === "function") {
      dataObj = data.toDate(); // Para Timestamp do Firestore
    } else if (typeof data === "string" || typeof data === "number") {
      dataObj = new Date(data); // Para strings ou números de timestamp
    } else {
      return "Data inválida"; // Retorna uma mensagem de erro se o formato for inesperado
    }

    const dia = String(dataObj.getUTCDate()).padStart(2, "0");
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0");
    const ano = dataObj.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Card>
      <ImageList
        sx={{
          gridAutoFlow: "column",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr)) !important",
          gridAutoColumns: "minmax(160px, 1fr)",
        }}
      >
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome da Capela</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Tipo da cerimonia</TableCell>
                <TableCell>Data da escala</TableCell>
                <TableCell>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {escalas.slice(0).map((escala) => (
                <TableRow
                  hover
                  key={escala.id_escala}
                  selected={selectedCustomerIds.indexOf(escala.id) !== -1}
                >
                  <TableCell>{escala.nome_capela}</TableCell>
                  <TableCell>{escala.horario_missa}</TableCell>
                  <TableCell>{escala.tipo_cerimonia}</TableCell>
                  <TableCell>
                    {formatarDataBrasileira(escala.data_escala)}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() => handleFindOne(escala)}
                    >
                      <InfoIcon />
                    </Button>

                    <DeletarItem
                      color="error"
                      variant="contained"
                      onDelete={() => handleDelete(escala.id_escala)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </ImageList>
    </Card>
  );
};
