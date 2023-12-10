import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Button, ListItemIcon, MenuItem, Typography, TextField, IconButton, Tooltip } from "@mui/material";
import { getAuth } from "firebase/auth";
import { Edit, Delete, ContentCopy, QrCode2Sharp } from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import {
  listAllOnelinkByUserId,
  deleteOnelink,
  createOnelink,
  updateOnelink,
  listOneLinkSelector,
  createQrCode,
} from "./ManageOnelinkSlice";
import { createOnelinkValidation } from "./ManageOnelinkVal";
import { convertToLocalTimeZone, downloadCustomQRcode, isEmpty } from "../../utils/function";
import "./onelink.css";
import HomeIcon from "@mui/icons-material/Home";
import { toast } from "react-toastify";

const ListOnelink = () => {
  let navigate = useNavigate();
  const [listdata, setListData] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [errors, setErrors] = useState({ long_url: false });
  const { isFetching, isSuccess, isError, errorMessage, listOneLink } = useSelector(listOneLinkSelector);
  const dispatch = useDispatch();
  const auth = getAuth();
  const user = auth.currentUser;
  const handleEditClickOpen = (data) => {
    window.analytics.track("Edit Onelink Button Clicked", {
      page_name: "manage_onelink",
      url_path: window.location.host + "" + window.location.pathname,
      full_url: window.location.href,
    });
    const typeData = data.type === "shorturl" ? "shorten-url" : data.type;

    navigate("/" + typeData + "/" + data.onelink_code);
  };

  const handleDownloadQrCode = (data) => {
    downloadCustomQRcode({ url: data?.onelink, name: data.name });
    window.analytics.track("Download Qrcode Button Clicked", {
      page_name: "manage_onelink",
      url_path: window.location.host + "" + window.location.pathname,
      full_url: window.location.href,
    });
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleCreateClickOpen = () => {
    setCreateOpen(true);
  };
  const handleCreateClose = () => {
    setCreateOpen(false);
  };
  const handleDeleteClickOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const listDataapi = async (uid) => {
    dispatch(listAllOnelinkByUserId({ user_id: user.uid }));
  };
  useEffect(() => {
    listDataapi();
  }, []);
  const onClickCopyLongUrl = (data) => {
    navigator.clipboard.writeText(data);
    toast.info("Copy to clipboard success");
    window.analytics.track("Copy Button Clicked", {
      page_name: "manage_onelink",
      copy_url:data,
      url_path: window.location.host + "" + window.location.pathname,
      full_url: window.location.href,
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: "Name",
        enableEditing: false,
      },
      {
        accessorKey: "onelink",
        id: "onelink",
        header: "Onelink",
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
            <span className="onelink-code">{row.original.onelink}</span>
            <span>
              <IconButton
                className="legend3 fw-700"
                aria-label="delete"
                size="small"
                onClick={() => onClickCopyLongUrl(row.original.onelink)}
              >
                <ContentCopy fontSize="small" />
              </IconButton>{" "}
            </span>
          </Box>
        ),
      },
      {
        accessorKey: "type",
        id: "type",
        header: "Type",
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
              {(row.original.type === "utm" && "UTM Builder") ||
                (row.original.type === "shorturl" && "Shorten URL") ||
                (row.original.type === "qrcode" && "QR Code")}
            </span>
          </Box>
        ),
      },
      {
        accessorKey: "updated_at",
        id: "updated_at",
        header: "Updated At",
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
            <span>{convertToLocalTimeZone(row.original.updated_at)}</span>
          </Box>
        ),
      },
    ],
    []
  );

  const onHandleChange = (e) => {
    setSelectedRow({ ...selectedRow, [e.target.name]: e.target.value, user_id: user.uid });
  };

  const handleCreateSaveRow = async () => {
    const data = createOnelinkValidation(selectedRow);
    if (!isEmpty(data)) {
      setErrors(data);
    } else {
      dispatch(createOnelink(selectedRow));
      handleCreateClose();
      setSelectedRow({});
    }
  };

  const handleUpdateSaveRow = async () => {
    const data = createOnelinkValidation(selectedRow);
    if (!isEmpty(data)) {
      setErrors(data);
    } else {
      dispatch(updateOnelink(selectedRow));
      handleEditClose();
      setSelectedRow({});
    }
  };

  const handleDelete = async () => {
    window.analytics.track("Delete Onelink Button Clciked", {
      "page_name": 'manage_onelink',
      "url_path": window.location.host + '' + window.location.pathname,
      "full_url": window.location.href,
  });
    dispatch(deleteOnelink(selectedRow));
    handleDeleteClose();
    setSelectedRow({});
  };

  return (
    <>
      <div className="breadcum">
        <HomeIcon
          className="cp"
          sx={{ fontSize: 18, verticalAlign: "sub" }}
          onClick={() => navigate("/home")}
        />
        <span className="fs-14"> / Manage Links</span>
      </div>

      <Box className="onelink-container">
        <MaterialReactTable
          columns={columns}
          data={listOneLink}
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
              <Tooltip title="Download QR Code">
                <IconButton
                  onClick={() => {
                    setSelectedIndex(row?.row?.index);
                    setSelectedRow(row?.row?.original);
                    handleDownloadQrCode(row?.row?.original);
                  }}
                >
                  <QrCode2Sharp />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Onelink">
                <IconButton
                  onClick={() => {
                    setSelectedIndex(row?.row?.index);
                    setSelectedRow(row?.row?.original);
                    handleEditClickOpen(row?.row?.original);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Onelink">
                <IconButton
                  className="clr-danger"
                  onClick={() => {
                    setSelectedIndex(row?.row?.index);
                    setSelectedRow(row?.row?.original);
                    handleDeleteClickOpen();
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
        <Dialog
          open={editOpen}
          onClose={handleEditClose}
          maxWidth={"md"}
          fullWidth={true}
        >
          <DialogTitle>Edit Onelink</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              id="outlined-error-helper-text"
              label="Name"
              helperText={errors.name ? "namae is required" : ""}
              type="text"
              fullWidth
              error={errors.name}
              variant="standard"
              value={selectedRow.name}
              onChange={onHandleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              name="long_url"
              id="outlined-error-helper-text"
              label="Long URL"
              helperText={errors.long_url ? "URL is invalid, Please enter correct URL" : "Enter the Long URL"}
              type="text"
              fullWidth
              error={errors.long_url}
              variant="standard"
              value={selectedRow.long_url}
              onChange={onHandleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleUpdateSaveRow}>Save</Button>
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
              onClick={handleDelete}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={createOpen}
          onClose={handleCreateClose}
          maxWidth={"md"}
          fullWidth={true}
        >
          <DialogTitle>Create Onelink</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              id="outlined-error-helper-text-create-onelink-name"
              label="Name"
              helperText={errors.name ? "namae is required" : ""}
              type="text"
              fullWidth
              error={errors.name}
              variant="standard"
              value={selectedRow.name}
              onChange={onHandleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              name="long_url"
              id="outlined-error-helper-text-create-onelink-longurl"
              label="Long URL"
              helperText={errors.long_url ? "URL is invalid, Please enter correct URL" : "Enter the Long URL"}
              type="text"
              fullWidth
              error={errors.long_url}
              variant="standard"
              value={selectedRow.long_url}
              onChange={onHandleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateClose}>Cancel</Button>
            <Button onClick={handleCreateSaveRow}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ListOnelink;
