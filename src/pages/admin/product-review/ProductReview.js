import { Box, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import * as React from "react";


export default function ProductReview() {
    const [data, setData] = React.useState([
        { name: "Laptop", comment: "This is not good", status: false },
        { name: "Desktop", comment: "This is not good", status: false },
        { name: "TV", comment: "This is not good", status: false },
    ]);
    console.log(data);

    return <div>
        <Container maxWidth="sm">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Comment</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data &&
                        data.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.comment}</TableCell>
                                <TableCell><IconButton>{item.status ? <Check /> : <Close />}</IconButton></TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Container>
    </div>

}
