import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress ] = useState(shippingAddress?.address || '')
    const [city, setCity ] = useState(shippingAddress?.city || '')
    const [postalCode, setPostalCode ] = useState(shippingAddress?.postalCode || '')
    const [country, setCountry ] = useState(shippingAddress?.country || '')

    const navigate = useNavigate()
    const dispatch = useDispatch()



    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/payment')
    }


  return <FormContainer> 
    <CheckoutSteps step1 step2 />
    <h1>Endereço para entrega</h1>
    <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-2'>
            <Form.Label>Endereço:</Form.Label>
            <Form.Control type='text' placeholder='Adicione seu endereço' value={address} onChange={(e) => setAddress(e.target.value)}>
            </Form.Control>
        </Form.Group>
        <Form.Group controlId='city' className='my-2'>
            <Form.Label>Cidade:</Form.Label>
            <Form.Control type='text' placeholder='Adicione um email' value={city} onChange={(e) => setCity(e.target.value)}>
            </Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-2'>
            <Form.Label>CEP:</Form.Label>
            <Form.Control type='text' placeholder='Adicione seu CEP' value={postalCode} onChange={(e) => setPostalCode(e.target.value)}>
            </Form.Control>
            </Form.Group>
            <Form.Group controlId='country' className='my-2'>
            <Form.Label>País:</Form.Label>
            <Form.Control type='text' placeholder='Adicione seu País' value={country} onChange={(e) => setCountry(e.target.value)}>
            </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2' >Continuar</Button>
    </Form>

    </FormContainer>
}

export default ShippingScreen