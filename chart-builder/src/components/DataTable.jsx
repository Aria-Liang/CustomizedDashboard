// src/components/DataTable.jsx

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

function DataTable({ data }) {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for sorting
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('timePeriod');

  // Helper function to parse quarter strings into Date objects
  const parseQuarterToDate = (quarterString) => {
    const [year, quarter] = quarterString.split('-Q');
    if (year && quarter) {
      const month = (parseInt(quarter, 10) - 1) * 3;
      return new Date(parseInt(year, 10), month, 1);
    }
    return null;
  };

  // Apply sorting
  const sortedData = useMemo(() => {
    const comparator = (a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === 'totalConsumption') {
        // Numeric comparison
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (orderBy === 'timePeriod') {
        // Date comparison
        const aDate = parseQuarterToDate(aValue) || new Date(aValue);
        const bDate = parseQuarterToDate(bValue) || new Date(bValue);
        return order === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        // String comparison
        aValue = aValue ? aValue.toString().toLowerCase() : '';
        bValue = bValue ? bValue.toString().toLowerCase() : '';
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      }
    };
    return data.slice().sort(comparator);
  }, [data, order, orderBy]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sorting
  const handleRequestSort = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Paginate sorted data
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        background: 'white',
        paddingInline: '20px',
        borderRadius: '20px',
        paddingTop: '20px',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#720e9e' }}>
            {/* Time Period Column with Sorting */}
            <TableCell
              align="center"
              sortDirection={orderBy === 'timePeriod' ? order : false}
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              <TableSortLabel
                active={orderBy === 'timePeriod'}
                direction={orderBy === 'timePeriod' ? order : 'asc'}
                onClick={handleRequestSort('timePeriod')}
                hideSortIcon={false} // Ensure the sort icon is always visible
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'white',
                  },
                  '&.Mui-active': {
                    color: 'white',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                  },
                }}
              >
                Time Period
              </TableSortLabel>
            </TableCell>

            {/* Provider Column with Sorting */}
            <TableCell
              align="center"
              sortDirection={orderBy === 'provider' ? order : false}
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              <TableSortLabel
                active={orderBy === 'provider'}
                direction={orderBy === 'provider' ? order : 'asc'}
                onClick={handleRequestSort('provider')}
                hideSortIcon={false}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'white',
                  },
                  '&.Mui-active': {
                    color: 'white',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                  },
                }}
              >
                Provider
              </TableSortLabel>
            </TableCell>

            {/* Total Consumption Column with Sorting */}
            <TableCell
              align="center"
              sortDirection={orderBy === 'totalConsumption' ? order : false}
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              <TableSortLabel
                active={orderBy === 'totalConsumption'}
                direction={orderBy === 'totalConsumption' ? order : 'asc'}
                onClick={handleRequestSort('totalConsumption')}
                hideSortIcon={false}
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'white',
                  },
                  '&.Mui-active': {
                    color: 'white',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                  },
                }}
              >
                Total Consumption
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell align="center">{entry.timePeriod}</TableCell>
              <TableCell align="center">{entry.provider}</TableCell>
              <TableCell align="center">{entry.totalConsumption}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
}

export default DataTable;
