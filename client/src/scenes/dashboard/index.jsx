import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  // DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  // Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useGetDashboardQuery, useGetOrdersQuery } from "state/api";
import StatBox from "components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardQuery();

  const columns = [
    {
      field: "id",
      headerName: "ID заказа",
      flex: 1,
    },
    {
      field: "client_id",
      headerName: "ID клиента",
      flex: 1,
    },
    {
      field: "service_id",
      headerName: "ID услуги",
      flex: 1,
    },
    {
      field: "order_date",
      headerName: "Дата заказа",
      flex: 1.5,
      sortable: true,
      type: 'dateTime',
      valueGetter: ({value}) => {
        console.log(value);
        return new Date(value);
      },
    },
    {
      field: "status",
      headerName: "Статус заказа",
      flex: 1,
      valueGetter: (({value})=>{
        if(value == "new"){
          return "Новый"
        }
        else{
          return "Выполнен"
        }
      }),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Панель управления" subtitle="Добро пожаловать!" />

        <Box>
          {/* <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button> */}
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Всего пользователей"
          value={data && data.customerCount}
          increase="+XX%"
          description="По сравнению с прошлым месяцем"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Заказов сегодня"
          value={data && data.countToday}
          increase="+XX%"
          description="По сравнению со вчера"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography 
            variant="h2"
            color={theme.palette.secondary[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            Ссылка на телеграм-бота:
          </Typography>
          <Typography 
            variant="h3"
            color={theme.palette.secondary[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            <a className="dashboard-link" href="https://t.me/DevAlphaOrderBot">t.me/DevAlphaOrderBot</a>
          </Typography>
          
          {/* <OverviewChart view="sales" isDashboard={true} /> */}
        </Box>
        <StatBox
          title="Всего заказов"
          value={data && data.orderCount}
          increase="+XX%"
          description="По сравнению с прошлым месяцем"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Всего услуг"
          value={data && data.serviceCount}
          increase="+XX%"
          description="По сравнению с прошлым годои"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row.id}
            rows={(data && data.ordersToday) || []}   
            columns={columns}
            pagination
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Продажи по категориям
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Разбивка реальных состояний и информация по категориям о доходах сделанных за этот год, и общий объем продаж.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
