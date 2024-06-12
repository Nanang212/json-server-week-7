import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Modal, TextField, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";

const Cars = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/cars")
      .then(response => response.json())
      .then(data => {
        setCars(data);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleOpen = (car) => {
    setCurrentCar(car);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCar(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedCar = { ...currentCar };

    fetch(`http://localhost:8000/cars/${currentCar.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedCar)
    }).then(response => {
      if (response.ok) {
        const updatedCars = cars.map(car =>
          car.id === currentCar.id ? updatedCar : car
        );
        setCars(updatedCars);
        handleClose();
      }
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/cars/${id}`, {
      method: "DELETE",
    }).then(response => {
      if (response.ok) {
        const updatedCars = cars.filter(car => car.id !== id);
        setCars(updatedCars);
      }
    });
  };

  const columns = [
    // { field: "id", headerName: "ID", headerAlign: "center", align: "center" },
    { field: "manufacture", headerName: "Manufacture", flex: 1, headerAlign: "center", align: "center" },
    { field: "type", headerName: "Type", flex: 1, headerAlign: "center", align: "center" },
    { field: "rentPerDay", headerName: "Rent Per Day", type: "number", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "available",
      headerName: "Available",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { available } }) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={1}
            gap={1}
            width="100%"
          >
            <Typography>
              {available ? "Available" : "Not Available"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { image } }) => {
        return (
          <Box
            component="img"
            src={image}
            alt="car"
            width={100}
            height={60}
            sx={{ objectFit: "cover" }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Aksi",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center" gap={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleOpen(row)}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="CARS" subtitle="Managing the Cars" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            textAlign: "center",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={cars}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          component="form"
          onSubmit={handleUpdate}
          p={3}
          bgcolor="background.paper"
          borderRadius={1}
          boxShadow={24}
          mx="auto"
          my="auto"
          display="flex"
          flexDirection="column"
          width={400}
          gap={2}
        >
          <Typography variant="h6">Update Car</Typography>
          <TextField
            label="Manufacture"
            value={currentCar?.manufacture || ''}
            onChange={(e) => setCurrentCar({ ...currentCar, manufacture: e.target.value })}
          />
          <TextField
            label="Type"
            value={currentCar?.type || ''}
            onChange={(e) => setCurrentCar({ ...currentCar, type: e.target.value })}
          />
          <TextField
            label="Rent Per Day"
            type="number"
            value={currentCar?.rentPerDay || ''}
            onChange={(e) => setCurrentCar({ ...currentCar, rentPerDay: e.target.value })}
          />
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Available:</Typography>
            <input
              type="checkbox"
              checked={currentCar?.available || false}
              onChange={(e) => setCurrentCar({ ...currentCar, available: e.target.checked })}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">Update</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Cars;
