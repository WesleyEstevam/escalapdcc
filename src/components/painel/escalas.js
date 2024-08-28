import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const Escalas = (props) => {
  const [escalas, setEscalas] = useState([]);

  useEffect(() => {
    const fetchEscalas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "escalas"));
        const escalasData = querySnapshot.docs.map((doc) => doc.data());
        setEscalas(escalasData);
      } catch (error) {
        console.log("Ops! Erro na consulta: ", error);
      }
    };

    fetchEscalas();
  }, []);

  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Escalas
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {escalas.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "success.main",
                height: 56,
                width: 56,
              }}
            >
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            pt: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mr: 1,
            }}
          ></Typography>
          <Typography color="textSecondary" variant="caption">
            Total de escalas
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
