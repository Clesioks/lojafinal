import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { useLoginMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector((state) => state.auth)

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHandler =  async (e) => {
        e.preventDefault()
        try {
            const res = await login({ email, password}).unwrap()
            dispatch(setCredentials({ ...res, }))
            navigate(redirect)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

  return (
    <FormContainer>
        <h1>Entrar</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Endereço de email:</Form.Label>
                <Form.Control type='email' placeholder='Adicione um email' value={email} onChange={(e) => setEmail(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Senha:</Form.Label>
                <Form.Control type='password' placeholder='Adicione um email' value={password} onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>Entrar</Button>

            { isLoading && <Loader /> }
        </Form>

        <Row className='py-3'>
            <Col>
                Novo cliente? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Cadastrar</Link>
            </Col>
        </Row>
    </FormContainer>

  )
}

export default LoginScreen