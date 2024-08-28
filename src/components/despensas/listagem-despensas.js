import { useState, useEffect } from "react";
import HotelIcon from "@mui/icons-material/Hotel";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ImageList from "@mui/material/ImageList";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const ListaDespensas = ({ coroinhas }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [page, setPage] = useState(0);
  const [allCoroinhas, setAllCoroinhas] = useState([]);
  const router = useRouter();

  // LISTAGEM DE coroinhas
  useEffect(() => {
    const fetchCoroinhas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "coroinhas"));
        const coroinhasData = querySnapshot.docs.map((doc) => ({
          id_coroinha: doc.id,
          ...doc.data(),
        }));
        setAllCoroinhas(coroinhasData);
      } catch (error) {
        console.error("ops, erro ao buscar coroinhas " + error);
      }
    };

    if (!coroinhas) {
      fetchCoroinhas();
    } else {
      setAllCoroinhas(coroinhas);
    }
  }, [coroinhas]);

  const dispensarCoroinha = async (id_coroinha) => {
    try {
      // Referência ao documento do coroinha no Firestore
      const coroinhaRef = doc(db, "coroinhas", id_coroinha);

      // Obter o documento atual
      const coroinhaDoc = await getDoc(coroinhaRef);

      if (coroinhaDoc.exists()) {
        const currentStatus = coroinhaDoc.data().status;

        // Alternar entre "ativo" e "dispensado"
        const newStatus = currentStatus === "ativo" ? "dispensado" : "ativo";

        // Atualizar o status do coroinha no Firestore
        await updateDoc(coroinhaRef, {
          status: newStatus,
        });

        // Atualizar o estado local
        setAllCoroinhas((prevCoroinhas) =>
          prevCoroinhas.map((coroinha) =>
            coroinha.id_coroinha === id_coroinha
              ? {
                  ...coroinha,
                  status: newStatus,
                }
              : coroinha
          )
        );
      } else {
        console.error("Coroinha não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao dispensar coroinha:", error);
    }
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
        <Box sx={{ minWidth: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Sexo</TableCell>
                <TableCell>Altura</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allCoroinhas.slice(0).map((coroinha) => (
                <TableRow
                  hover
                  key={coroinha.id_coroinha}
                  selected={
                    selectedCustomerIds.indexOf(coroinha.id_coroinha) !== -1
                  }
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {coroinha.nome_coroinha}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{coroinha.sexo_coroinha}</TableCell>
                  <TableCell>{coroinha.altura_coroinha}</TableCell>
                  <TableCell>{coroinha.tipo_coroinha}</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <Button
                      color={
                        coroinha.status === "dispensado" ? "info" : "warning"
                      }
                      variant="contained"
                      onClick={() => dispensarCoroinha(coroinha.id_coroinha)}
                    >
                      {coroinha.status === "dispensado" ? (
                        <HotelIcon />
                      ) : (
                        <LightbulbIcon />
                      )}
                    </Button>
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
