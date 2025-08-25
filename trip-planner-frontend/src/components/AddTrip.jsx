import { useState } from "react";
import { Card, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { PlusCircle, GeoAlt, JournalText, Calendar, CalendarDate, InfoCircle, Image, X } from 'react-bootstrap-icons';
import { decodeToken } from '../utils/auth';
import './AddTrip.css';

const AddTrip = () => {
    const [tripData, setTripData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const addTrip = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ type: 'danger', text: 'No authentication token found' });
            return;
        }

        // Extract user ID from JWT token
        const decodedToken = decodeToken(token);
        if (!decodedToken || !decodedToken.userId) {
            setMessage({ type: 'danger', text: 'Invalid token or missing user ID' });
            return;
        }

        // Validate form data
        if (!tripData.title.trim() || !tripData.description.trim() || !tripData.startDate || !tripData.endDate) {
            setMessage({ type: 'warning', text: 'Please fill in all fields' });
            return;
        }

        // Validate dates
        if (new Date(tripData.startDate) >= new Date(tripData.endDate)) {
            setMessage({ type: 'warning', text: 'End date must be after start date' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            console.log("Adding trip with image");
            console.log(tripData);
            
            // Create FormData for multipart/form-data
            const formData = new FormData();
            
            // Add trip data
            formData.append('title', tripData.title);
            formData.append('description', tripData.description);
            formData.append('startDate', tripData.startDate);
            formData.append('endDate', tripData.endDate);
            formData.append('ownerId', decodedToken.userId);
            
            // Add image if selected
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await fetch("http://localhost:9090/api/trips/create-with-image", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                    // Note: Don't set Content-Type for FormData, browser will set it automatically
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add trip');
            }

            setMessage({ type: 'success', text: 'Trip added successfully!' });
            
            // Reset form
            setTripData({
                title: "",
                description: "",
                startDate: "",
                endDate: ""
            });
            setSelectedImage(null);
            setImagePreview(null);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

        } catch (error) {
            console.error('Error adding trip:', error);
            setMessage({ type: 'danger', text: error.message || 'Failed to add trip. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear any existing messages when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'warning', text: 'Please select a valid image file' });
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'warning', text: 'Image size should be less than 5MB' });
                return;
            }

            setSelectedImage(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            
            // Clear any existing messages
            if (message.text) {
                setMessage({ type: '', text: '' });
            }
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addTrip();
    };

    return (
        <div className="add-trip-container">
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col lg={8} md={10}>
                        <Card className="trip-card shadow-sm border-0">
                            <Card.Header className="bg-primary text-white text-center py-3">
                                <h3 className="mb-0">
                                    <PlusCircle className="me-2" />
                                    Plan Your Next Adventure
                                </h3>
                            </Card.Header>
                            <Card.Body className="p-4">
                            {message.text && (
                                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                                    {message.text}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={12} className="mb-4">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">
                                                <GeoAlt className="me-2 text-primary" />
                                                Trip Title
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={tripData.title}
                                                onChange={handleChange}
                                                placeholder="Enter your trip title (e.g., 'Weekend in Paris')"
                                                size="lg"
                                                className="border-2"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} className="mb-4">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">
                                                <JournalText className="me-2 text-primary" />
                                                Description
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="description"
                                                value={tripData.description}
                                                onChange={handleChange}
                                                placeholder="Describe your trip plans, activities, and what you're looking forward to..."
                                                rows={4}
                                                className="border-2"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6} className="mb-4">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">
                                                <Calendar className="me-2 text-primary" />
                                                Start Date
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="startDate"
                                                value={tripData.startDate}
                                                onChange={handleChange}
                                                className="border-2"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-4">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">
                                                <CalendarDate className="me-2 text-primary" />
                                                End Date
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={tripData.endDate}
                                                onChange={handleChange}
                                                className="border-2"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} className="mb-4">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">
                                                <Image className="me-2 text-primary" />
                                                Trip Image (Optional)
                                            </Form.Label>
                                            <div className="image-upload-container">
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="border-2"
                                                    size="lg"
                                                />
                                                <small className="text-muted d-block mt-2">
                                                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                                                </small>
                                            </div>
                                            
                                            {imagePreview && (
                                                <div className="image-preview-container mt-3">
                                                    <div className="position-relative d-inline-block">
                                                        <img 
                                                            src={imagePreview} 
                                                            alt="Trip preview" 
                                                            className="img-preview"
                                                        />
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={removeImage}
                                                            className="remove-image-btn"
                                                            title="Remove Image"
                                                        >
                                                            <X className="me-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className="text-center">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={loading}
                                            className="px-5 py-2 fw-bold shadow-sm"
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Creating Trip...
                                                </>
                                            ) : (
                                                <>
                                                    <PlusCircle className="me-2" />
                                                    Create Trip
                                                </>
                                            )}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Additional Info Card */}
                    <Card className="info-card mt-4 border-0 bg-light">
                        <Card.Body className="text-center text-muted">
                            <InfoCircle className="me-2" />
                            <small>
                                Your trip will be automatically saved and you can add activities and itineraries once created.
                            </small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </div>
    );
};

export default AddTrip;