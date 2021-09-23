import React from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

export default function KusthaRogCard() {
  return (
    <>
      <Box mt={3} mb={1}>
        <TableContainer>
          <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Kustha Rog Card">
            <TableHead classes={{ root: "align-center" }}>
              <TableRow>
                <TableCell>कुष्ठरोग सेवा दर्ता नं.</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
      <TableContainer>
        <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Kustha Rog Card">
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
