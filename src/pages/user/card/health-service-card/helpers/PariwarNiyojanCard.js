import React from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

export default function PariwarNiyojanCard() {
  return (
    <>
      <Box mt={3} mb={1}>
        <Grid container spacing={2}>
          <Grid item xs>
            <TableContainer>
              <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Pariwar Niyojan Card">
                <TableHead>
                  <TableRow>
                    <TableCell>परिवार नियोजन <span contentEditable={true}>...............................................</span></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs>
            <TableContainer>
              <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Pariwar Niyojan Card">
                <TableHead classes={{ root: "align-center" }}>
                  <TableRow>
                    <TableCell>दर्ता नं.</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
      <TableContainer>
        <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Pariwar Niyojan Card">
          <TableHead classes={{ root: "align-center" }}>
            <TableRow>
              <TableCell>मिति</TableCell>
              <TableCell>जाँच परीक्षण</TableCell>
              <TableCell>उपचार सल्लाह</TableCell>
              <TableCell>फर्केर आउने मिति</TableCell>
              <TableCell>सेवाप्रदायकको सही</TableCell>
            </TableRow>
          </TableHead>
          <TableBody classes={{ root: "align-center" }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
