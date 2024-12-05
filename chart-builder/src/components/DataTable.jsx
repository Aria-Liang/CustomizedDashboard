import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
} from '@mui/material';

function DataTable({ data, dimension }) {
  const [page, setPage] = useState(0); // Current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
  const [order, setOrder] = useState('asc'); // Sorting order ('asc' or 'desc')
  const [orderBy, setOrderBy] = useState('timePeriod'); // Column to sort by

  // Parse quarter strings (e.g., "2023-Q1") into Date objects
  const parseQuarterToDate = (quarterString) => {
    const [year, quarter] = quarterString.split('-Q');
    if (year && quarter) {
      const month = (parseInt(quarter, 10) - 1) * 3;
      return new Date(parseInt(year, 10), month, 1);
    }
    return null;
  };

  // Sorting logic
  const sortedData = useMemo(() => {
    const comparator = (a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === 'totalConsumption') {
        // Sort numeric values for total consumption
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (orderBy === 'timePeriod') {
        // Sort date values for time period
        const aDate = parseQuarterToDate(aValue) || new Date(aValue);
        const bDate = parseQuarterToDate(bValue) || new Date(bValue);
        return order === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        // Sort alphabetically for other fields
        aValue = aValue ? aValue.toString().toLowerCase() : '';
        bValue = bValue ? bValue.toString().toLowerCase() : '';
        return aValue < bValue
          ? order === 'asc'
            ? -1
            : 1
          : aValue > bValue
          ? order === 'asc'
            ? 1
            : -1
          : 0;
      }
    };
    return data.slice().sort(comparator); // Return sorted data
  }, [data, order, orderBy]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Handle sorting request
  const handleRequestSort = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc'); // Toggle sorting order
    setOrderBy(property); // Set the column to sort by
  };

  // Paginate the sorted data
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        background: 'white', // Background color for the table
        padding: '20px', // Padding around the table
        borderRadius: '10px', // Rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for elevation
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {/* First column: Time Period */}
            <TableCell align="center">
              <TableSortLabel
                active={orderBy === 'timePeriod'}
                direction={order}
                onClick={handleRequestSort('timePeriod')}
              >
                Time Period
              </TableSortLabel>
            </TableCell>

            {/* Second column: Dynamic Dimension */}
            <TableCell align="center">
              <TableSortLabel
                active={orderBy === dimension}
                direction={order}
                onClick={handleRequestSort('provider')}
              >
                {dimension}
              </TableSortLabel>
            </TableCell>

            {/* Third column: Total Consumption */}
            <TableCell align="center">
              <TableSortLabel
                active={orderBy === 'totalConsumption'}
                direction={order}
                onClick={handleRequestSort('totalConsumption')}
              >
                Total Consumption
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render rows of paginated data */}
          {paginatedData.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.timePeriod}</TableCell>
              <TableCell align="center">{row.provider}</TableCell>
              <TableCell align="center">{row.totalConsumption}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div" // Pagination controls
        count={data.length} // Total rows
        page={page} // Current page
        onPageChange={handleChangePage} // Page change handler
        rowsPerPage={rowsPerPage} // Rows per page
        onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
        rowsPerPageOptions={[5, 10, 15]} // Options for rows per page
      />
    </Box>
  );
}

export default DataTable;
