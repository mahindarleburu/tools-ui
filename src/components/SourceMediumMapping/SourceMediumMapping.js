import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  listSourceMediumSelector,
  listAllMedium,
  listAllSource,
  createMedium,
  createSource,
  createSourceMediumMapping,
  clearState,
} from "./SourceMediumMappingSlice";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { isEmpty } from "@firebase/util";
import ManageSourceMediums from "../ManageSourceMedium/ManageSourceMedium";
import "./source_medium.css"


const filter = createFilterOptions();

export default function SourceMediumMapping() {
  const [sourceValue, setSourceValue] = useState(null);
  const [mediumValue, setMediumValue] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const { isFetching, isSuccess, isError, errorMessage, listMedium, listSource, source, medium, source_medium_mapping_id } =
    useSelector(listSourceMediumSelector);
  const dispatch = useDispatch();
  const auth = getAuth();
  const user = auth.currentUser;
  const listSourceMedium = async (uid) => {
    dispatch(listAllMedium({ user_id: user.uid }));
    dispatch(listAllSource({ user_id: user.uid }));
  };
  useEffect(() => {
    listSourceMedium();
  }, []);

  const handleReset = () => {
    clearState();
    setSourceValue(null);
    setMediumValue(null);
    setErrors({});
    setCreateOpen(false);
  };
  useEffect(() => {
    if (source) {
      setSourceValue(source);
    }
    if (medium) {
      setMediumValue(medium);
    }
    if (source_medium_mapping_id) {
      handleReset();
    }
  }, [source, medium, source_medium_mapping_id]);

  const handleSourceMediumSubmit = (e) => {
    e.preventDefault();
    dispatch(createSourceMediumMapping({ utmSource: sourceValue, utmMedium: mediumValue }));
  };
  const handleCreateClickOpen = () => {
    setCreateOpen(true);
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <React.Fragment>
      <div className="create-btn">
        <Button
          className="btn-primary-theme position-right"
          variant="contained"
          onClick={handleCreateClickOpen}>
          Create Mapping
        </Button>
      </div>
      
      <Dialog
          fullWidth={true}
          maxWidth={"lg"}
        open={createOpen}
        onClose={handleCreateClickOpen}>
        <form onSubmit={handleSourceMediumSubmit}>
          <DialogTitle>Mapping</DialogTitle>
          <DialogContent>
            <DialogContentText>Did you miss any Source & Medium in our list? Please, Mapping it!</DialogContentText>

            <Grid container >
        <Grid xs={6}>
          <Item>
          <Autocomplete
              value={sourceValue}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  // timeout to avoid instant validation of the dialog's form.
                  setTimeout(() => {
                    setSourceValue({
                      display_name: newValue,
                    });
                  });
                } else if (newValue && newValue.inputValue) {
                  setSourceValue({
                    display_name: newValue.inputValue,
                  });
                } else {
                  setSourceValue(newValue);
                  // setSourceDialogValue(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    display_name: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              id="source-auto-complete-source"
              options={listSource}
              getOptionLabel={(option) => {
                // e.g value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.display_name;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => <li {...props}>{option.display_name}</li>}
              sx={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Source"
                  helperText={!sourceValue?.id && sourceValue !==null && "Your are about to add source" } 
                />
              )}
            />
          </Item>
        </Grid>
        <Grid xs={6}>
          <Item>
          <Autocomplete
              value={mediumValue}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  // timeout to avoid instant validation of the dialog's form.
                  setTimeout(() => {
                    setMediumValue({
                      display_name: newValue,
                    });
                  });
                } else if (newValue && newValue.inputValue) {
                  setMediumValue({
                    display_name: newValue.inputValue,
                  });
                } else {
                  setMediumValue(newValue);
                  // setMediumDialogValue(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    display_name: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              id="medium-auto-complete"
              options={listMedium}
              getOptionLabel={(option) => {
                // e.g value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.display_name;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => <li {...props}>{option.display_name}</li>}
              sx={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Medium"
                  helperText={!mediumValue?.id && mediumValue !==null && "Your are about to add medium" } 
                />
              )}
            />
          </Item>
        </Grid>
      </Grid>
          
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReset}>Cancel</Button>
            <Button
              type="submit"
              disabled={sourceValue === null || mediumValue === null}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ManageSourceMediums />
    </React.Fragment>
  );
}
