import {
  Container,
  IconButton, Table,
  TableBody,
  TableCell, TableHead,
  TableRow
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import * as React from "react";
import HTTPClient, {
  ADMIN_USERS_URL,
  UPDATE_USER_STATUS
} from "../../../api/api";

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const getUsers = () => {
    HTTPClient.get(ADMIN_USERS_URL)
      .then((response) => {
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

  return (
    <div>
      <Container maxWidth="sm">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status(approved/unapproved)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => {
                const isChecked = user.approved;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName + " " + user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "SELLER"
                        ? "Seller"
                        : user.role === "USER"
                        ? "User"
                        : "Admin"}
                    </TableCell>
                    <TableCell>
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
      </Container>
    </div>
  );
}
