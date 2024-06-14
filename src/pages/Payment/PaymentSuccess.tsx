import { Skeleton, notification, Typography } from 'antd';
import { useEffect, useState } from 'react'
import { checkPaymentStatus } from '../../api/paymentAPI';
import { useLocation, useNavigate } from 'react-router-dom';
import cookieUtils from '../../utils/cookieUtils';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import * as Styled from './Payment.styled';
import Container from '../../components/Container/Container';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { theme } from '../../themes';
import { toScheduleString } from './MakePayment';
import config from '../../config';
import { Schedule } from '../../components/Schedule/Schedule.type';
const { Title, Text } = Typography;

const PaymentSuccess = () => {
    useDocumentTitle('Payment Status');
    const [api, contextHolder] = notification.useNotification({
        top: 100,
    });

    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(true);
    const [paymentResponse, setPaymentResponse] = useState<any>();
    const [bookingData, setBookingData] = useState<any>();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await checkPaymentStatus(location.search);
                console.log(response)
                if (response.status === 200) {
                setPaymentResponse(response);
                setBookingData(cookieUtils.getItem('bookingData'));
                cookieUtils.removeItem('bookingData');}
            } catch (error: any) {
                api.error({
                    message: 'Error',
                    description: error.response ? error.response.data : error.message,
                });
                setPaymentResponse(error.response)
            } finally {
                setTimeout(() => {
                setLoading(false);},2000);
            }
        })();
    }, [])



    
    return (
        paymentResponse? ( <Styled.CheckSection>
            <Container>
                <Styled.CheckInner>
                    <Skeleton loading={loading}>
                        {(paymentResponse.status && bookingData) ? (
                            <>
                                <Styled.CheckSuccessMsg>
                                    <AiOutlineCheckCircle
                                        size={80}
                                        color={theme.colors.success}
                                    />
                                    <Title level={2}>Thank you for trusting us!</Title>
                                </Styled.CheckSuccessMsg>
                                <Styled.BorderLine />

                                <Styled.PaymentMainPrice>
                                    <Title level={3}>
                                        Total payment
                                    </Title>
                                    <Text>{Math.round(bookingData.price).toLocaleString()} VND</Text>
                                </Styled.PaymentMainPrice>

                                <Styled.PaymentMainPrice>
                                    <Title level={3}>Booked schedule</Title>
                                    <Text>
                                            {bookingData.schedule.map((schedule:Schedule, index: number) => (
                                                <p key={index} style={{ lineHeight: `100%`, textAlign:`right` }}>{toScheduleString(schedule).split('at')[0]} at <span style={{ color:`${theme.colors.primary}` }}>{toScheduleString(schedule).split('at')[1]} </span></p>
                                            )
                                            )}
                                    </Text>
                                </Styled.PaymentMainPrice>

                                <Styled.BorderLine />
                                <Styled.PaymentMainPrice style={{ marginBottom: `20px` }}>
                                    <Title level={3}>Tutor profile</Title>
                                    <Text>
                                        <a href={`/search-tutors/${bookingData.tutor.id}`}>{bookingData.tutor.fullName}</a>
                                    </Text>
                                </Styled.PaymentMainPrice>
                            </>) : (
                            <Styled.CheckErrorMsg>
                                <AiOutlineCloseCircle size={80} color={theme.colors.error} />
                                <Title level={2}>{paymentResponse.data}</Title>
                            </Styled.CheckErrorMsg>
                        )}
                    </Skeleton>
                </Styled.CheckInner>
            </Container>
        </Styled.CheckSection>
        ): navigate(config.routes.public.notFound))
}

export default PaymentSuccess;