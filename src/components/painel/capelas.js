import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase"; // Importe o Firestore
import { collection, getDocs } from "firebase/firestore";
import HomeIcon from "@mui/icons-material/Home";

export const Capelas = (props) => {
  const [capelas, setCapelas] = useState([]);

  useEffect(() => {
    const fetchCapelas = async () => {
      try {
        const capelasRef = collection(db, "capelas"); // Referência à coleção "capelas"
        const querySnapshot = await getDocs(capelasRef);
        const capelasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCapelas(capelasData);
      } catch (error) {
        console.log("Ops! Erro na consulta: " + error);
      }
    };

    fetchCapelas();
  }, []);

  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Capelas
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {capelas.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                height: 56,
                width: 56,
              }}
            >
              <HomeIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
