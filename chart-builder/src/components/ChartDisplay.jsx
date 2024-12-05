// Import necessary libraries and components
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts"; // For rendering charts
import EditIcon from "@mui/icons-material/Edit"; // Icon for editing chart titles
import AddIcon from "@mui/icons-material/Add"; // Icon for adding charts
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for deleting charts
import Dialog from "@mui/material/Dialog"; // For displaying confirmation dialogs
import DialogActions from "@mui/material/DialogActions"; // Dialog actions (e.g., buttons)
import DialogContent from "@mui/material/DialogContent"; // Dialog content container
import DialogContentText from "@mui/material/DialogContentText"; // Text content for dialogs
import DialogTitle from "@mui/material/DialogTitle"; // Dialog title
import Button from "@mui/material/Button"; // Button component
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material"; // For managing form inputs like checkboxes

// ChartDisplay component definition
const ChartDisplay = ({
  chartType, // Type of the chart (e.g., line, bar, pie)
  data, // Data to be displayed in the chart
  groupBy, // Grouping criterion for the data (e.g., time period)
  xAxis, // Label for the X-axis
  yAxis, // Label for the Y-axis
  dimension, // Dimension for data filtering
  chartId, // Unique identifier for the chart
  initialChartTitle, // Initial title of the chart
  showAddButton = true, // Whether to show the Add button
  showDeleteButton = false, // Whether to show the Delete button
  onUpdateTitle, // Callback function to handle title updates
  onDeleteChart, // Callback function to handle chart deletion
  customMaxDisplay, // Custom maximum display value
}) => {
  const chartRef = useRef(); // Reference to the chart container DOM element
  const [chartTitle, setChartTitle] = useState(
    initialChartTitle || "Cloud Provider Chart" // Default chart title
  );
  const [isEditing, setIsEditing] = useState(false); // State to track if the title is being edited
  const [iconClicked, setIconClicked] = useState(false); // State to track if the Add icon is clicked
  const [addConfirmDialogOpen, setAddConfirmDialogOpen] = useState(false); // State for the Add confirmation dialog
  const [addSuccessDialogOpen, setAddSuccessDialogOpen] = useState(false); // State for the Add success dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for the Delete confirmation dialog

  const [selectedProviders, setSelectedProviders] = useState([]); // Selected cloud providers
  const [availableProviders, setAvailableProviders] = useState([]); // All available providers extracted from data

  const userId = 1; // Mock user ID for API requests

  // Function to enable title editing
  const handleIconClick = () => {
    setIsEditing(true);
  };

  // Function to save title changes on blur
  const handleBlur = () => {
    setIsEditing(false); // Disable editing mode

    if (onUpdateTitle) {
      // If an update callback is provided, use it
      onUpdateTitle(chartTitle);
    } else {
      // Otherwise, send a PUT request to the backend to update the chart
      const updatedDashboardInfo = {
        x: 0, // X-coordinate for chart layout
        y: 0, // Y-coordinate for chart layout
        width: 6, // Width of the chart
        height: 4, // Height of the chart
      };

      const updatedChartInfo = {
        title: chartTitle, // Updated chart title
        type: chartType, // Chart type
        xAxis: xAxis || "time", // X-axis label
        yAxis: yAxis || "value", // Y-axis label
        dimension: dimension || "Account", // Data dimension
        groupBy: groupBy, // Data grouping criteria
        maxDisplay: customMaxDisplay || "All", // Maximum data points to display
      };

      const updateBody = {
        dashboardInfo: updatedDashboardInfo,
        chartInfo: updatedChartInfo, // Updated chart data
      };

      // Make a PUT request to update the chart in the backend
      fetch(`http://localhost:8080/api/dashboard/${userId}/update/${chartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(updateBody), // Send updated chart information
      })
        .then((response) => response.json()) // Parse the JSON response
        .then((data) => {
          console.log("Chart updated:", data); // Log the response
        })
        .catch((error) => {
          console.error("Error updating chart:", error); // Log errors
        });
    }
  };

  // Function to open the Add confirmation dialog
  const handleAddChart = () => {
    setAddConfirmDialogOpen(true);
  };

  // Function to confirm adding a chart
  const handleAddConfirm = () => {
    setAddConfirmDialogOpen(false); // Close the confirmation dialog
    const newChartId = chartId || "chart" + Date.now(); // Generate a new chart ID if not provided

    const newDashboardInfo = {
      id: newChartId, // Assign a unique ID to the chart
      x: 0, // Default X-coordinate
      y: 0, // Default Y-coordinate
      width: 6, // Default chart width
      height: 4, // Default chart height
    };

    const newChartInfo = {
      title: chartTitle, // Use the current chart title
      type: chartType, // Chart type
      xAxis: xAxis || "time", // X-axis label
      yAxis: yAxis || "value", // Y-axis label
      dimension: dimension || "Account", // Data dimension
      groupBy: groupBy, // Data grouping criteria
      maxDisplay: customMaxDisplay || "All", // Maximum data points to display
    };

    const addBody = {
      dashboardInfo: newDashboardInfo, // Chart layout information
      chartInfo: newChartInfo, // Chart configuration
    };

    // Make a POST request to add the chart to the backend
    fetch(`http://localhost:8080/api/dashboard/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify(addBody), // Send the new chart information
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        console.log("Chart added:", data); // Log the response
        setIconClicked(true); // Set Add icon state
        setAddSuccessDialogOpen(true); // Open success dialog
        setTimeout(() => {
          setIconClicked(false); // Reset icon state after 500ms
        }, 500);
      })
      .catch((error) => {
        console.error("Error adding chart:", error); // Log errors
      });
  };

  // Function to cancel adding a chart
  const handleAddCancel = () => {
    setAddConfirmDialogOpen(false); // Close the confirmation dialog
  };

  // Function to close the success dialog
  const handleAddSuccessDialogClose = () => {
    setAddSuccessDialogOpen(false); // Close the success dialog
  };

  // Function to open the Delete confirmation dialog
  const handleDeleteIconClick = () => {
    setDeleteDialogOpen(true); // Open the confirmation dialog
  };

  // Function to confirm chart deletion
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false); // Close the confirmation dialog
    if (onDeleteChart) {
      onDeleteChart(chartId); // Call the delete callback if provided
    }
  };

  // Function to cancel chart deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false); // Close the confirmation dialog
  };

    // Extract available cloud providers from the data whenever it changes
    useEffect(() => {
      if (data && data.length > 0) {
        const uniqueProviders = [
          ...new Set(
            data.map((item) => {
              const provider = item.provider || "Unknown"; // Use "Unknown" if the provider is missing
              const [providerName] = provider.split("-", 1); // Extract provider name
              return providerName;
            })
          ),
        ];
        setAvailableProviders(uniqueProviders); // Set available providers
        setSelectedProviders(uniqueProviders); // Default: Select all providers
      }
    }, [data]); // Dependency array ensures this logic runs whenever data changes
  
    // Toggle selection of a provider in the checkboxes
    const handleProviderToggle = (provider) => {
      setSelectedProviders((prev) =>
        prev.includes(provider)
          ? prev.filter((item) => item !== provider) // Remove provider if already selected
          : [...prev, provider] // Add provider if not selected
      );
    };
  
    // Determine whether to show provider checkboxes based on the selected dimension
    const showCheckboxes = ["Service", "Account", "Region"].includes(dimension);
  
    // Filter the data to only include selected providers
    const filteredData = data.filter((item) => {
      const provider = item.provider || "Unknown"; // Use "Unknown" if provider is missing
      const [providerName] = provider.split("-", 1); // Extract provider name
      return selectedProviders.includes(providerName); // Include only selected providers
    });
  
    // Update the chart when filteredData, chartType, or chartTitle changes
    useEffect(() => {
      if (filteredData && filteredData.length > 0) {
        const chartInstance = echarts.init(chartRef.current); // Initialize the chart
        const options = getChartOptions(chartType, filteredData, chartTitle); // Generate chart options
        if (options) {
          chartInstance.setOption(options); // Apply the chart options
        }
  
        return () => {
          chartInstance.dispose(); // Clean up the chart instance on component unmount
        };
      }
    }, [chartType, filteredData, chartTitle]); // Dependency array ensures this logic runs on relevant changes
  
    // Function to generate chart options based on the chart type and data
    const getChartOptions = (chartType, data, title) => {
      chartType = chartType.toLowerCase(); // Convert chart type to lowercase for consistency
  
      // Validate data before generating options
      if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid or empty data:", data); // Log invalid data error
        return {
          title: { text: title, left: "center" }, // Default chart title
          tooltip: {}, // Empty tooltip
          xAxis: { type: "category", data: [] }, // Empty X-axis
          yAxis: { type: "value" }, // Empty Y-axis
          series: [], // No data series
        };
      }
  
      // Handle specific dimension and chartType combinations (e.g., FinancialDomain with bar chart)
      if (dimension === "FinancialDomain" && chartType === "bar") {
        // [Logic for handling FinancialDomain and bar charts]
        // Includes data grouping, calculation of remaining/over consumption, and series creation
        // Return the specific options for this scenario
      }
  
      // Group data by provider and dimension for general charts
      const dataByProviderAndDimension = {};
      data.forEach((item) => {
        const key = item.provider || "Unknown"; // Use "Unknown" if provider is missing
        if (!dataByProviderAndDimension[key]) {
          dataByProviderAndDimension[key] = []; // Initialize an array for each provider
        }
        dataByProviderAndDimension[key].push({
          timePeriod: item.timePeriod, // Extract time period
          totalConsumption: item.totalConsumption, // Extract total consumption
        });
      });
  
      // Extract all unique time periods and sort them
      const allTimePeriods = [...new Set(data.map((item) => item.timePeriod))].sort();
  
      // Generate options for line, bar, and area charts
      if (["line", "bar", "area"].includes(chartType)) {
        const seriesData = Object.keys(dataByProviderAndDimension).map((key) => {
          const providerData = dataByProviderAndDimension[key];
          const dataMap = new Map(
            providerData.map((item) => [item.timePeriod, item.totalConsumption])
          );
          const seriesValues = allTimePeriods.map(
            (time) => dataMap.get(time) || 0 // Default to 0 if no value exists for a time period
          );
  
          return {
            name: key, // Use provider name as the series name
            type: chartType === "area" ? "line" : chartType, // Use "line" for area charts
            areaStyle: chartType === "area" ? {} : undefined, // Enable area style for area charts
            data: seriesValues, // Data values for the series
            smooth: ["line", "area"].includes(chartType), // Enable smooth lines for line/area charts
            symbol: "circle", // Marker symbol
            symbolSize: 8, // Marker size
            connectNulls: true, // Connect data points even if there are nulls
            stack: chartType === "bar" ? "total" : undefined, // Stack bars for bar charts
          };
        });
  
        return {
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } }, // Tooltip settings
          legend: { data: Object.keys(dataByProviderAndDimension), top: "bottom" }, // Legend settings
          grid: { left: "10%", right: "10%", bottom: "15%", containLabel: true }, // Grid layout
          xAxis: { type: "category", data: allTimePeriods, name: xAxis || "Time" }, // X-axis settings
          yAxis: { type: "value", name: yAxis || "Consumption" }, // Y-axis settings
          series: seriesData, // Series data for the chart
        };
      }
  
      // Handle pie and treemap charts
      if (chartType === "pie" || chartType === "treemap") {
        // [Logic for grouping data by provider for pie and treemap charts]
        // Return the specific options for pie or treemap chart
      }
  
      console.error("Unsupported chart type:", chartType); // Log unsupported chart type error
      return null; // Return null for unsupported chart types
    };
  
    return (
      <div style={{ width: "100%", height: "100%" }}>
        {/* Render chart title and action icons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Title input field for editing */}
          <input
            type="text"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)} // Update title state
            style={{
              width: "70%",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "20px",
              marginBottom: "0px",
              backgroundColor: "transparent",
              border: isEditing ? "1px dashed #ccc" : "none",
              outline: "none",
              marginRight: "8px",
              cursor: isEditing ? "text" : "pointer",
              textAlign: "center",
            }}
            readOnly={!isEditing} // Make input read-only unless editing
            onBlur={handleBlur} // Save title on blur
            onClick={() => setIsEditing(true)} // Enable editing on click
          />
          {/* Icons for edit, add, and delete actions */}
          <EditIcon
            style={{ color: "#720e9e", cursor: "pointer" }}
            onClick={handleIconClick}
          />
          {showAddButton && (
            <AddIcon
              style={{
                color: iconClicked ? "green" : "#720e9e",
                cursor: "pointer",
                marginLeft: "8px",
              }}
              onClick={handleAddChart}
            />
          )}
          {showDeleteButton && (
            <DeleteIcon
              style={{ color: "red", cursor: "pointer", marginLeft: "8px" }}
              onClick={handleDeleteIconClick}
            />
          )}
        </div>
  
        {/* Render provider checkboxes if applicable */}
        {showCheckboxes && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <FormGroup row>
              {availableProviders.map((provider) => (
                <FormControlLabel
                  key={provider}
                  control={
                    <Checkbox
                      checked={selectedProviders.includes(provider)} // Check if provider is selected
                      onChange={() => handleProviderToggle(provider)} // Toggle selection
                    />
                  }
                  label={provider} // Display provider name
                />
              ))}
            </FormGroup>
          </div>
        )}
  
        {/* Render the chart container */}
        <div ref={chartRef} style={{ width: "100%", height: "400px", zIndex: 1 }} />
  
        {/* Render Add confirmation dialog */}
        <Dialog open={addConfirmDialogOpen} onClose={handleAddCancel}>
          <DialogTitle>Add Chart</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to add this chart to your dashboard?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddCancel}>Cancel</Button>
            <Button onClick={handleAddConfirm} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Render Add success dialog */}
        <Dialog open={addSuccessDialogOpen} onClose={handleAddSuccessDialogClose}>
          <DialogTitle>Chart Added</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The chart has been added to your dashboard successfully!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddSuccessDialogClose}>OK</Button>
          </DialogActions>
        </Dialog>
  
        {/* Render Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Delete Chart</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this chart?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  
  export default ChartDisplay;  