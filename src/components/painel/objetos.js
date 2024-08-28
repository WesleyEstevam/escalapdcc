import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import HandymanIcon from "@mui/icons-material/Handyman";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export const Objetos = (props) => {
  const [objetos, setObjetos] = useState([]);

  useEffect(() => {
    const fetchObjetos = async () => {
      try {
        const objetosRef = collection(db, "objetos_liturgicos");
        const querySnapshot = await getDocs(objetosRef);
        const objetosData = querySnapshot.docs.map((doc) => doc.data());
        setObjetos(objetosData);
      } catch (error) {
        console.error("Erro ao buscar os objetos litúrgicos:", error);
      }
    };

    fetchObjetos();
  }, []);

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Objetos Litúrgicos
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {objetos.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "warning.main",
                height: 56,
                width: 56,
              }}
            >
              <HandymanIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
