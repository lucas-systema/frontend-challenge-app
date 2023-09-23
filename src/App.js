import { apiClient } from './services/api';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Modal, TextField, Typography } from '@mui/material';
import { CircularProgress, Pagination, Stack } from '@mui/material';
import './style.css';

function App() {

  const [users, setUsers] = useState([])

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [searchState, setSearchState] = useState('');
  const [userModal, setUserModal] = useState({});
  const [loading, setLoading] = useState(false);
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

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    //setPage(0);
  };

  const getInfo = (type = null) => {
    if (type) {
      setSearchName('')
      setSearchState('')
    }
    setUsers([])
    setLoading(true)

    apiClient.httpInstance.get("/users", {
      params: {
        "name": type ? '' : searchName,
        "state": type ? '' : searchState,
        "page": page,
        "limit": rowsPerPage,
      }
    })
      .then(response => {
        if (response.status === 200) {

          setUsers(response.data.users)
          setTotalResults(response.data.totalRegisters)

          if (response.data?.pagination?.next?.page) {
            setPage(response.data.pagination.next.page - 1)
          } else {
            setPage(1)
          }

          setLoading(false)
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

  useEffect(() => {
    getInfo()
  }, [rowsPerPage, page]);

  return (
    <>
      <Container maxWidth="md" className="body">
        <Grid container spacing={2} padding={4} justifyContent={'center'}>
          <Typography color="primary" variant="h2" component="h2">Usuários</Typography>
        </Grid>
        <Grid container spacing={2} padding={4} justifyContent={'center'}>
          <Grid container xs={12} md={8} spacing={2} justifyContent={'left'}>
            <Grid item xs={12} md={5}>
              <TextField id="search-name" label="Nome" variant="outlined" color="secondary" size="small" value={searchName} onChange={ev => setSearchName(ev.target.value)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField id="search-state" label="Estado" variant="outlined" color="secondary" size="small" value={searchState} onChange={ev => setSearchState(ev.target.value)} />
            </Grid>
          </Grid>
          <Grid container xs={12} md={4} spacing={2} justifyContent={'right'}>
            <Grid item>
              <span><Button variant="outlined" onClick={() => getInfo()}>Pesquisar</Button></span>
            </Grid>
            <Grid item>
              <span><Button variant="outlined" onClick={() => getInfo('clean')}>Limpar</Button></span>
            </Grid>
          </Grid>
        </Grid>
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
              {users.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell key={row.id}>
                      {row.name.first.toUpperCase()} {row.name.last.toUpperCase()}
                    </TableCell>
                    <TableCell key={row.id}>
                      {row.email}
                    </TableCell>
                    <TableCell key={row.id}>
                      {row.location.state.toUpperCase()}
                    </TableCell>
                    <TableCell key={row.id}>
                      <Button onClick={() => handleOpen(row)}>Exibir</Button>
                      <Button onClick={() => handleOpen(row)}>Abrir</Button>
                    </TableCell>
                  </TableRow>
                );
              })
              }
            </TableBody>
          </Table>
        </TableContainer>

        {!users.length &&
          <Grid container direction="row" justifyContent="center" alignItems="center" bgcolor={'#fff'}
            sx={{
              height: 350,
            }}>
            <Grid item>
              {loading ? <CircularProgress size={30} /> : <Typography color="secondary" variant="h6">Nenhum usuário encontrado</Typography>}
            </Grid>
          </Grid>
        }
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Stack spacing={2} padding={3}>
            <Pagination count={(totalResults / 10) % 1 !== 0 ? Math.trunc(totalResults / 10) + 1 : Math.trunc(totalResults / 10)} page={page} onChange={handleChangePage} color="primary" />
          </Stack>
        </Grid>
      </Container >
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
                {userModal?.name?.first.toUpperCase()} {userModal?.name?.last.toUpperCase()}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <Typography variant="h6" component="h6">
                  Estado
                </Typography> {userModal?.location?.state.toUpperCase()}
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
