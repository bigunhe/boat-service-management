import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Icon,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  SimpleGrid,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
  FaCalendarAlt,
  FaArrowLeft,
  FaShip,
  FaUser,
  FaClock,
  FaCog,
  FaCreditCard,
  FaCheckCircle
} from "react-icons/fa";
import AppointmentCalendar from "../../components/AppointmentCalendar";
import PaymentSection from "../../components/PaymentSection";

const UserAppointmentsPage = () => {
  // Appointment booking form state
  const [appointmentData, setAppointmentData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceType: "",
    appointmentDate: "",
    appointmentTime: "",
    boatDetails: {
      boatName: "",
      boatType: "",
      boatLength: "",
      engineType: ""
    },
    description: "",
    estimatedDuration: 2,
    priority: "Medium"
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const toast = useToast();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Appointment form handlers
  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBoatDetailsChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      boatDetails: {
        ...prev.boatDetails,
        [name]: value
      }
    }));
  };

  // Fetch available time slots when date changes
  const fetchAvailableTimeSlots = async (date) => {
    if (!date) return;
    
    setLoadingSlots(true);
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/available-slots/${date}`);
      const data = await response.json();
      if (data.success) {
        setAvailableTimeSlots(data.data.availableSlots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch available time slots',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setAppointmentData(prev => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: "" // Reset time when date changes
    }));
    fetchAvailableTimeSlots(date);
  };

  // Handle calendar date selection
  const handleCalendarDateSelect = (date) => {
    setSelectedDate(date);
    setAppointmentData(prev => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: "" // Reset time when date changes
    }));
    fetchAvailableTimeSlots(date);
    setShowCalendar(false);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    toast({
      title: "Payment Completed!",
      description: "Your payment has been processed successfully. You can now complete your booking.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // Handle appointment form submission
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!appointmentData.customerName || !appointmentData.customerEmail || !appointmentData.customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer information fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!appointmentData.serviceType || !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please select service type, date, and time.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!appointmentData.boatDetails.boatName || !appointmentData.boatDetails.boatType) {
      toast({
        title: "Missing Information",
        description: "Please provide boat name and type.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!appointmentData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a description of the service needed.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!paymentCompleted) {
      toast({
        title: "Payment Required",
        description: "Please complete your payment before booking the appointment.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Appointment Booked!",
          description: "Your appointment has been successfully booked. We'll contact you to confirm.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Reset form
        setAppointmentData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          serviceType: "",
          appointmentDate: "",
          appointmentTime: "",
          boatDetails: {
            boatName: "",
            boatType: "",
            boatLength: "",
            engineType: ""
          },
          description: "",
          estimatedDuration: 2,
          priority: "Medium"
        });
        setAvailableTimeSlots([]);
        setSelectedDate("");
        setPaymentCompleted(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <HStack spacing={4}>
            <Icon as={FaShip} boxSize={8} color="blue.500" />
            <Heading
              as="h1"
              size="2xl"
              fontWeight="black"
              bgGradient="linear(to-r, blue.500, cyan.400)"
              bgClip="text"
            >
              Book Your Appointment
            </Heading>
          </HStack>
          <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.300")} maxW="2xl">
            Schedule your boat service appointment online with our expert marine technicians
          </Text>
        </VStack>

        {/* Back Button */}
        <Box>
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<Icon as={FaArrowLeft} />}
            variant="ghost"
            colorScheme="blue"
            size="sm"
          >
            Back to Home
          </Button>
        </Box>

        {/* Appointment Booking Form */}
        <Card bg={bg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaCalendarAlt} boxSize={6} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Heading size="lg" color={useColorModeValue("gray.800", "white")}>
                  Schedule Your Service
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  Fill out the form below to book your appointment
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAppointmentSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Customer Information */}
                <Box>
                  <HStack spacing={3} mb={4}>
                    <Icon as={FaUser} color="blue.500" />
                    <Heading size="md" color={useColorModeValue("gray.700", "gray.300")}>
                      Customer Information
                    </Heading>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="customerName"
                        value={appointmentData.customerName}
                        onChange={handleAppointmentInputChange}
                        placeholder="Enter your full name"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        name="customerEmail"
                        value={appointmentData.customerEmail}
                        onChange={handleAppointmentInputChange}
                        placeholder="Enter your email"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="customerPhone"
                        value={appointmentData.customerPhone}
                        onChange={handleAppointmentInputChange}
                        placeholder="Enter your phone number"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Priority Level</FormLabel>
                      <Select
                        name="priority"
                        value={appointmentData.priority}
                        onChange={handleAppointmentInputChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Emergency">Emergency</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Service Information */}
                <Box>
                  <HStack spacing={3} mb={4}>
                    <Icon as={FaCog} color="green.500" />
                    <Heading size="md" color={useColorModeValue("gray.700", "gray.300")}>
                      Service Information
                    </Heading>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Service Type</FormLabel>
                      <Select
                        name="serviceType"
                        value={appointmentData.serviceType}
                        onChange={handleAppointmentInputChange}
                        placeholder="Select service type"
                      >
                        <option value="General Service">General Service</option>
                        <option value="Engine Repair">Engine Repair</option>
                        <option value="Boat Cleaning">Boat Cleaning</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Emergency Service">Emergency Service</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Estimated Duration (hours)</FormLabel>
                      <Input
                        type="number"
                        name="estimatedDuration"
                        value={appointmentData.estimatedDuration}
                        onChange={handleAppointmentInputChange}
                        min="1"
                        max="8"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Appointment Date</FormLabel>
                      <VStack spacing={3} align="stretch">
                        <HStack spacing={3}>
                          <Input
                            type="date"
                            name="appointmentDate"
                            value={appointmentData.appointmentDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split('T')[0]}
                            flex={1}
                          />
                          <Button
                            colorScheme="blue"
                            variant="outline"
                            leftIcon={<Icon as={FaCalendarAlt} />}
                            onClick={() => setShowCalendar(!showCalendar)}
                          >
                            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                          </Button>
                        </HStack>
                        
                        {showCalendar && (
                          <AppointmentCalendar
                            onDateSelect={handleCalendarDateSelect}
                            selectedDate={selectedDate}
                          />
                        )}
                        
                        {appointmentData.appointmentDate && (
                          <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Box>
                              <AlertTitle>Selected Date:</AlertTitle>
                              <AlertDescription>
                                {new Date(appointmentData.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </AlertDescription>
                            </Box>
                          </Alert>
                        )}
                      </VStack>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Appointment Time</FormLabel>
                      <Select
                        name="appointmentTime"
                        value={appointmentData.appointmentTime}
                        onChange={handleAppointmentInputChange}
                        placeholder="Select time slot"
                        isDisabled={!appointmentData.appointmentDate || loadingSlots}
                      >
                        {availableTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Select>
                      {loadingSlots && <Text fontSize="sm" color="blue.500">Loading available slots...</Text>}
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Boat Information */}
                <Box>
                  <HStack spacing={3} mb={4}>
                    <Icon as={FaShip} color="purple.500" />
                    <Heading size="md" color={useColorModeValue("gray.700", "gray.300")}>
                      Boat Information
                    </Heading>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Boat Name</FormLabel>
                      <Input
                        name="boatName"
                        value={appointmentData.boatDetails.boatName}
                        onChange={handleBoatDetailsChange}
                        placeholder="Enter boat name"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Boat Type</FormLabel>
                      <Input
                        name="boatType"
                        value={appointmentData.boatDetails.boatType}
                        onChange={handleBoatDetailsChange}
                        placeholder="e.g., Fishing Boat, Yacht, Speedboat"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Boat Length</FormLabel>
                      <Input
                        name="boatLength"
                        value={appointmentData.boatDetails.boatLength}
                        onChange={handleBoatDetailsChange}
                        placeholder="e.g., 25 feet"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Engine Type</FormLabel>
                      <Input
                        name="engineType"
                        value={appointmentData.boatDetails.engineType}
                        onChange={handleBoatDetailsChange}
                        placeholder="e.g., Outboard, Inboard, Jet Drive"
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Payment Section */}
                <Box>
                  <HStack spacing={3} mb={4}>
                    <Icon as={FaCreditCard} color="green.500" />
                    <Heading size="md" color={useColorModeValue("gray.700", "gray.300")}>
                      Payment Information
                    </Heading>
                  </HStack>
                  <PaymentSection
                    onPaymentComplete={handlePaymentComplete}
                    isPaid={paymentCompleted}
                  />
                </Box>

                {/* Service Description */}
                <FormControl isRequired>
                  <FormLabel>Service Description</FormLabel>
                  <Textarea
                    name="description"
                    value={appointmentData.description}
                    onChange={handleAppointmentInputChange}
                    placeholder="Please provide detailed description of the service needed..."
                    rows={4}
                  />
                </FormControl>

                {/* Submit Button */}
                <HStack spacing={4} justify="center" mt={6}>
                  <Button
                    type="submit"
                    colorScheme={paymentCompleted ? "green" : "blue"}
                    size="lg"
                    leftIcon={<Icon as={paymentCompleted ? FaCheckCircle : FaCalendarAlt} />}
                    bgGradient={
                      paymentCompleted
                        ? "linear(to-r, green.500, green.400)"
                        : "linear(to-r, blue.500, cyan.400)"
                    }
                    _hover={
                      paymentCompleted
                        ? {}
                        : {
                            bgGradient: "linear(to-r, blue.600, cyan.500)",
                            transform: "translateY(-2px)",
                            shadow: "lg"
                          }
                    }
                    px={12}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    disabled={!paymentCompleted}
                  >
                    {paymentCompleted ? "Complete Booking" : "Payment Required"}
                  </Button>
                </HStack>

                {/* Payment Status Notice */}
                {!paymentCompleted && (
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Payment Required</AlertTitle>
                      <AlertDescription>
                        Please complete your payment above before you can book your appointment.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Additional Information */}
        <Card bg={useColorModeValue("blue.50", "blue.900")} border="1px solid" borderColor={useColorModeValue("blue.200", "blue.700")}>
          <CardBody>
            <VStack spacing={4} textAlign="center">
              <HStack spacing={3}>
                <Icon as={FaClock} color="blue.500" />
                <Heading size="md" color="blue.600">
                  What Happens Next?
                </Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                <VStack spacing={2}>
                  <Text fontWeight="bold" color="blue.700">1. Book Online</Text>
                  <Text fontSize="sm" color="blue.600">Fill out the form and submit your appointment request</Text>
                </VStack>
                <VStack spacing={2}>
                  <Text fontWeight="bold" color="blue.700">2. Confirmation</Text>
                  <Text fontSize="sm" color="blue.600">We'll contact you within 24 hours to confirm your appointment</Text>
                </VStack>
                <VStack spacing={2}>
                  <Text fontWeight="bold" color="blue.700">3. Service Day</Text>
                  <Text fontSize="sm" color="blue.600">Our expert technicians will service your boat at the scheduled time</Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
      </Container>
    </Box>
  );
};

export default UserAppointmentsPage;
