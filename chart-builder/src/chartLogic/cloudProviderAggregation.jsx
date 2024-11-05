// src/chartLogic/cloudProviderAggregation.jsx

import * as d3 from 'd3';

// Helper function to parse quarter strings into Date objects for proper sorting
const parseQuarterToDate = (quarterString) => {
  const [year, quarter] = quarterString.split('-Q');
  if (year && quarter) {
    const month = (parseInt(quarter, 10) - 1) * 3; // Convert quarter to starting month (0-11)
    return new Date(parseInt(year, 10), month, 1); // Create date object for the start of the quarter
  }
  return new Date(); // Return current date as a fallback
};

// Function to aggregate data by cloud provider based on a specified time grouping
export const aggregateDataByCloudProvider = (
  data,
  groupBy,
  fromDate,
  toDate
) => {
  // Filter data based on the date range
  const filteredData = data.filter((d) => {
    const date = new Date(d.date);
    return date >= fromDate && date <= toDate;
  });

  // Group data by cloud provider
  const groupedData = d3.group(filteredData, (d) => d.providerName);

  // Aggregate data based on the selected groupBy option (day, month, quarter, year)
  const aggregatedData = Array.from(groupedData, ([provider, values]) => {
    const nestedData = d3.group(values, (d) => {
      const date = new Date(d.date);
      switch (groupBy) {
        case 'day':
          return date.toISOString().split('T')[0]; // YYYY-MM-DD
        case 'month':
          return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`; // YYYY-MM
        case 'quarter':
          return `${date.getFullYear()}-Q${
            Math.floor(date.getMonth() / 3) + 1
          }`; // YYYY-QN
        case 'year':
          return `${date.getFullYear()}`; // YYYY
        default:
          return date.toISOString().split('T')[0]; // Default to day
      }
    });

    // Sum consumption for each time period
    const aggregatedValues = Array.from(nestedData, ([timePeriod, dataPoints]) => {
      const totalConsumption = d3.sum(dataPoints, (d) => d.consumption);
      return {
        timePeriod,
        totalConsumption: isNaN(totalConsumption) ? 0 : totalConsumption, // Ensure valid value
      };
    });

    // Sort the aggregated values with custom parsing for quarters
    return {
      provider,
      aggregatedValues: aggregatedValues
        .map((d) => ({
          ...d,
          parsedDate:
            groupBy === 'quarter'
              ? parseQuarterToDate(d.timePeriod)
              : new Date(d.timePeriod),
        }))
        .sort((a, b) => a.parsedDate - b.parsedDate)
        .map((d) => {
          delete d.parsedDate; // Remove the auxiliary field to keep data clean
          return d;
        }),
    };
  });

  // Commented out to prevent continuous logging
  // console.log(aggregatedData);
  return aggregatedData;
};
