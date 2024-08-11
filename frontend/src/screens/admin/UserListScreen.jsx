import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {toast} from 'react-toastify'
import { useGetUsersQuery, useDeleteUserMutation, useCreateUserMutation } from "../../slices/userApiSlice";

const UserListScreen = () => {

  const { data: users, refetch, isLoading, error } = useGetUsersQuery()

  const [createUser,{ isLoading: loadingCreate }] = useCreateUserMutation()

  const [deleteUser, { isLoading: loadingDelete } ]  = useDeleteUserMutation()

  const deleteHandler = async (id) => {
    if(window.confirm('Você tem certeza que deseja deletar esse usuário?')) {
        try {
            await deleteUser(id).unwrap()
            toast.success('Usuário deletado')
            refetch()
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

  }  

  const createUserHandler = async () => {
    if(window.confirm('Tem certeza que deseja gerar novo usuário?')) {
          try {
            await createUser().unwrap()      
           toast.success('Usuário criado')
            refetch()
          } catch (err) {
            toast.error(err?.data?.message || err.error)
          }
    }

  }
  
  return (
    <>
    <Row className="align-items-center">
      <Col>
      <h1>Usuários</h1>
      </Col>
      <Col className="text-end">
      <Button className="btn-sm m-3" onClick={createUserHandler}>
        <FaEdit /> Criar usuário
        </Button>
      </Col>
    </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{color: 'green'}} />
                  ) : (
                    <FaTimes style={{color: 'red'}} />
                  )}
                </td>                
                <td>
                    {!user.isAdmin && (
                    <>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>                  
                  </LinkContainer>
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
                    <FaTrash style={{color: 'white'}} />
                  </Button>
                  </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}   
    </>
  )
};

export default UserListScreen;
