import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

// Main functional component for displaying and managing charts
const ChartDisplay = ({
  chartType,
  data,
  groupBy,
  xAxis,
  yAxis,
  dimension,
  chartId,
  initialChartTitle,
  showAddButton = true,
  showDeleteButton = false,
  onUpdateTitle,
  onDeleteChart,
  customMaxDisplay
}) => {
  const chartRef = useRef();
  const [chartTitle, setChartTitle] = useState(
    initialChartTitle || "Cloud Provider Chart"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);
  const [addConfirmDialogOpen, setAddConfirmDialogOpen] = useState(false); 
  const [addSuccessDialogOpen, setAddSuccessDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedProviders, setSelectedProviders] = useState([]);
  const [availableProviders, setAvailableProviders] = useState([]);

  const userId = 1;  // Static user ID for backend API requests (to be replaced in production)
  // Handle title edit icon click
  const handleIconClick = () => {
    setIsEditing(true);
  };
  // Handle title editing completion
  const handleBlur = () => {
    setIsEditing(false);

    if (onUpdateTitle) {
      onUpdateTitle(chartTitle);
    } else {
      const updatedDashboardInfo = {
        x: 0, 
        y: 0,
        width: 6,
        height: 4,
      };

      const updatedChartInfo = {
        title: chartTitle,
        type: chartType,
        xAxis: xAxis || "time",
        yAxis: yAxis || "value",
        dimension: dimension || "Account",
        groupBy: groupBy,
        maxDisplay: customMaxDisplay || "All"
      };

      const updateBody = {
        dashboardInfo: updatedDashboardInfo,
        chartInfo: updatedChartInfo,
      };

      // API request to update chart information
      fetch(
        `http://localhost:8080/api/dashboard/${userId}/update/${chartId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBody),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Chart updated:", data);
        })
        .catch((error) => {
          console.error("Error updating chart:", error);
        });
    }
  };

   // Handles opening the Add chart confirmation dialog
  const handleAddChart = () => {
    setAddConfirmDialogOpen(true);
  };

  // Adds a new chart to the dashboard upon confirmation
  const handleAddConfirm = () => {
    setAddConfirmDialogOpen(false);
    const newChartId = chartId || "chart" + Date.now();  // Generate unique chart ID

    const newDashboardInfo = {
      id: newChartId,
      x: 0, 
      y: 0,
      width: 6,
      height: 4,
    };

    const newChartInfo = {
      title: chartTitle,
      type: chartType,
      xAxis: xAxis || "time",
      yAxis: yAxis || "value",
      dimension: dimension || "Account",
      groupBy: groupBy,
      maxDisplay: customMaxDisplay || "All"
    };

    const addBody = {
      dashboardInfo: newDashboardInfo,
      chartInfo: newChartInfo,
    };

    // API request to add a new chart
    fetch(`http://localhost:8080/api/dashboard/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Chart added:", data);
        setIconClicked(true);
        setAddSuccessDialogOpen(true); 
        setTimeout(() => {
          setIconClicked(false);
        }, 500);
      })
      .catch((error) => {
        console.error("Error adding chart:", error);
      });
  };

  const handleAddCancel = () => {
    setAddConfirmDialogOpen(false);
  };

  const handleAddSuccessDialogClose = () => {
    setAddSuccessDialogOpen(false);
  };

  // Handle chart deletion confirmation
  const handleDeleteIconClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    if (onDeleteChart) {
      onDeleteChart(chartId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Update available and selected providers when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const uniqueProviders = [
        ...new Set(
          data.map((item) => {
            const provider = item.provider || "Unknown";
            const [providerName] = provider.split("-", 1);
            return providerName;
          })
        ),
      ];
      setAvailableProviders(uniqueProviders);
      setSelectedProviders(uniqueProviders); 
    }
  }, [data]);

  const handleProviderToggle = (provider) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((item) => item !== provider)
        : [...prev, provider]
    );
  };

  const showCheckboxes = ["Service", "Account", "Region"].includes(dimension);

  // Filter data based on selected providers
  const filteredData = data.filter((item) => {
    const provider = item.provider || "Unknown";
    const [providerName] = provider.split("-", 1);
    return selectedProviders.includes(providerName);
  });

  // Set up and update the chart when filtered data or configuration changes
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      const chartInstance = echarts.init(chartRef.current);
      const options = getChartOptions(chartType, filteredData, chartTitle);
      if (options) {
        chartInstance.setOption(options);
      }

      return () => {
        chartInstance.dispose();
      };
    }
  }, [chartType, filteredData, chartTitle]);

  // Define chart options based on type
  const getChartOptions = (chartType, data, title) => {
    chartType = chartType.toLowerCase();   // Convert chart type to lowercase for consistency

    // Handle invalid or empty data by returning a default empty chart configuration
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data:", data);
      return {
        title: { text: title, left: "center" },
        tooltip: {},
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [],
      };
    }

    // Special handling for FinancialDomain bar charts
    if (dimension === "FinancialDomain" && chartType === "bar") {
      const allTimePeriods = [...new Set(data.map((item) => item.timePeriod))].sort();
    
      // Group data by domain (e.g., provider names)
      const dataByDomain = {};
      data.forEach((item) => {
        if (!dataByDomain[item.provider]) {
          dataByDomain[item.provider] = [];
        }
        dataByDomain[item.provider].push(item);
      });
    
      const domains = Object.keys(dataByDomain);
    
      // Calculate maximum values for budget and consumption to determine y-axis range
      const maxBudget = Math.max(...data.map((item) => item.budget));
      const maxConsumption = Math.max(...data.map((item) => item.totalConsumption));
      const yMax = Math.max(maxBudget, maxConsumption) * 1.2;
    
      const colors = ["#5470C6", "#91CC75", "#EE6666", "#FAC858", "#EE6666"]; 
    
      const series = [];
    
      // Generate series data for each domain
      domains.forEach((domain, index) => {
        const domainData = dataByDomain[domain];
        // Create maps for consumption and budget values for quick lookup
        const consumptionMap = new Map(
          domainData.map((item) => [item.timePeriod, item.totalConsumption])
        );
        const budgetMap = new Map(
          domainData.map((item) => [item.timePeriod, item.budget])
        );
    
        // Prepare data for stacked bar chart
        const consumptionValues = allTimePeriods.map(
          (time) => consumptionMap.get(time) || 0
        );
        const remainingBudgetValues = allTimePeriods.map((time) => {
          const budget = budgetMap.get(time) || 0;
          const consumption = consumptionMap.get(time) || 0;
          const remaining = budget - consumption;
          return remaining > 0 ? remaining : 0; // Only positive remaining budgets
        });
        const overConsumptionValues = allTimePeriods.map((time) => {
          const budget = budgetMap.get(time) || 0;
          const consumption = consumptionMap.get(time) || 0;
          const over = consumption - budget;
          return over > 0 ? over : 0; // Only positive over-consumption values
        });
    
        // Add series for consumption, remaining budget, and over-consumption
        series.push({
          name: `${domain} Consumption`,
          type: "bar",
          stack: domain, 
          data: consumptionValues,
          itemStyle: {
            color: colors[index % colors.length],
          },
        });
    
        series.push({
          name: `${domain} Remaining Budget`,
          type: "bar",
          stack: domain, 
          data: remainingBudgetValues,
          itemStyle: {
            color: colors[index % colors.length],
            opacity: 0.3,  
          }, // Semi-transparent
        });
    
        series.push({
          name: `${domain} Over Consumption`,
          type: "bar",
          stack: domain, 
          data: overConsumptionValues,
          itemStyle: {
            color: 'red', // Red for over-consumption
          },
        });
      });
    
      // Return configuration for the FinancialDomain bar chart
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            // Custom tooltip formatter for detailed display
            let tooltipText = `${params[0].axisValue}<br/>`;
            const domainInfo = {};
            params.forEach((param) => {
              const domainName = param.seriesName.split(' ')[0];
              if (!domainInfo[domainName]) {
                domainInfo[domainName] = {};
              }
              if (param.seriesName.includes('Consumption')) {
                domainInfo[domainName]['Consumption'] = param.value;
              } else if (param.seriesName.includes('Remaining Budget')) {
                domainInfo[domainName]['Remaining Budget'] = param.value;
              } else if (param.seriesName.includes('Over Consumption')) {
                domainInfo[domainName]['Over Consumption'] = param.value;
              }
            });
            // Construct tooltip content
            Object.keys(domainInfo).forEach((domain) => {
              tooltipText += `<strong>${domain}</strong><br/>`;
              Object.keys(domainInfo[domain]).forEach((key) => {
                tooltipText += `${key}: ${domainInfo[domain][key]}<br/>`;
              });
            });
            return tooltipText;
          },
        },
        legend: {
          data: [...new Set(series.map((s) => s.name))],
          top: "bottom",
        },
        grid: { left: "10%", right: "10%", bottom: "15%", containLabel: true },
        xAxis: {
          type: "category",
          data: allTimePeriods,
          name: "Time",
          axisTick: { alignWithLabel: true },
        },
        yAxis: {
          type: "value",
          name: "Value",
          max: yMax,
        },
        series: series,
      };
    }
    // Generic handling for other chart types
    const dataByProviderAndDimension = {};
    data.forEach((item) => {
      const key = item.provider || "Unknown";
      if (!dataByProviderAndDimension[key]) {
        dataByProviderAndDimension[key] = [];
      }
      dataByProviderAndDimension[key].push({
        timePeriod: item.timePeriod,
        totalConsumption: item.totalConsumption,
      });
    });

    const allTimePeriods = [
      ...new Set(data.map((item) => item.timePeriod)),
    ].sort();

    if (["line", "bar", "area"].includes(chartType)) {
      const seriesData = Object.keys(dataByProviderAndDimension).map((key) => {
        const providerData = dataByProviderAndDimension[key];
        const dataMap = new Map(
          providerData.map((item) => [item.timePeriod, item.totalConsumption])
        );
        const seriesValues = allTimePeriods.map(
          (time) => dataMap.get(time) || 0
        );

        return {
          name: key, 
          type: chartType === "area" ? "line" : chartType,
          areaStyle: chartType === "area" ? {} : undefined,
          data: seriesValues,
          smooth: ["line", "area"].includes(chartType),
          symbol: "circle",
          symbolSize: 8,
          connectNulls: true,
          stack: chartType === "bar" ? "total" : undefined,
        };
      });

      return {
        //title: { text: title, left: "center" },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { data: Object.keys(dataByProviderAndDimension), top: "bottom" },
        grid: { left: "10%", right: "10%", bottom: "15%", containLabel: true },
        xAxis: { type: "category", data: allTimePeriods, name: xAxis || "Time" },
        yAxis: { type: "value", name: yAxis || "Consumption" },
        series: seriesData,
      };
    } else if (chartType === "pie" || chartType === "treemap") {
      const totalConsumptionByKey = {};
      data.forEach((item) => {
        const key = item.provider || "Unknown";
        totalConsumptionByKey[key] =
          (totalConsumptionByKey[key] || 0) + item.totalConsumption;
      });

      const seriesData = Object.keys(totalConsumptionByKey).map((key) => ({
        name: key,
        value: totalConsumptionByKey[key],
      }));

      if (chartType === "pie") {
        return {
          //title: { text: title, left: "center" },
          tooltip: { trigger: "item" },
          legend: {
            orient: "vertical",
            left: "left",
            data: Object.keys(totalConsumptionByKey),
          },
          series: [
            {
              name: "Total Consumption",
              type: "pie",
              radius: "50%",
              data: seriesData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
      } else if (chartType === "treemap") {
        return {
          //title: { text: title, left: "center" },
          tooltip: { trigger: "item", formatter: "{b}: {c}" },
          series: [
            {
              name: "Total Consumption",
              type: "treemap",
              data: seriesData,
              label: {
                show: true,
                formatter: "{b}\n{c}",
              },
              roam: false,
            },
          ],
        };
      }
    } else {
      console.error("Unsupported chart type:", chartType);
      return null;
    }
  };

  // Render chart and control components
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Chart title with editing functionality */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
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
          readOnly={!isEditing}
          onBlur={handleBlur}
          onClick={() => setIsEditing(true)}
        />
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
      {/* Checkboxes for filtering providers */}
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
                    checked={selectedProviders.includes(provider)}
                    onChange={() => handleProviderToggle(provider)}
                  />
                }
                label={provider}
              />
            ))}
          </FormGroup>
        </div>
      )}
      {/* Chart container */}
      <div
        ref={chartRef}
        style={{ width: "100%", height: "400px", zIndex: 1 }}
      />
      {/* Dialogs for add and delete actions */}
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