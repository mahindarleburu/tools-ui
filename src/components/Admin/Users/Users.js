import React, { useMemo, useState } from "react";

//MRT Imports
import MaterialReactTable from "material-react-table";

//Material-UI Imports
import { Box, Button, ListItemIcon, MenuItem, Typography, TextField, IconButton, Grid, Card } from "@mui/material";
import { getAuth } from "firebase/auth";

//Icons Imports
import { Edit, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { listAllUser, listUserSelector, updateUser } from "./UsersSlice";
import { isEmpty } from "../../../utils/function";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import HomeIcon from "@mui/icons-material/Home";
//Mock Data

const Users = () => {
  let navigate = useNavigate();
  const [listdata, setListData] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [errors, setErrors] = useState({ role: false });
  const { isFetching, isSuccess, isError, errorMessage, users, listUser } = useSelector(listUserSelector);
  const { user } = useSelector(listUserSelector);
  const dispatch = useDispatch();
  const handleEditClickOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteClickOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const auth = getAuth();
  const googleUser = auth.currentUser;
  const listDataapi = async (uid) => {
    dispatch(listAllUser());
  };
  useEffect(() => {
    listDataapi();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "displayName",
        id: "displayName", //id used to define `group` column
        header: "Display Name",
      },
      {
        accessorKey: "email",
        id: "email", //id used to define `group` column
        header: "Email",
        enableEditing: false,
      },
      {
        accessorKey: "role",
        id: "role", //id used to define `group` column
        header: "Role",
        enableEditing: false,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>
              {(row.original.role === "employee" && "Employee") ||
                (row.original.role === "super_admin" && "Super Admin") ||
                (row.original.role === "admin" && "Admin")}
            </span>
          </Box>
        ),
      },
      {
        accessorKey: "lastLoginAt",
        id: "lastLoginAt", //id used to define `group` column
        header: "Last Login",
        enableEditing: false,
      },
    ],
    []
  );

  const onHandleChange = (e) => {
    setSelectedRow({ ...selectedRow, role: e.target.value });
    if (!isEmpty(e.target.value)) {
      setErrors({ ...errors, role: false });
    } else {
      setErrors({ ...errors, role: true });
    }
  };

  const handleEditSaveRow = async () => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    if (errors.role === false) {
      dispatch(updateUser(selectedRow));
      handleEditClose();
      // setSelectedRow({});
    }
  };

  return (
    <>
      <div className="breadcum">
        <HomeIcon
          className="cp"
          sx={{ fontSize: 18, verticalAlign: "sub" }}
          onClick={() => navigate("/home")}
        />
        <span className="fs-14"> / Users</span>
      </div>
      <Box sx={{ flexGrow: 1, marginLeft: "20px", marginTop: "10px" }}>
        <Grid container spacing={2}>
          {users && <Grid  item xs={12} md={3}>
            <Card sx={{ width: '100%' }}>
              <p className="p-l-10">Total Users</p>
              <p className="p-l-10 m-b-10 fs-30 fw-bold m-0">{users.length}</p>
            </Card>
          </Grid> }

        </Grid>
      </Box>
      <Box className="onelink-container">
        <MaterialReactTable
          columns={columns}
          data={users}
          enableHiding={false}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          enablePagination={false}
          enableColumnActions={false}
          enableRowActions={true}
          enableStickyHeader
          initialState={{ density: "compact" }}
          muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
          positionActionsColumn="last"
          renderRowActionMenuItems={({ closeMenu, row, index }) => [
            <MenuItem
              key={0}
              onClick={() => {
                // View profile logic...
                setSelectedIndex(row.index);
                setSelectedRow(row.original);
                handleEditClickOpen();
                closeMenu();
              }}
              sx={{ m: 0 }}
            >
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              Edit User
            </MenuItem>,
          ]}
          renderRowActions={(row, index) => (
            <Box>
              <IconButton
                onClick={() => {
                  // View profile logic...
                  setSelectedIndex(row?.row?.index);
                  setSelectedRow(row?.row?.original);
                  handleEditClickOpen();
                }}
              >
                <Edit />
              </IconButton>
            </Box>
          )}
        />
      </Box>

      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogTitle>Modify User Role & Permission</DialogTitle>
        <DialogContent>
          <DialogContentText className="fs-12">You are about to update the role for the below user.</DialogContentText>
          <p>
            <span>Name : </span>
            <span className="fw-bold">{selectedRow.displayName}</span>
          </p>
          <p>
            <span>Email : </span>
            <span className="fw-bold">{selectedRow.email}</span>
          </p>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={selectedRow.role}
              error={errors.role}
              name="role"
              id="outlined-error-helper-text"
              label="Role"
              helperText={errors.role ? "Role is Empty, Please enter the Role" : "Enter the Role"}
              onChange={onHandleChange}
            >
              <MenuItem value={"employee"}>Employee</MenuItem>
              <MenuItem value={"admin"}>Admin</MenuItem>
              <MenuItem value={"super_admin"}>Super Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="m-r-10 m-b-20">
          <Button
            className="btn-secondary"
            onClick={handleEditClose}
          >
            Cancel
          </Button>
          <Button
            className="btn-primary-theme"
            onClick={handleEditSaveRow}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You want to delete this item, Once deleted item cannot be rollback.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            // onClick={handleDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Users;
