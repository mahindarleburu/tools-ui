import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ManageSources from "../../ManageSource/ManageSource";
import ManageMediums from "../../ManageMedium/ManageMedium";
import SourceMediumMapping from "../../SourceMediumMapping/SourceMediumMapping";
import { useNavigate } from "react-router-dom";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const ManageUtm = (props) => {
  let navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%", marginTop:"10px", marginLeft: '20px', }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Mapping"
              {...a11yProps(0)}
            />
            <Tab
              label="Source"
              {...a11yProps(1)}
            />
            <Tab
              label="Medium"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
        <TabPanel
          value={value}
          index={0}>
          <SourceMediumMapping />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}>
          <ManageSources />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}>
          <ManageMediums />
        </TabPanel>
      </Box>
    </>
  );
};

export default ManageUtm;
