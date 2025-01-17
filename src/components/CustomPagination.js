import React from 'react';
import {
  Box,
  TablePagination,
  IconButton,
  useTheme,
  styled
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  '.MuiTablePagination-select': {
    minHeight: 'auto',
    borderRadius: theme.shape.borderRadius,
    '&:focus': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '.MuiTablePagination-selectIcon': {
    color: theme.palette.primary.main,
  },
  '.MuiTablePagination-displayedRows': {
    margin: 0,
    [theme.breakpoints.up('sm')]: {
      margin: '0 auto',
    },
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        sx={{ 
          color: theme.palette.primary.main,
          '&.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
        }}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        sx={{ 
          color: theme.palette.primary.main,
          '&.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        sx={{ 
          color: theme.palette.primary.main,
          '&.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
        }}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        sx={{ 
          color: theme.palette.primary.main,
          '&.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
        }}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

function CustomPagination({ 
  count, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25]
}) {
  return (
    <Box sx={{ 
      padding: 2,
      borderTop: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}>
      <StyledTablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        ActionsComponent={TablePaginationActions}
        sx={{
          '.MuiToolbar-root': {
            paddingLeft: 2,
            paddingRight: 2,
          },
        }}
      />
    </Box>
  );
}

export default CustomPagination; 