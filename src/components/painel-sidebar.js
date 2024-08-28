import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Divider, Drawer, useMediaQuery } from "@mui/material";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Users as UsersIcon } from "../icons/users";
import { NavItem } from "./nav-item";
import NextLink from "next/link";
import PropTypes from "prop-types";
import HotelIcon from "@mui/icons-material/Hotel";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";

const items = [
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Painel",
  },
  {
    href: "/despensas",
    icon: <HotelIcon fontSize="small" />,
    title: "Despensas",
  },
  {
    href: "/coroinhas",
    icon: <UsersIcon fontSize="small" />,
    title: "Coroinhas",
  },
  {
    href: "/escalas",
    icon: <InsertChartIcon fontSize="small" />,
    title: "Escalas",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div>
        <Box sx={{ p: 3, marginBottom: -3, textAlign: "center" }}>
          <NextLink href="/" passHref>
            <img
              src="/static/logoParoquia.jpeg"
              alt="Logo Paroquia São José Lagoa Redonda"
              style={{
                display: "inline-block",
                width: "150px",
                borderRadius: "10px",
              }}
            />
          </NextLink>
        </Box>
      </div>
      <Divider
        sx={{
          borderColor: "#2D3748",
          my: 3,
        }}
      />
      <Box sx={{ flexGrow: 1, paddingBottom: 30 }}>
        {items.map((item) => (
          <NavItem
            key={item.title}
            icon={item.icon}
            href={item.href}
            title={item.title}
          />
        ))}
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,

            "::-webkit-scrollbar": {
              /* Estiliza a barra de rolagem */ width: "5px",
            },

            "::-webkit-scrollbar-thumb": {
              /* Estiliza o botão de rolagem */ backgroundColor: "green",
              borderRadius: "10px",
            },

            "::-webkit-scrollbar-track": {
              /* Estiliza o fundo da barra de rolagem */
              backgroundColor: "bfbfbf",
            },

            scrollbarWidth: "thin",
            scrollbarColor: "blue orange",
            "::-webkit-scrollbar-thumb:vertical": {
              width: "8px",
              backgroundColor: "#bfbfbf",
              borderTop: "1px solid #a4a4a4",
              borderBottom: "1px solid #a4a4a4",
            },
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
