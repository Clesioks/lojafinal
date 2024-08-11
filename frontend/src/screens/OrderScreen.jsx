import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPaypalClientIdQuery, useDeliverOrderMutation } from '../slices/ordersApiSlice'
import {format} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import numeral from 'numeral'
// eslint-disable-next-line no-unused-vars
import { br } from 'numeral/locales/pt-br'

import React from 'react'

const OrderScreen = () => {

    const { id: orderId } = useParams()

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)

    const [ payOrder, { isLoading: loadingPay } ] = usePayOrderMutation()

    const [ deliverOrder, { isLoading: loadingDeliver } ] = useDeliverOrderMutation()

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal  } = useGetPaypalClientIdQuery()

    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'BRL'
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending'})
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript()
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details })
                refetch()
                toast.success('Pagamento confirmado')
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        })
    }

    // async function onApproveTest() {
    //     await payOrder({ orderId, details: { payer: {} } })
    //     refetch()
    //     toast.success('Pagamento confirmado')
    // }
    
        function onError(error) {
            toast.error(error.message)
    
        }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    }
                }
            ]
        }).then((orderId) => {
            return orderId
        })
    }


    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId)
            refetch()
            toast.success('Pedido entregue')
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }

    const formatDate = (date) => {
        return format((date), "dd/MM/yyyy 'às' hh:mm:ss " , {
            locale: ptBR,
        })
    }

    numeral.locale('pt-br')


  return isLoading ? <Loader /> : error ? <Message variant="danger" /> 
  : (
    <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Envio</h2>
                                <p>
                                    <strong>Nome: </strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong> {order.user.email}
                                </p>
                                <p>
                                    <strong>Endereço: </strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}  
                                     {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                                { order.isDelivered ? (
                                    <Message variant='success'>
                                        Entregue em {formatDate(order.deliveredAt)}
                                    </Message>
                                ) : (
                                    <Message variant='danger'>Não entregue</Message>
                                ) }  
                        </ListGroup.Item>

                        <ListGroup.Item>
                                <h2>Forma de pagamento</h2>
                                    <p>
                                        <strong>Forma: </strong>
                                        {order.paymentMethod}
                                    </p>

                                    {order.isPaid ? (
                                        <Message variant='success'>Pago em {order.paidAt}</Message>
                                    ) : ( 
                                        <Message variant='danger'>Não pago</Message>
                                    ) }

                        </ListGroup.Item>

                        <ListGroup.Item>
                                <h2>Itens do pedido:</h2>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x R${item.price} = ${item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}

                        </ListGroup.Item>
                    </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2> Resumo do pedido</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                                <Row>
                                    <Col>Itens</Col>
                                    <Col>{(order.itemsPrice)}</Col>
                                </Row>

                                <Row>
                                    <Col>Envio</Col>
                                    <Col>R${order.shippingPrice}</Col>
                                </Row>

                                <Row>
                                    <Col>Imposto</Col>
                                    <Col>{numeral(order.taxPrice).format('$ 0,0.00')}</Col>
                                </Row>

                                <Row>
                                    <Col>Total</Col>
                                    <Col>
                                    {numeral(order.totalPrice).format('$ 0,0.00')}
                                    </Col>
                                </Row>

                        </ListGroup.Item>
                                
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}

                                        {isPending ? <Loader /> : (
                                            <div>
                                                {/* <Button onClick={ onApproveTest } style={{marginBottom: '10px'}}>Test Pay Order</Button> */}
                                                <div>
                                                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                                                </div>
                                            </div>
                                        )}


                                    </ListGroup.Item>
                                )}

                               {loadingDeliver && <Loader />}

                               {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                                        Confirmar como entregue
                                    </Button>
                                </ListGroup.Item>
                               )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    
    
    </>
  )
}

export default OrderScreen