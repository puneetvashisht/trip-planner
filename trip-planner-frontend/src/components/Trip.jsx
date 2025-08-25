import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Trip.css";
import Image from 'react-bootstrap/Image';

import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Calendar, GeoAlt, Clock, PlusCircle, Save, X, Image as ImageIcon } from 'react-bootstrap-icons';
import Itinerary from "./Itinerary";

const Trip = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [itinerary, setItinerary] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
    });
    const [showAddItinerary, setShowAddItinerary] = useState(false);

    const addItineraryToTrip = async () => {
        if (!itinerary.title.trim() || !itinerary.description.trim() || !itinerary.startDate || !itinerary.endDate) {
            setMessage({ type: 'warning', text: 'Please fill in all fields' });
            return;
        }

        if (new Date(itinerary.startDate) > new Date(itinerary.endDate)) {
            setMessage({ type: 'warning', text: 'End date must be after start date' });
            return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ type: 'danger', text: 'No authentication token found' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/api/trips/${id}/itinerary`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itinerary)
            });

            if (!response.ok) {
                throw new Error('Failed to add itinerary');
            }

            setMessage({ type: 'success', text: 'Itinerary added successfully!' });
            
            // Reset form and hide add itinerary form
            setItinerary({
                title: "",
                description: "",
                startDate: "",
                endDate: ""
            });
            setShowAddItinerary(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

            // Refresh trip data
            getTrip();

        } catch (error) {
            console.error('Error adding itinerary:', error);
            setMessage({ type: 'danger', text: error.message || 'Failed to add itinerary. Please try again.' });
        }
    };

    
    const getTrip = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/api/trips/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trip');
            }

            const data = await response.json();
            console.log('Trip data received:', data);
            console.log('Itineraries:', data.itinerary);
            console.log('Itinerary data structure:', data.itinerary ? data.itinerary.map(item => ({
                id: item.id,
                title: item.title,
                startDate: item.startDate,
                endDate: item.endDate,
                description: item.description,
                activities: item.activities,
                activities_list: item.activities_list,
                activitiesList: item.activitiesList,
                activity: item.activity,
                keys: Object.keys(item),
                fullItem: item
            })) : 'No itineraries');
            setTrip(data);
        } catch (error) {
            console.error('Error fetching trip:', error);
            setError('Failed to load trip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTrip();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItinerary(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear any existing messages when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const handleCancelAdd = () => {
        setItinerary({
            title: "",
            description: "",
            startDate: "",
            endDate: ""
        });
        setShowAddItinerary(false);
        setMessage({ type: '', text: '' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTripDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 'N/A';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    };

    if (loading) {
        return (
            <div className="trip-page-container">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <Spinner animation="border" variant="primary" size="lg" />
                            <p className="mt-3 text-muted">Loading trip details...</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trip-page-container">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Alert variant="danger" className="text-center">
                                <h4>Oops! Something went wrong</h4>
                                <p>{error}</p>
                                <Button 
                                    variant="outline-danger" 
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </Button>
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="trip-page-container">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Alert variant="warning" className="text-center">
                                <h4>Trip not found</h4>
                                <p>The trip you're looking for doesn't exist or you don't have permission to view it.</p>
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div className="trip-page-container">
            <Container className="py-4">
                {/* Trip Header */}
                <Row className="mb-4">
                    <Col>
                        <div className="trip-header">
                                                            <div className="d-flex align-items-center mb-3">
                                    <GeoAlt className="me-3 text-primary" size={32} />
                                    <div>
                                        <h1 className="mb-2">{trip.title || 'Untitled Trip'}</h1>
                                        <div className="trip-meta">
                                            <Badge bg="primary" className="me-2">
                                                {getTripDuration(trip.startDate, trip.endDate)}
                                            </Badge>
                                            <Badge bg="info" className="me-2">
                                                {trip.itinerary ? trip.itinerary.length : 0} {trip.itinerary && trip.itinerary.length === 1 ? 'itinerary' : 'itineraries'}
                                            </Badge>
                                        </div>
                                        <div className="trip-dates mt-2">
                                            <Calendar className="me-2 text-primary" />
                                            <span className="text-muted fw-bold">Trip Period:</span>
                                            <span className="ms-2">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            <p className="trip-description mb-0">
                                {trip.description || 'No description available'}
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Trip Content */}
                <Row>
                    {/* Left Column - Trip Image and Details */}
                    <Col lg={6} className="mb-4">
                        <Card className="trip-image-card border-0 shadow-sm">
                            <Card.Body className="p-0">
                                {trip.imageUrl ? (
                                    <Image src={'http://localhost:9090/api/trips/images/' + trip.imageUrl} fluid className="trip-image" alt={trip.title} />
                                ) : (
                                    <div className="trip-image-placeholder">
                                        <div className="placeholder-content">
                                            <ImageIcon className="placeholder-icon mb-3" size={48} />
                                            <h5 className="text-muted mb-2">No Image Available</h5>
                                            <p className="text-muted mb-0">This trip doesn't have an image yet</p>
                                        </div>
                                    </div>
                                )}
                                <div className="trip-image-overlay">
                                    <div className="trip-dates">
                                        <div className="date-item">
                                            <Calendar className="me-2 text-white" />
                                            <span className="text-white fw-bold">From:</span>
                                            <span className="text-white ms-2">{formatDate(trip.startDate)}</span>
                                        </div>
                                        <div className="date-item">
                                            <Calendar className="me-2 text-white" />
                                            <span className="text-white fw-bold">To:</span>
                                            <span className="text-white ms-2">{formatDate(trip.endDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Column - Add Itinerary Form */}
                    <Col lg={6} className="mb-4">
                        <Card className="add-itinerary-card border-0 shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <PlusCircle className="me-2" />
                                        Add New Itinerary
                                    </h5>
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={() => setShowAddItinerary(!showAddItinerary)}
                                    >
                                        {showAddItinerary ? <X /> : <PlusCircle />}
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {message.text && (
                                    <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                                        {message.text}
                                    </Alert>
                                )}

                                {showAddItinerary ? (
                                    <Form>
                                        <Row>
                                            <Col md={12} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-bold">Itinerary Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="title"
                                                        value={itinerary.title}
                                                        onChange={handleChange}
                                                        placeholder="Enter itinerary title"
                                                        className="border-2"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-bold">Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="description"
                                                        value={itinerary.description}
                                                        onChange={handleChange}
                                                        placeholder="Describe this itinerary..."
                                                        rows={3}
                                                        className="border-2"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-bold">Start Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="startDate"
                                                        value={itinerary.startDate}
                                                        onChange={handleChange}
                                                        className="border-2"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-bold">End Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="endDate"
                                                        value={itinerary.endDate}
                                                        onChange={handleChange}
                                                        className="border-2"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="success"
                                                onClick={addItineraryToTrip}
                                                className="flex-fill"
                                            >
                                                <Save className="me-2" />
                                                Add Itinerary
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={handleCancelAdd}
                                                className="flex-fill"
                                            >
                                                <X className="me-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <div className="text-center text-muted py-4">
                                        <PlusCircle size={48} className="mb-3 opacity-50" />
                                        <p className="mb-0">Click the button above to add a new itinerary</p>
                                        <small>Plan your daily activities and schedules</small>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Itineraries List */}
                <Row>
                    <Col>
                        <div className="itineraries-section">
                            <h3 className="mb-4">
                                <Clock className="me-2 text-primary" />
                                Trip Itineraries
                            </h3>

                            {(trip.itinerary || trip.itineraries || trip.itinerary_list || trip.itineraryList) && 
                             (trip.itinerary?.length > 0 || trip.itineraries?.length > 0 || trip.itinerary_list?.length > 0 || trip.itineraryList?.length > 0) ? (
                                (trip.itinerary || trip.itineraries || trip.itinerary_list || trip.itineraryList).map((itineraryItem, index) => (
                                    <Itinerary 
                                        key={itineraryItem.id || index} 
                                        {...itineraryItem}
                                        onActivityAdded={() => getTrip()}
                                        onActivityDeleted={() => getTrip()}
                        
                                    />
                                ))
                            ) : (
                                <Card className="empty-itinerary-card border-0 shadow-sm">
                                    <Card.Body className="text-center py-5">
                                        <Clock size={64} className="mb-3 text-muted opacity-50" />
                                        <h4 className="text-muted mb-3">No itineraries planned yet</h4>
                                        <div className="trip-context mb-4">
                                            <p className="text-muted mb-2">
                                                Your trip is scheduled from <strong>{formatDate(trip.startDate)}</strong> to <strong>{formatDate(trip.endDate)}</strong>
                                            </p>
                                            <p className="text-muted mb-0">
                                                Start planning your daily activities by adding your first itinerary above!
                                            </p>
                                        </div>
                                        <Button 
                                            variant="primary" 
                                            size="lg"
                                            onClick={() => setShowAddItinerary(true)}
                                        >
                                            <PlusCircle className="me-2" />
                                            Add First Itinerary
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Trip;