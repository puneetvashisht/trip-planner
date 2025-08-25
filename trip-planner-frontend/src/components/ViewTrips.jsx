import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Calendar, GeoAlt, Clock, PlusCircle, Eye } from 'react-bootstrap-icons';
import './ViewTrips.css';

const ViewTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrips = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:9090/api/trips/my-trips', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch trips');
                }

                const data = await response.json();
                setTrips(data);
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError('Failed to load trips. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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
            <div className="view-trips-container">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <Spinner animation="border" variant="primary" size="lg" />
                            <p className="mt-3 text-muted">Loading your trips...</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-trips-container">
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

    if (trips.length === 0) {
        return (
            <div className="view-trips-container">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={8} className="text-center">
                            <Card className="empty-state-card border-0 shadow-sm">
                                <Card.Body className="p-5">
                                    <div className="empty-state-icon mb-4">
                                        <GeoAlt size={64} className="text-muted" />
                                    </div>
                                    <h3 className="text-muted mb-3">No trips planned yet</h3>
                                    <p className="text-muted mb-4">
                                        Start planning your next adventure by creating your first trip!
                                    </p>
                                    <Link to="/add-trip">
                                        <Button variant="primary" size="lg" className="px-4">
                                            <PlusCircle className="me-2" />
                                            Plan Your First Trip
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div className="view-trips-container">
            <Container className="py-4">
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="mb-2">
                                    <GeoAlt className="me-3 text-primary" />
                                    My Trips
                                </h2>
                                <p className="text-muted mb-0">
                                    You have {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned
                                </p>
                            </div>
                            <Link to="/add-trip">
                                <Button variant="primary" size="lg" className="px-4">
                                    <PlusCircle className="me-2" />
                                    Add New Trip
                                </Button>
                            </Link>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {trips.map((trip, index) => (
                        <Col key={trip.id || index} lg={6} xl={4} className="mb-4">
                            <Card className="trip-card h-100 shadow-sm border-0">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <Badge bg="primary" className="px-3 py-2">
                                            {getTripDuration(trip.startDate, trip.endDate)}
                                        </Badge>
                                        <Link to={`/trip/${trip.id}`}>
                                            <Button variant="outline-primary" size="sm">
                                                <Eye className="me-1" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>

                                    <Card.Title className="h5 mb-3">
                                        <Link 
                                            to={`/trip/${trip.id}`} 
                                            className="text-decoration-none text-dark"
                                        >
                                            {trip.title || 'Untitled Trip'}
                                        </Link>
                                    </Card.Title>

                                    <Card.Text className="text-muted mb-4">
                                        {trip.description || 'No description available'}
                                    </Card.Text>

                                    <div className="trip-details">
                                        <div className="detail-item mb-2">
                                            <Calendar className="me-2 text-primary" />
                                            <span className="text-muted">
                                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                            </span>
                                        </div>
                                        
                                        {trip.location && (
                                            <div className="detail-item mb-2">
                                                <GeoAlt className="me-2 text-primary" />
                                                <span className="text-muted">{trip.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default ViewTrips;