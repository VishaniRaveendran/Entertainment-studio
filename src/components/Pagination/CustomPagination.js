import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import './CustomPagination.css';

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: "#00d4ff" },
  },
});

const CustomPagination = ({ setPage, numOfPages = 10 }) => {
    const handlePageChange = (e, page) => {
        setPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="paginationWrap">
            <ThemeProvider theme={darkTheme}>
                <Pagination
                    count={Math.min(numOfPages || 1, 500)}
                    onChange={handlePageChange}
                    color="primary"
                    size="medium"
                    showFirstButton
                    showLastButton
                />
            </ThemeProvider>
        </div>
    );
};

export default CustomPagination
