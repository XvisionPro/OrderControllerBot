import * as React from 'react';
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useGetOrdersQuery} from "state/api";
import { useDispatch } from 'react-redux';
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Transactions = () => {
  const theme = useTheme();

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [sort, setSort] = React.useState({});
  const [search, setSearch] = React.useState("");

  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading , refetch} = useGetOrdersQuery();

  const [loading, setLoading] = React.useState(false);

  const changeStatus = React.useCallback(
    (id) => () => {
      setLoading(true);
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };
      fetch(`http://localhost:8080/general/orders/change/${id}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw Error(response.status || response.statusText);
        }
        const isJson = response.headers.get("content-type")?.includes("application/json");
        return isJson ? response.json() : null;
      })
      .then(() => {
        refetch();
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
    },
    [],
  );
  const deleteOrder = React.useCallback(
    (id) => () => {
      setLoading(true);
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      fetch(`http://localhost:8080/general/orders/delete/${id}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw Error(response.status || response.statusText);
        }
        const isJson = response.headers.get("content-type")?.includes("application/json");
        return isJson ? response.json() : null;
      })
      .then(() => {
        console.log('Удалил крч, иди нахуй', id);
        refetch();
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
    }
  );

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
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
            <GridActionsCellItem
            icon={<BorderColorIcon/>}
            label="Изменить статус"
            onClick={changeStatus(params.id)}
            // showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Удалить"
            onClick={deleteOrder(params.id)}
            // showInMenu
          />,
      ]
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ЗАКАЗЫ" subtitle="Таблица заказов" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
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
            backgroundColor: theme.palette.primary.light,
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
          rows={(data) || []}
          columns={columns}
          rowCount={(data && data.length) || 0}
          pagination
          rowsPerPageOptions={[20, 50, 100]}
          checkboxSelection={false}
          disableMultipleRowSelection={true}
          page={page}
          pageSize={pageSize}
          sortingMode="client"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
