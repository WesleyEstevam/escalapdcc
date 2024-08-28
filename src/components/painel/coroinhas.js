import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export const Coroinhas = (props) => {
  const [coroinhas, setCoroinhas] = useState([]);

  useEffect(() => {
    const fetchCoroinhas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "coroinhas"));
        const coroinhasList = querySnapshot.docs.map((doc) => doc.data());
        setCoroinhas(coroinhasList);
      } catch (error) {
        console.error("Erro ao buscar coroinhas:", error);
      }
    };

    fetchCoroinhas();
  }, []);

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Coroinhas
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {coroinhas.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "error.main",
                height: 56,
                width: 56,
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            color="error"
            sx={{
              mr: 1,
            }}
            variant="body2"
          ></Typography>
          <Typography color="textSecondary" variant="caption">
            Total de coroinhas
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
