import React from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Icon, 
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Image,
  Badge,
  Divider,
  Button,
  Flex,
  Stack
} from '@chakra-ui/react';
import { 
  FaShip, 
  FaTools, 
  FaShieldAlt, 
  FaUsers, 
  FaAward, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaWrench,
  FaLifeRing,
  FaChartLine,
  FaClock
} from 'react-icons/fa';
// import StunningFooter from '../../components/StunningFooter';
import LiveChatWidget from '../../components/LiveChatWidget';

const CompleteAboutPage = () => {
  const textColor = useColorModeValue('gray.900', 'white');
  const subTextColor = useColorModeValue('gray.700', 'gray.100');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const services = [
    {
      icon: FaWrench,
      title: "Boat Maintenance",
      description: "Comprehensive maintenance services including engine tune-ups, hull cleaning, system inspections, oil changes, filter replacements, and seasonal preparations to keep your vessel in perfect condition year-round.",
      color: "blue"
    },
    {
      icon: FaLifeRing,
      title: "Emergency Repairs",
      description: "24/7 emergency repair services for critical issues including engine failures, electrical problems, hull damage, and navigation system repairs. Our expert technicians are always ready to help when you need it most.",
      color: "red"
    },
    {
      icon: FaShieldAlt,
      title: "Insurance Support",
      description: "Complete insurance claim assistance, damage assessment, documentation support, and coordination with insurance companies to ensure smooth processing of your marine insurance claims.",
      color: "green"
    },
    {
      icon: FaChartLine,
      title: "Performance Optimization",
      description: "Advanced diagnostics, performance tuning, fuel system optimization, propeller balancing, and engine calibration to maximize your boat's efficiency, speed, and fuel economy.",
      color: "purple"
    },
    {
      icon: FaTools,
      title: "Custom Modifications",
      description: "Professional installation of marine electronics, navigation systems, safety equipment, and custom modifications tailored to your specific boating needs and preferences.",
      color: "orange"
    },
    {
      icon: FaShip,
      title: "Marine Surveying",
      description: "Comprehensive boat inspections, pre-purchase surveys, insurance surveys, and condition assessments conducted by certified marine surveyors to ensure vessel safety and value.",
      color: "teal"
    }
  ];

  const stats = [
    { number: "500+", label: "Boats Serviced" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" }
  ];


  return (
    <Box minH="100vh" position="relative">
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-br, blue.50, cyan.50, teal.50)"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgImage="url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop')"
          bgSize="cover"
          bgPosition="center"
          opacity={0.3}
          zIndex={0}
        />
        {/* Dark overlay for better text contrast */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.4)"
          zIndex={0}
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <HStack spacing={4}>
              <Icon as={FaShip} boxSize={16} color="blue.500" />
              <Heading
                as="h1"
                size="3xl"
                fontWeight="black"
                bgGradient="linear(to-r, blue.600, cyan.500, teal.500)"
                bgClip="text"
              >
                Marine Service Center
              </Heading>
            </HStack>
            
            <Text fontSize="xl" color="white" maxW="3xl" lineHeight="tall" fontWeight="500" textShadow="0 2px 4px rgba(0,0,0,0.3)">
              Your premier destination for professional marine services, boat maintenance, and expert technical support. 
              With over 15 years of experience, we've been the trusted choice for boat owners who demand excellence.
              We specialize in everything from routine maintenance to complex engine overhauls, ensuring your vessel 
              performs at its peak while maintaining the highest safety standards.
            </Text>

            <HStack spacing={8} mt={8}>
              {stats.map((stat, index) => (
                <VStack key={index} spacing={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="white" textShadow="0 2px 4px rgba(0,0,0,0.5)">
                    {stat.number}
                  </Text>
                  <Text fontSize="sm" color="white" textAlign="center" fontWeight="500" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={16}>
        {/* Our Story Section */}
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={6} color={textColor}>
              Our Story
            </Heading>
            <Text fontSize="lg" color={subTextColor} maxW="4xl" mx="auto" lineHeight="tall" fontWeight="500">
              Founded in 2008, Marine Service Center began as a small family business with a passion for boats and the ocean. 
              What started as a local repair shop has grown into a comprehensive marine service provider, serving boat owners 
              across the region. Our commitment to quality, reliability, and customer satisfaction has made us the go-to choice 
              for professional marine services.
            </Text>
            
            <VStack spacing={6} mt={8} align="stretch">
              <Box>
                <Heading size="lg" mb={4} color={textColor}>
                  Our Mission
                </Heading>
                <Text fontSize="md" color={subTextColor} lineHeight="tall" fontWeight="500">
                  To provide exceptional marine services that exceed our customers' expectations while maintaining the highest 
                  standards of safety, quality, and environmental responsibility. We believe every boat owner deserves 
                  reliable, professional service that keeps them safe on the water.
                </Text>
              </Box>
              
              <Box>
                <Heading size="lg" mb={4} color={textColor}>
                  Our Vision
                </Heading>
                <Text fontSize="md" color={subTextColor} lineHeight="tall" fontWeight="500">
                  To be the leading marine service provider in the region, recognized for our innovation, expertise, and 
                  unwavering commitment to customer satisfaction. We envision a future where every boat owner has access 
                  to world-class marine services that enhance their boating experience.
                </Text>
              </Box>
              
              <Box>
                <Heading size="lg" mb={4} color={textColor}>
                  Our Values
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Icon as={FaShieldAlt} color="blue.500" />
                      <Text fontWeight="semibold" color={textColor}>Safety First</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaAward} color="green.500" />
                      <Text fontWeight="semibold" color={textColor}>Quality Excellence</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaUsers} color="purple.500" />
                      <Text fontWeight="semibold" color={textColor}>Customer Focus</Text>
                    </HStack>
                  </VStack>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Icon as={FaTools} color="orange.500" />
                      <Text fontWeight="semibold" color={textColor}>Technical Expertise</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaClock} color="teal.500" />
                      <Text fontWeight="semibold" color={textColor}>Reliability</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaShip} color="cyan.500" />
                      <Text fontWeight="semibold" color={textColor}>Marine Passion</Text>
                    </HStack>
                  </VStack>
                </SimpleGrid>
              </Box>
            </VStack>
          </Box>

          {/* Services Section */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color={textColor}>
              Our Services
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  bg={cardBg} 
                  border="2px solid"
                  borderColor={borderColor}
                  _hover={{
                    transform: "translateY(-5px)",
                    shadow: "xl",
                    borderColor: `${service.color}.300`
                  }}
                  transition="all 0.3s ease"
                >
                  <CardBody textAlign="center" p={6}>
                    <Icon 
                      as={service.icon} 
                      boxSize={12} 
                      color={`${service.color}.500`} 
                      mb={4}
                    />
                    <Heading size="md" mb={3} color={textColor}>
                      {service.title}
                    </Heading>
                    <Text fontSize="sm" color={subTextColor} lineHeight="tall" fontWeight="500">
                      {service.description}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Why Choose Us Section */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color={textColor}>
              Why Choose Marine Service Center?
            </Heading>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              <VStack spacing={6} align="stretch">
                <HStack spacing={4} align="start">
                  <Icon as={FaAward} boxSize={8} color="gold" />
                  <Box>
                    <Heading size="md" mb={2} color={textColor}>
                      Certified Excellence
                    </Heading>
                    <Text color={subTextColor} fontWeight="500">
                      All our technicians are certified marine professionals with extensive training and experience in modern marine technology and safety protocols.
                    </Text>
                  </Box>
                </HStack>
                
                <HStack spacing={4} align="start">
                  <Icon as={FaClock} boxSize={8} color="green.500" />
                  <Box>
                    <Heading size="md" mb={2} color={textColor}>
                      Quick Turnaround
                    </Heading>
                    <Text color={subTextColor} fontWeight="500">
                      We understand your time is valuable. Most services are completed within 24-48 hours with same-day emergency repairs available.
                    </Text>
                  </Box>
                </HStack>
                
                <HStack spacing={4} align="start">
                  <Icon as={FaShieldAlt} boxSize={8} color="blue.500" />
                  <Box>
                    <Heading size="md" mb={2} color={textColor}>
                      Warranty Protection
                    </Heading>
                    <Text color={subTextColor} fontWeight="500">
                      All our work comes with comprehensive warranty coverage including parts and labor guarantees for your complete peace of mind.
                    </Text>
                  </Box>
                </HStack>
              </VStack>
              
              <Box>
                <Image
                  src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"
                  alt="Marine Service Center Workshop"
                  borderRadius="lg"
                  shadow="lg"
                />
              </Box>
            </SimpleGrid>
          </Box>

          {/* Company Details Section */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color={textColor}>
              About Our Company
            </Heading>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="lg" mb={4} color={textColor}>
                    Company Overview
                  </Heading>
                  <Text fontSize="md" color={subTextColor} lineHeight="tall" fontWeight="500">
                    Marine Service Center is a full-service marine facility specializing in boat maintenance, repairs, and sales. 
                    We operate from a state-of-the-art 15,000 square foot facility equipped with modern diagnostic equipment, 
                    hydraulic lifts, and specialized marine tools. Our company has grown from a small family operation to 
                    become the region's most trusted marine service provider.
                  </Text>
                </Box>
                
                <Box>
                  <Heading size="lg" mb={4} color={textColor}>
                    Facility & Equipment
                  </Heading>
                  <Text fontSize="md" color={subTextColor} lineHeight="tall" fontWeight="500">
                    Our facility features 12 service bays, a dedicated parts warehouse, customer lounge, and administrative offices. 
                    We maintain an extensive inventory of marine parts and accessories from leading manufacturers. Our equipment 
                    includes computerized diagnostic systems, precision alignment tools, and specialized marine testing equipment 
                    to ensure accurate diagnosis and repair of all marine systems.
                  </Text>
                </Box>
                
                <Box>
                  <Heading size="lg" mb={4} color={textColor}>
                    Certifications & Partnerships
                  </Heading>
                  <Text fontSize="md" color={subTextColor} lineHeight="tall" fontWeight="500">
                    We are certified by major marine engine manufacturers including Mercury, Yamaha, and Volvo Penta. 
                    Our partnerships with leading marine parts suppliers ensure we have access to genuine OEM parts and 
                    the latest technical support. We maintain certifications in marine safety, environmental compliance, 
                    and quality management systems.
                  </Text>
                </Box>
              </VStack>
              
              <Box>
                <Image
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                  alt="Marine Service Center Facility"
                  borderRadius="lg"
                  shadow="lg"
                />
              </Box>
            </SimpleGrid>
          </Box>

          {/* Spare Parts Section */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color={textColor}>
              Marine Spare Parts & Accessories
            </Heading>
            <VStack spacing={8} align="stretch">
              <Text fontSize="lg" color={subTextColor} textAlign="center" lineHeight="tall" fontWeight="500">
                We maintain one of the largest inventories of marine spare parts and accessories in the region, 
                ensuring quick turnaround times for all your repair needs.
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <Card bg={cardBg} border="2px solid" borderColor={borderColor}>
                  <CardBody textAlign="center" p={6}>
                    <Icon as={FaWrench} boxSize={10} color="blue.500" mb={4} />
                    <Heading size="md" mb={3} color={textColor}>
                      Engine Parts
                    </Heading>
                    <Text fontSize="sm" color={subTextColor} lineHeight="tall" fontWeight="500">
                      Complete inventory of engine components including filters, belts, hoses, gaskets, 
                      spark plugs, and electrical components for all major marine engine brands.
                    </Text>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="2px solid" borderColor={borderColor}>
                  <CardBody textAlign="center" p={6}>
                    <Icon as={FaShip} boxSize={10} color="green.500" mb={4} />
                    <Heading size="md" mb={3} color={textColor}>
                      Hull & Deck Parts
                    </Heading>
                    <Text fontSize="sm" color={subTextColor} lineHeight="tall" fontWeight="500">
                      Extensive selection of hull fittings, deck hardware, cleats, rails, hatches, 
                      and structural components for boats of all sizes and types.
                    </Text>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="2px solid" borderColor={borderColor}>
                  <CardBody textAlign="center" p={6}>
                    <Icon as={FaTools} boxSize={10} color="purple.500" mb={4} />
                    <Heading size="md" mb={3} color={textColor}>
                      Electrical Systems
                    </Heading>
                    <Text fontSize="sm" color={subTextColor} lineHeight="tall" fontWeight="500">
                      Marine-grade electrical components including wiring, switches, fuses, 
                      navigation lights, and electronic system parts for reliable performance.
                    </Text>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="2px solid" borderColor={borderColor}>
                  <CardBody textAlign="center" p={6}>
                    <Icon as={FaShieldAlt} boxSize={10} color="orange.500" mb={4} />
                    <Heading size="md" mb={3} color={textColor}>
                      Safety Equipment
                    </Heading>
                    <Text fontSize="sm" color={subTextColor} lineHeight="tall" fontWeight="500">
                      Complete range of safety equipment including life jackets, fire extinguishers, 
                      emergency signaling devices, and first aid supplies for marine environments.
                    </Text>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Boat Packages Section */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color={textColor}>
              Boat Service Packages
            </Heading>
            <VStack spacing={8} align="stretch">
              <Text fontSize="lg" color={subTextColor} textAlign="center" lineHeight="tall" fontWeight="500">
                We offer comprehensive service packages designed to keep your boat in peak condition 
                throughout the year, with options to suit every budget and usage pattern.
              </Text>
              
              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                <Card bg={cardBg} border="2px solid" borderColor="green.300" _hover={{ borderColor: "green.400" }}>
                  <CardHeader textAlign="center">
                    <Heading size="lg" color="green.600">Basic Package</Heading>
                    <Text color="green.500" fontWeight="bold" fontSize="xl">LKR 99,000</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={FaWrench} color="green.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Engine oil change and filter replacement</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="green.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Basic engine inspection and tune-up</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="green.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Hull cleaning and basic maintenance</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="green.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Safety equipment check</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="2px solid" borderColor="blue.300" _hover={{ borderColor: "blue.400" }}>
                  <CardHeader textAlign="center">
                    <Heading size="lg" color="blue.600">Premium Package</Heading>
                    <Text color="blue.500" fontWeight="bold" fontSize="xl">LKR 199,000</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={FaWrench} color="blue.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Everything in Basic Package</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="blue.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Complete engine diagnostic and service</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="blue.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Electrical system inspection and repair</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="blue.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Propeller inspection and balancing</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="blue.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Navigation system check</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="2px solid" borderColor="purple.300" _hover={{ borderColor: "purple.400" }}>
                  <CardHeader textAlign="center">
                    <Heading size="lg" color="purple.600">Ultimate Package</Heading>
                    <Text color="purple.500" fontWeight="bold" fontSize="xl">LKR 329,000</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={FaWrench} color="purple.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Everything in Premium Package</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="purple.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Complete boat detailing and waxing</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="purple.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Performance optimization and tuning</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="purple.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Annual safety inspection and certification</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaWrench} color="purple.500" />
                        <Text fontSize="sm" color={subTextColor} fontWeight="500">Priority service scheduling</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
              
              <Box textAlign="center" mt={6}>
                <Text fontSize="md" color={subTextColor} fontWeight="500">
                  All packages include 90-day warranty on parts and labor. 
                  Seasonal packages and custom maintenance plans available upon request.
                </Text>
              </Box>
            </VStack>
          </Box>


          {/* Contact Section */}
          <Card bg={cardBg} border="2px solid" borderColor={borderColor}>
            <CardHeader textAlign="center">
              <Heading size="lg" color={textColor}>
                Get In Touch
              </Heading>
              <Text color={subTextColor}>
                Ready to experience the Marine Service Center difference?
              </Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack spacing={3}>
                  <Icon as={FaPhone} boxSize={6} color="blue.500" />
                  <Text fontWeight="semibold" color={textColor}>
                    Call Us
                  </Text>
                  <Text color={subTextColor} fontWeight="500">
                    +1 (555) 123-4567<br />
                    Emergency: +1 (555) 123-HELP
                  </Text>
                </VStack>
                
                <VStack spacing={3}>
                  <Icon as={FaEnvelope} boxSize={6} color="blue.500" />
                  <Text fontWeight="semibold" color={textColor}>
                    Email Us
                  </Text>
                  <Text color={subTextColor} fontWeight="500">
                    info@marineservice.com<br />
                    support@marineservice.com
                  </Text>
                </VStack>
                
                <VStack spacing={3}>
                  <Icon as={FaMapMarkerAlt} boxSize={6} color="blue.500" />
                  <Text fontWeight="semibold" color={textColor}>
                    Visit Us
                  </Text>
                  <Text color={subTextColor} fontWeight="500">
                    123 Harbor Drive<br />
                    Marina Bay, CA 90210<br />
                    <Text fontSize="sm" color="blue.500" mt={1}>
                      Open: Mon-Fri 7AM-6PM, Sat 8AM-4PM
                    </Text>
                  </Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
      
      <LiveChatWidget />
      {/* <StunningFooter /> */}
    </Box>
  );
};

export default CompleteAboutPage;



