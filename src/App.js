import { apiClient } from './services/api';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Modal, TablePagination, TextField, Typography } from '@mui/material';
import './style.css';

function App() {

  const [users, setUsers] = useState([])

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState('');
  const [searchState, setSearchState] = useState('');
  const [userModal, setUserModal] = useState({});
  const [open, setOpen] = React.useState(false);
  const handleOpen = (user) => {
    setUserModal(user)
    setOpen(true)
  };
  const handleClose = () => {
    setUserModal({})
    setOpen(false)
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getInfo = async (type = null) => {
    if (type) {
      setSearchName('')
      setSearchState('')
    }
    setUsers([])
    //apiClient.httpInstance.get("/products.json?brand=covergirl&product_type=lipstick", {})
    apiClient.httpInstance.get("/users", {
      params: {
        "name": type ? '' : searchName,
        "state": type ? '' : searchState,
      }
    })
      .then(async response => {
        if (response.status === 200) {
          setUsers(response.data)
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

  useEffect(() => {
    getInfo()
  }, []);

  return (
    <>
      <Container maxWidth="md" className="body" >
        <Typography color="primary" variant="h2" component="h2">Usuários</Typography>
        <p>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="search-name" label="Nome" variant="outlined" color="secondary" size="small" value={searchName} onChange={ev => setSearchName(ev.target.value)} />
            <TextField id="search-state" label="Estado" variant="outlined" color="secondary" size="small" value={searchState} onChange={ev => setSearchState(ev.target.value)} />
            <span><Button variant="outlined" onClick={() => getInfo()}>Pesquisar</Button></span>
            <span><Button variant="outlined" onClick={() => getInfo('clean')}>Limpar</Button></span>
          </Box>
        </p>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a table">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell key={row.id}>
                        {row.name.first} {row.name.last}
                      </TableCell>
                      <TableCell key={row.id}>
                        {row.email}
                      </TableCell>
                      <TableCell key={row.id}>
                        {row.location.state}
                      </TableCell>
                      <TableCell key={row.id}>
                        <Button onClick={() => handleOpen(row)}>Ver</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="card-modal">
          <Card sx={{ maxWidth: 345 }}>
            <Button size="small" onClick={() => handleClose()}></Button>
            <CardMedia
              component="img"
              alt="green iguana"
              height="200"
              image={userModal?.picture?.medium}
              sx={{ objectFit: 'contain' }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {userModal?.name?.first} {userModal?.name?.last}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <Typography variant="h6" component="h6">
                  Estado
                </Typography> {userModal?.location?.state}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <Typography variant="h6" component="h6">
                  Email
                </Typography> {userModal?.email}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
}

export default App;
