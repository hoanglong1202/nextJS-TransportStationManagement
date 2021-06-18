import React, { useState, useEffect } from "react";
import { AdminMenu } from "../../../../../database/AdminMenu";
import Review from "../../../../../components/Review";
import { secret } from "../../../../../../api/secret";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import Title from "../../../../../components/Title";
import Router from "next/router";
import { Field, Form, Formik, FieldArray } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { mixed, number, object, array, string } from "yup";

import axios from "axios";
import { verify } from "jsonwebtoken";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  makeStyles,
  Select,
  FormControl,
  Paper,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  noWrap: {
    [theme.breakpoints.up("sm")]: {
      flexWrap: "nowrap",
    },
  },
  grid: {
    margin: "auto",
    marginTop: 20,
    padding: 20,
    maxWidth: 700,
  },
  gridButton: {
    marginTop: 15,
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  listItemLabel: {
    width: "30%",
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  listContainer: {
    margin: "auto",
    maxWidth: 600,
  },
}));

const breadcumbData = [
  {
    path: "/admin",
    pathName: "Home",
  },
  {
    path: "/admin/accounts",
    pathName: "Quản lý tài khoản",
  },
  {
    pathName: "Cập nhập thông tin",
  },
];
const sleep = (time) => new Promise((acc) => setTimeout(acc, time));

export default function UserDetail({ user, vehicle }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const handleMenuClick = (event, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 130, editable: true },
    { field: "tenXe", headerName: "Tên xe", width: 150, editable: true },
    {
      field: "soChoNgoi",
      headerName: "Số chỗ ngồi",
      type: "number",
      width: 130,
      editable: true,
    },
    {
      field: "noiDangKy",
      headerName: "Nơi đăng ký",
      width: 150,
      editable: true,
    },
    {
      field: "Action",
      headerName: " ",
      sortable: false,
      width: 130,
      renderCell: (params: GridCellParams) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            aria-controls="usersMenu"
            aria-haspopup="true"
            onClick={(event) => {
              handleMenuClick(event, params.row.id);
            }}
          >
            Action
          </Button>
          <Menu
            elevation={1}
            id="usersMenu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link
                href={`/admin/accounts/details/update/vehicle?id=${user[0].id}&vehicleId=${selectedVehicle}`}
              >
                <div style={{ textDecoration: "none", font: "#000000DE" }}>
                  Sửa thông tin
                </div>
              </Link>
            </MenuItem>
            <MenuItem
            // onClick={setDeleteAlertStatus}
            >
              Xóa xe
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Close</MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs breadcumbData={breadcumbData} />
      <Paper elevation={2} className={classes.grid}>
        <Title>Thông tin người dùng</Title>
        <Formik
          initialValues={{
            UsersName: user[0].UsersName,
            Email: user[0].Email,
            TelNo: user[0].TelNo,
            Gender: user[0].Gender || "Male",
            Address: user[0].Address,
            HomeTown: user[0].HomeTown,
            vehicles: vehicle,
          }}
          onSubmit={async (values, helpers) => {
            await sleep(3000);
            console.log("submiting");
            console.log(values);
            helpers.setTouched({});
          }}
          validationSchema={object({
            UsersName: string().required("Cần nhập tên người dùng"),
            Email: string().email().required("Cần nhập email"),
            TelNo: string().required("Cần nhập số điện thoại"),
            Gender: string(),
            Address: string().required("Cần nhập địa chỉ"),
            HomeTown: string().required("Cần nhập quê quán"),
          })}
        >
          {({ values, errors, isSubmitting }) => (
            <Form autoComplete="off">
              <List disablePadding className={classes.listContainer}>
                <ListItem className={classes.listItem}>
                  <ListItemText primary="Tên người dùng" />
                  <Field
                    name="UsersName"
                    component={TextField}
                    label="Tên người dùng"
                  />
                </ListItem>

                <ListItem className={classes.listItem}>
                  <ListItemText primary="Email" />
                  <Field name="Email" component={TextField} label="Email" />
                </ListItem>

                <ListItem className={classes.listItem}>
                  <ListItemText primary="Số điện thoại" />
                  <Field
                    name="TelNo"
                    component={TextField}
                    label="Số điện thoại"
                  />
                </ListItem>

                <ListItem className={classes.listItem}>
                  <ListItemText primary="Giới tính" />
                  <FormControl className={classes.listItemLabel}>
                    <Field as={Select} name="Gender" label="Giới tính">
                      <MenuItem value="Male">Nam</MenuItem>
                      <MenuItem value="Female">Nữ</MenuItem>
                    </Field>
                  </FormControl>
                </ListItem>

                <ListItem className={classes.listItem}>
                  <ListItemText primary="Địa chỉ" />
                  <Field name="Address" component={TextField} label="Địa chỉ" />
                </ListItem>

                <ListItem className={classes.listItem}>
                  <ListItemText primary="Quê quán" />
                  <Field
                    name="HomeTown"
                    component={TextField}
                    label="Quê quán"
                  />
                </ListItem>

                <ListItem className={classes.listItem}>
                  <ListItemText primary="Loại tài khoản" />
                  <Typography variant="subtitle1" className={classes.total}>
                    Chủ xe
                  </Typography>
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom>
                Xe của bạn: {vehicle.length} {' '}
                <Link href={`/admin/accounts/details/update/createVehicle?id=${user[0].id}`}>
                  <Button variant="outlined" color="primary">
                    Thêm xe
                  </Button>
                </Link>
              </Typography>

              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={values.vehicles}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                />
              </div>

              <Grid
                className={classes.gridButton}
                container
                spacing={1}
                justify="flex-end"
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    type="button"
                    //onClick={checkStepForward}
                  >
                    <Link href={`/admin/accounts`}>
                      <div
                        style={{ textDecoration: "none", font: "#000000DE" }}
                      >
                        BACK
                      </div>
                    </Link>
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    type="submit"
                    //onClick={checkLastStep}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id;
  //lấy cookie nhưng ở dạng string auth=abc123
  const cookie = ctx.req?.headers.cookie;
  //lấy cookie nhưng ở dạng object {auth: abc123}
  const { cookies } = ctx.req;

  var decoded = verify(cookies.auth, secret);

  if (decoded.accountType !== "AD" && ctx.req) {
    ctx.res?.writeHead(302, {
      Location: "http://localhost:3000/",
    });
    ctx.res?.end();
    return;
  }

  const { user, vehicle } = await axios({
    method: "GET",
    url: "http://localhost:3000/api/admin/accounts/detail",
    withCredentials: true,
    headers: {
      Cookie: cookie || null,
      "Content-Type": "application/json",
    },
    data: {
      id,
    },
  })
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.status === 401 && !ctx.req) {
        Router.replace("/");
        return;
      }

      //server-side
      if (err.response.status === 401 && ctx.req) {
        ctx.res?.writeHead(302, {
          Location: "/",
        });
        ctx.res?.end();
        return;
      }
    });

  return { props: { user, vehicle } };
};

UserDetail.AdminMenu = AdminMenu;
