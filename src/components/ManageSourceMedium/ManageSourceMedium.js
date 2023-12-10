import React, { useMemo, useState } from "react";

//MRT Imports
import MaterialReactTable from "material-react-table";

//Material-UI Imports
import { Box, Button, ListItemIcon, MenuItem, Typography, TextField, IconButton } from "@mui/material";
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
import { ManageAllSourceMedium, deleteSourceMedium, updateSourceMedium, createSourceMedium, ManageSourceMediumSelector } from "./ManageSourceMediumSlice";
import { convertToLocalTimeZone, isEmpty } from "../../utils/function";
import { listUserSelector } from "../Admin/Users/UsersSlice";
//Mock Data

const ManageSourceMediums = () => {
  const [listdata, setListData] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [errors, setErrors] = useState({ display_name: false });
  const { isFetching, isSuccess, isError, errorMessage, ManageSourceMedium } = useSelector(ManageSourceMediumSelector);
  const { user } = useSelector(listUserSelector);
  const dispatch = useDispatch();
  const handleEditClickOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };
  const handleCreateClickOpen = () => {
    setCreateOpen(true);
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
    dispatch(ManageAllSourceMedium({ user_id: googleUser.uid }));
  };
  useEffect(() => {
    listDataapi();
  }, []);

  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "id",
      //   id: "id", //id used to define `group` column
      //   header: "ID",
      // },
      {
        accessorKey: "utm_source.display_name",
        id: "utm_source", //id used to define `group` column
        header: "UTM Source",
      },
      {
        accessorKey: "utm_medium.display_name",
        id: "utm_medium", //id used to define `group` column
        header: "UTM Medium",
      },
      {
        accessorKey: "updated_at",
        id: "updated_at", //id used to define `group` column
        header: "Updated At",
        enableEditing: false,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{ convertToLocalTimeZone(row.original.updated_at) }</span>
          </Box>)
      }
      // {
      //   accessorKey: "updated_at",
      //   id: "updated_at", //id used to define `group` column
      //   header: "Updated At",
      //   enableEditing: false,
      // },
    ],
    []
  );

  const onHandleChange = (e) => {
    setSelectedRow({ ...selectedRow, display_name: e.target.value });
    if (!isEmpty(e.target.value)) {
      setErrors({ ...errors, display_name: false });
    } else {
      setErrors({ ...errors, display_name: true });
    }
  };

  const handleCreateSaveRow = async () => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    if (errors.display_name === false) {
      dispatch(createSourceMedium(selectedRow));
      handleCreateClose();
      setSelectedRow({})
    }
  };

  const handleEditSaveRow = async () => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    if (errors.display_name === false) {
      dispatch(updateSourceMedium(selectedRow));
      handleEditClose();
      setSelectedRow({})
    }
  };

  const handleDelete = async () => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    if (errors.display_name === false) {
      dispatch(deleteSourceMedium(selectedRow));
      handleDeleteClose();
      setSelectedRow({})
    }
  };
  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={ManageSourceMedium? ManageSourceMedium :[]}
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
        renderRowActions={(row, index) => (
          <Box>
            {user?.role === "super_admin" && (
              <IconButton
                onClick={() => {
                  // Delete email logic...
                  setSelectedIndex(row?.row?.index);
                  setSelectedRow(row?.row?.original);
                  handleDeleteClickOpen();
                }}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        )}
      />
        <Dialog
        open={createOpen}
        onClose={handleCreateClose}
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogTitle>Create SourceMedium</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="display_name"
            id="outlined-error-helper-text-source-name"
            label="Display Name"
            helperText={errors.display_name ? "Display Name is Empty, Please enter the Display Name" : "Enter the Display Name"}
            type="text"
            fullWidth
            error={errors.display_name}
            variant="standard"
            value={selectedRow.display_name}
            onChange={onHandleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={handleCreateSaveRow}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogTitle>Edit SourceMedium</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="display_name"
            id="outlined-error-helper-text-medium-name"
            label="Display Name"
            helperText={errors.display_name ? "Display Name is Empty, Please enter the Display Name" : "Enter the Display Name"}
            type="text"
            fullWidth
            error={errors.display_name}
            variant="standard"
            value={selectedRow.display_name}
            onChange={onHandleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSaveRow}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Mapping"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once deleted item cannot be rollback. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} className="btn-secondary">Cancel</Button>
          <Button
            className="btn-danger"
            onClick={handleDelete}
            autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageSourceMediums;
