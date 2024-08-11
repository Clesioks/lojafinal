import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { useRegisterMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterMutation()

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

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem')
        } else {

            try {
                const res = await register({name, email, password}).unwrap()
                dispatch(setCredentials({ ...res, }))
                navigate(redirect)
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }

    }

  return (
    <FormContainer>
        <h1>Cadastrar</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-3'>
                <Form.Label>Nome:</Form.Label>
                <Form.Control type='text' placeholder='Coloque seu nome' value={name} onChange={(e) => setName(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Endereço de email:</Form.Label>
                <Form.Control type='email' placeholder='Adicione um email' value={email} onChange={(e) => setEmail(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Senha:</Form.Label>
                <Form.Control type='password' placeholder='Adicione uma senha' value={password} onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='my-3'>
                <Form.Label>Confirmar Senha:</Form.Label>
                <Form.Control type='password' placeholder='Confirma a senha' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>Registrar</Button>

            { isLoading && <Loader /> }
        </Form>

        <Row className='py-3'>
            <Col>
                Já tem uma conta? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Entrar</Link>
            </Col>
        </Row>
    </FormContainer>

  )
}

export default RegisterScreen