import React, { Fragment, useEffect, useState } from "react";
import { createUser, getOneUser, updateUser } from "../../services/user.service";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, Button } from '@mui/material';
import DatePicker from "react-date-picker";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Swal from "sweetalert2";
import "./register.css";
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const RegisterComponent = () => {
    const dateFormat = 'yyyy-MM-dd';
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        lastName: '',
        age: '',
        phone: '',
        address: '',
        country: '',
        photo: '',
        birthdate: new Date(),
        email: '',
        password: '',
        password2: '',
        isAdmin: false
    });
    const [errorsResponse, setErrorsResponse] = useState();

    const getOneUserFromService = async () => {
        try {
            const data = await getOneUser(id);
            data.data.user.birthdate = new Date(data.data.user.birthdate);
            data.data.user.password2 = data.data.user.password;
            setUser(data.data.user);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.error,
            });
        };
    };

    useEffect(() => {
        id && getOneUserFromService();
    }, [id]);

    const userSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Too Short!')
            .max(20, 'Too Long!')
            .required('Required name'),
        lastName: Yup.string()
            .min(3, 'Too Short!')
            .max(20, 'Too Long!')
            .required("Required lastname"),
        age: Yup.number()
            .min(18, 'Minimum age!')
            .required("Required age"),
        phone: Yup.string()
            .min(8, 'Too Short!')
            .required("Required phone"),
        address: Yup.string()
            .optional(),
        country: Yup.string()
            .min(3, 'Too Short!')
            .required("Required country"),
        photo: Yup.string(),
        email: Yup.string()
            .email('Not a proper email')
            .required("Required email"),
        password: Yup.string()
            .min(6, 'Too Short!Password should be of minimum 6 characters length')
            .required("Password is required"),
        password2: Yup.string()
            .min(6, 'Too Short!')
            .required("Required confirm password"),
    });

    const sendNewUser = async (user) => {
        try {
            console.log("sendNewUser", user);
            if (user.password !== user.password2) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Las passwords no son iguales"
                });
            }
            else {
                id ? await updateUser(id, user)
                    .then((response) => {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.message,
                            text: "",
                        }).then((result) => {
                            navigate("/user/list");
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    :
                    await createUser(user)
                        .then((response) => {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.message,
                                text: "",
                            }).then((result) => {
                                navigate("/login");
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.error,
            });
            setErrorsResponse(error.response.data.error.errors);
        }
    };

    return (
        <React.Fragment>
            <Formik
                enableReinitialize={true}
                initialValues={user}
                validationSchema={userSchema}
                onSubmit={sendNewUser}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        <Grid container>
                            <Grid container direction="column" item xs={2}>
                                <Box display="flex" justifyContent="flex-start">
                                    <img className='img-regist' src="https://lumiere-a.akamaihd.net/v1/images/image_1e5c5703.jpeg?region=0%2C0%2C540%2C810" alt="imagen" />
                                </Box>
                            </Grid>
                            <Grid container direction="column" item xs={10}>
                                <br />
                                <Box className='registro'>
                                    <Box display="flex" justifyContent="left">
                                        <h1 className="title2" onClick={() => navigate("/")}>MAGIC FILM</h1>
                                    </Box>
                                    <br />
                                    {id ? (
                                        <h2>ACTUALIZAR {user.name}</h2>
                                    ) : (
                                        <h2>REGISTRATE</h2>
                                    )}
                                    <br />
                                    <p>📋Por favor complete el formulario para continuar.</p>
                                    <br />
                                    <div className='row'>
                                        <div className='column'>
                                            <h3>Datos personales</h3>
                                            <br />
                                            <div>
                                                <label>Nombres</label>
                                                <Field name="name" />
                                                {errors.name && touched.name ? (
                                                    <div>{errors.name}</div>
                                                ) : null}
                                                {errorsResponse?.name && (
                                                    <div>{errorsResponse.name.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>Apellidos</label>
                                                <Field name="lastName" />
                                                {errors.lastName && touched.lastName ? (
                                                    <div>{errors.lastName}</div>
                                                ) : null}
                                                {errorsResponse?.lastName && (
                                                    <div>{errorsResponse.lastName.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>Edad</label>
                                                <Field name="age" />
                                                {errors.age && touched.age ? (
                                                    <div>{errors.age}</div>
                                                ) : null}
                                                {errorsResponse?.age && (
                                                    <div>{errorsResponse.age.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>Celular</label>
                                                <Field name="phone" />
                                                {errors.phone && touched.phone ? (
                                                    <div>{errors.phone}</div>
                                                ) : null}
                                                {errorsResponse?.phone && (
                                                    <div>{errorsResponse.phone.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>Dirección </label>
                                                <Field name="address" />
                                                {errors.address && touched.address ? (
                                                    <div>{errors.address}</div>
                                                ) : null}
                                                {errorsResponse?.address && (
                                                    <div>{errorsResponse.address.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>País </label>
                                                <Field name="country" />
                                                {errors.country && touched.country ? (
                                                    <div>{errors.country}</div>
                                                ) : null}
                                                {errorsResponse?.country && (
                                                    <div>{errorsResponse.country.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                {id ? (
                                                    <Fragment></Fragment>
                                                ) : (
                                                    <div>
                                                        <label>Foto</label>
                                                        <Field name="photo" />
                                                        {errors.photo && touched.photo ? (
                                                            <div>{errors.photo}</div>
                                                        ) : null}
                                                        {errorsResponse?.photo && (
                                                            <div>{errorsResponse.photo.message}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>Fecha de nacimiento</label><br />
                                                <DatePicker
                                                    value={values.birthdate}
                                                    name="birthdate"
                                                    format={dateFormat}
                                                    onChange={(date) => setFieldValue("birthdate", date)}
                                                />
                                            </div>
                                        </div>
                                        <div className='column'>
                                            <h3>Datos de usuario</h3>
                                            <br />
                                            <div>
                                                <label>Email</label>
                                                <Field name="email" />
                                                {errors.email && touched.email ? (
                                                    <div>{errors.email}</div>
                                                ) : null}
                                                {errorsResponse?.email && (
                                                    <div>{errorsResponse.email.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>Password</label>
                                                <Field type="password" name="password" />
                                                {errors.password && touched.password ? (
                                                    <div>{errors.password}</div>
                                                ) : null}
                                                {errorsResponse?.password && (
                                                    <div>{errorsResponse.password.message}</div>
                                                )}
                                            </div>
                                            <br />
                                            <div>
                                                <label>Confirmar Password</label>
                                                <Field type="password" name="password2" />
                                                {errors.password2 && touched.password2 ? (
                                                    <div>{errors.password2}</div>
                                                ) : null}
                                                {errorsResponse?.password2 && (
                                                    <div>{errorsResponse.password2.message}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {id ? (
                                        <div className='row'>
                                            <div className='column'>
                                                <label>Foto</label><br />
                                                <img
                                                    width="400px"
                                                    height="400px"
                                                    src={user.photo}
                                                    alt="cloudinary"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Fragment></Fragment>
                                    )}
                                    <br />
                                    <br />
                                    {id ? (
                                        <Button variant="contained" sx={{ backgroundColor: '#d22215', height: '40px', width: '200px', borderRadius: '5px' }} className='btn-c' type="submit">Actualizar</Button>

                                    ) : (
                                        <Button variant="contained" sx={{ backgroundColor: '#d22215', height: '40px', width: '200px', borderRadius: '5px' }} className='btn-c' type="submit">Registrar</Button>
                                    )}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {id ? (
                                        <Button variant="contained" sx={{ backgroundColor: '#d22215', height: '40px', width: '200px', borderRadius: '5px' }} className='btn-c' onClick={() => navigate("/user/list")}>Cancel</Button>

                                    ) : (
                                        <Button variant="contained" sx={{ backgroundColor: '#d22215', height: '40px', width: '200px', borderRadius: '5px' }} className='btn-c' onClick={() => navigate("/")}>Cancel</Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )
                }
            </Formik >
        </React.Fragment >

    )
}

export default RegisterComponent;