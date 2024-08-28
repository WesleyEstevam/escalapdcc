import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, getDoc } from "firebase/firestore";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

export function Calendario() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
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
              id: doc.id,
              title: `${escalaData.horario_missa} - ${nomeCapela} - ${escalaData.tipo_cerimonia}`,
              start: dataEscala.toISOString(), // Converte a data para formato ISO
              extendedProps: {
                id_escala: doc.id,
                horario_missa: escalaData.horario_missa,
                capela: nomeCapela,
              },
            };
          })
        );

        setEvents(escalasData);
      } catch (error) {
        console.error("Erro ao buscar escalas:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        locale={ptBrLocale}
        timeZone="UTC" // ou 'local' dependendo da sua necessidade
        eventContent={(eventInfo) => <b>{eventInfo.event.title}</b>}
      />
    </div>
  );
}
