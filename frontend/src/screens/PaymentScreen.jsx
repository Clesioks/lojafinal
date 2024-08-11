import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import FormCountainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../slices/cartSlice'

const PaymentScreen = () => {

    const [ paymentMethod, setPaymentMethod ] = useState('PayPal')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

  return (
    <FormCountainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Forma de pagamento</h1>
        <Form onSubmit={ submitHandler }>
            <Form.Group>
                <Form.Label as='legend'>Selecione a forma</Form.Label>
                <Col>
                    <Form.Check
                        type='radio'
                        className='my-2'
                        label='Paypal ou Cartão de Crédito'
                        id='Paypal'
                        name='paymentMethod'
                        value='Paypal'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>
                Continue
            </Button>
        </Form>
    </FormCountainer>
  ) 
}

export default PaymentScreen