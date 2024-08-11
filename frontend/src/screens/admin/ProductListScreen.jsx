import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import { toast } from 'react-toastify'
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice";

const ProductListScreen = () => {

  const {pageNumber} = useParams()

  const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber})

  const [ createProduct, { isLoading: loadingCreate } ] = useCreateProductMutation()

  const [ deleteProduct, { isLoading: loadingDelete } ] = useDeleteProductMutation()
  
  const deleteHandler = async (id) => {
    if (window.confirm('Você tem certeza que deseja apagar o item?')) {
      try {
        await deleteProduct(id)
        toast.success('Produto deletado')
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const createProductHandler = async () => {
    if (window.confirm('Você tem certeza que deseja criar um novo produto?'
      )) {
        try {
          await createProduct()
          refetch()
        } catch (err) {
          toast.error(err?.data?.message || err.error)
        }
      }
    }

  return <>
        <Row className="align-items-center">
          <Col>
              <h1>Produtos</h1>
          </Col>
          <Col className="text-end">
            <Button className="btn-sm m-3" onClick={createProductHandler}>
                <FaEdit /> Criar Produto
            </Button>
          </Col>
        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}

        {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
          <>
            <Table striped hover responsive className="table-sn" >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NOME</th>
                    <th>PREÇO</th>
                    <th>CATEGORIA</th>
                    <th>MARCA</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((product) => (
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>R${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>
                          <LinkContainer to={`/admin/product/${product._id}/edit`}>
                            <Button variant='light' className="btn-sm mx-2">
                              <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button variant="danger" className="btn-sm" onClick={ () => deleteHandler(product._id) }>
                            <FaTrash style={{color: 'white'}} />
                          </Button>
                        </td>
                    </tr>
                  ))}
                </tbody>
            </Table>
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </>
        )}

  </>;
};

export default ProductListScreen;
