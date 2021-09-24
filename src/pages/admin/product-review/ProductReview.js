import {
  Box,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import * as React from "react";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";

export default function ProductReview() {
  const [data, setData] = React.useState([
    { name: "Laptop", comment: "This is not good", status: false },
    { name: "Desktop", comment: "This is not good", status: false },
    { name: "TV", comment: "This is not good", status: false },
  ]);
  console.log(data);

  const handleApproveClicked = (productId, reviewId, status) => {
    let data = {
      productId,
      reviewId,
      status,
    };
    HTTPClient.post(PRODUCT_URL + "/update-review-status", data)
      .then((response) => {
        getReviewData();
      })
      .catch((error) => {});
  };

  React.useEffect(() => {
    getReviewData();
  }, []);

  const getReviewData = () => {
    HTTPClient.get(PRODUCT_URL + "/pending-review").then((resp) => {
      console.log(resp);
      const datas = [];
      resp.data.map((item) => {
        item.reviews.map((review) => {
          let data = {
            productId: item.id,
            name: item.title,
            comment: review.reviewText,
            status: review.approveStatus,
            reviewId: review.id,
          };
          datas.push(data);
        });
      });
      setData(datas);
    });
  };

  return (
    <div>
      <Container maxWidth="sm">
        <h3> Products Comment</h3>
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
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        handleApproveClicked(
                          item.productId,
                          item.reviewId,
                          !item.status
                        )
                      }
                    >
                      {item.status ? <Check /> : <Close />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    </div>
  );
}
