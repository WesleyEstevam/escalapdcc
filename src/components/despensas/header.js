import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ListaDespensas } from "./listagem-despensas";

export const Despensas = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async (searchTerm) => {
    try {
      const q = query(
        collection(db, "coroinhas"),
        where("nome_coroinha", ">=", searchTerm),
        where("nome_coroinha", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);

      const coroinhasData = querySnapshot.docs.map((doc) => ({
        id_coroinha: doc.id,
        ...doc.data(),
      }));

      setSearchResult(coroinhasData); // Definir resultados da pesquisa como array para ListagemCoroinhas
    } catch (error) {
      console.error("Erro ao buscar coroinhas:", error);
      setSearchResult([]); // Definir array vazio em caso de erro
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchResult(null); // Redefinir lista de coroinhas para estado inicial
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Despensas
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box
              sx={{ maxWidth: 1000, display: "flex", alignContent: "center" }}
            >
              <TextField
                fullWidth
                placeholder="Nome do coroinha"
                variant="outlined"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  margin: "0px 10px",
                }}
                color="success"
                variant="contained"
                onClick={() => handleSearch(searchValue)}
                startIcon={<SearchIcon />} // Ícone de lupa
              >
                Buscar
              </Button>
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                }}
                color="secondary"
                variant="contained"
                onClick={handleClear}
                startIcon={<ClearIcon />} // Ícone de borracha
              >
                Limpar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <br />
      <ListaDespensas coroinhas={searchResult} />
    </Box>
  );
};
