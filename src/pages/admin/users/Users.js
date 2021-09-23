import { Box, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import * as React from "react";
import HTTPClient, { ADMIN_USERS_URL, UPDATE_USER_STATUS } from "../../../api/api";


export default function Users() {
    const [users, setUsers] = React.useState([]);
    const getUsers = () => {
        HTTPClient.get(ADMIN_USERS_URL)
            .then((response) => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch((err) => console.log(err.message));
    };
    React.useEffect(() => {
        getUsers();
    }, []);

    const approvalHandler = (id, status) => {
        let data = {
            id: id,
            approved: status,
        };

        HTTPClient.post(UPDATE_USER_STATUS, data)
            .then((response) => {
                getUsers();
            })
            .catch((err) => console.log(err.message));
    };

    return <div>
        <Container maxWidth="sm">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Full Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Role</TableCell>
                            <TableCell align="right">Status(approved/unapproved)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users &&
                            users.map((user) => {
                                const isChecked = user.approved;
                                return (
                                    <TableRow
                                        key={user.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.firstName + " " + user.lastName}
                                        </TableCell>
                                        <TableCell align="right">{user.email}</TableCell>
                                        <TableCell align="right">
                                            {user.role === "SELLER"
                                                ? "Seller"
                                                : user.role === "USER"
                                                    ? "User"
                                                    : "Admin"}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => approvalHandler(user.id, !user.approved)}
                                            >
                                                {isChecked ? <Check /> : <Close />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </div>

}
