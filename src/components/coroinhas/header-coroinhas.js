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
import { ListagemCoroinhas } from "./listagem-coroinhas";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const HeaderCoroinhas = (props) => {
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
    setSearchResult(null); // Limpar resultados da pesquisa
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
          Coroinhas
        </Typography>
        <Box sx={{ m: 1, display: "flex" }}>
          <Link href="/cadastros/novo-coroinha" color="primary">
            <Button color="primary" variant="contained">
              Novo Coroinha
            </Button>
          </Link>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box
              sx={{ maxWidth: 1000, display: "flex", alignContent: "center" }}
            >
              {/* Campo de pesquisa */}
              <TextField
                fullWidth
                placeholder="Nome do coroinha"
                variant="outlined"
                value={searchValue}
                onChange={handleSearchChange}
              />
              {/* Botão de Pesquisar */}
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  margin: "0px 10px",
                }}
                color="success"
                variant="contained"
                onClick={() => handleSearch(searchValue)} // Passa searchValue para handleSearch
                startIcon={<SearchIcon />} // Ícone de lupa
              >
                Pesquisar
              </Button>
              {/* Botão de Limpar Pesquisa */}
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
      {/* Componente de listagem de coroinhas */}
      <ListagemCoroinhas coroinhas={searchResult} />
    </Box>
  );
};
