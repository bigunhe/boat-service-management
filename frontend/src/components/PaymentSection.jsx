import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { 
  FaCreditCard, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaLock,
  FaRupeeSign
} from 'react-icons/fa';

const PaymentSection = ({ onPaymentComplete, isPaid = false, isLoading = false }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed, failed
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const handlePaymentClick = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // In real implementation, this would redirect to your friend's payment system
      // For now, we'll simulate a successful payment
      setPaymentStatus('completed');
      onPaymentComplete && onPaymentComplete();
    }, 2000);
  };

  const getPaymentButtonContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <HStack spacing={2}>
            <Spinner size="sm" color="white" />
            <Text>Processing Payment...</Text>
          </HStack>
        );
      case 'completed':
        return (
          <HStack spacing={2}>
            <Icon as={FaCheckCircle} />
            <Text>Payment Completed</Text>
          </HStack>
        );
      default:
        return (
          <HStack spacing={2}>
            <Icon as={FaCreditCard} />
            <Text>Pay 2000 LKR</Text>
          </HStack>
        );
    }
  };

  const getPaymentButtonProps = () => {
    switch (paymentStatus) {
      case 'processing':
        return {
          colorScheme: 'blue',
          isLoading: true,
          loadingText: 'Processing...',
          disabled: true,
        };
      case 'completed':
        return {
          colorScheme: 'green',
          disabled: true,
        };
      default:
        return {
          colorScheme: 'blue',
          onClick: handlePaymentClick,
        };
    }
  };

  return (
    <Card
      bg={bgColor}
      border="2px solid"
      borderColor={paymentStatus === 'completed' ? 'green.300' : 'blue.300'}
      borderRadius="xl"
      shadow="lg"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bgGradient: paymentStatus === 'completed' 
          ? 'linear(to-r, green.500, green.400)' 
          : 'linear(to-r, blue.500, cyan.400)',
      }}
    >
      <CardHeader>
        <VStack spacing={3} align="stretch">
          <HStack spacing={3} justify="center">
            <Icon 
              as={paymentStatus === 'completed' ? FaCheckCircle : FaCreditCard} 
              boxSize={6} 
              color={paymentStatus === 'completed' ? 'green.500' : 'blue.500'} 
            />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Payment Required
            </Text>
          </HStack>
          
          <Text textAlign="center" color={mutedColor} fontSize="sm">
            Complete your payment to confirm your appointment booking
          </Text>
        </VStack>
      </CardHeader>

      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Payment Amount */}
          <Box textAlign="center">
            <HStack spacing={2} justify="center">
              <Icon as={FaRupeeSign} boxSize={8} color="green.500" />
              <Text fontSize="4xl" fontWeight="black" color="green.600">
                2,000
              </Text>
            </HStack>
            <Text fontSize="lg" color={mutedColor} mt={2}>
              Service Fee
            </Text>
          </Box>

          <Divider />

          {/* Payment Information */}
          <VStack spacing={3} align="stretch">
            <HStack spacing={3}>
              <Icon as={FaShieldAlt} color="green.500" />
              <Text fontSize="sm" color={mutedColor}>
                Secure payment processing
              </Text>
            </HStack>
            
            <HStack spacing={3}>
              <Icon as={FaLock} color="blue.500" />
              <Text fontSize="sm" color={mutedColor}>
                Your payment information is encrypted and secure
              </Text>
            </HStack>
            
            <HStack spacing={3}>
              <Icon as={FaCheckCircle} color="green.500" />
              <Text fontSize="sm" color={mutedColor}>
                Payment confirmation will be sent to your email
              </Text>
            </HStack>
          </VStack>

          {/* Payment Status Alert */}
          {paymentStatus === 'completed' && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Payment Successful!</AlertTitle>
                <AlertDescription>
                  Your payment has been processed successfully. You can now complete your appointment booking.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {paymentStatus === 'failed' && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription>
                  There was an issue processing your payment. Please try again.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Payment Button */}
          <Box textAlign="center">
            <Button
              size="lg"
              px={12}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              bgGradient={
                paymentStatus === 'completed'
                  ? 'linear(to-r, green.500, green.400)'
                  : 'linear(to-r, blue.500, cyan.400)'
              }
              _hover={
                paymentStatus !== 'completed' && paymentStatus !== 'processing'
                  ? {
                      bgGradient: 'linear(to-r, blue.600, cyan.500)',
                      transform: 'translateY(-2px)',
                      shadow: 'lg'
                    }
                  : {}
              }
              {...getPaymentButtonProps()}
            >
              {getPaymentButtonContent()}
            </Button>
          </Box>

          {/* Payment Notice */}
          <Box
            bg={useColorModeValue('blue.50', 'blue.900')}
            border="1px solid"
            borderColor={useColorModeValue('blue.200', 'blue.700')}
            borderRadius="md"
            p={4}
            textAlign="center"
          >
            <VStack spacing={2}>
              <HStack spacing={2}>
                <Icon as={FaExclamationTriangle} color="blue.500" />
                <Text fontSize="sm" fontWeight="bold" color="blue.700">
                  Important Notice
                </Text>
              </HStack>
              <Text fontSize="sm" color="blue.600">
                Payment must be completed before your appointment can be confirmed. 
                You will be redirected to our secure payment partner to complete the transaction.
              </Text>
            </VStack>
          </Box>

          {/* Payment Partner Info */}
          <Box textAlign="center">
            <Text fontSize="xs" color={mutedColor}>
              Powered by our secure payment partner
            </Text>
            <Text fontSize="xs" color={mutedColor} mt={1}>
              All transactions are processed securely and encrypted
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default PaymentSection;














