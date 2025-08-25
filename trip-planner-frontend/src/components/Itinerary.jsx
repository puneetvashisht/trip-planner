import { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Form, Alert } from 'react-bootstrap';
import { Calendar, Clock, PlusCircle, X, Check, Trash } from 'react-bootstrap-icons';
import Activity from './Activity';
import './Itinerary.css';

const Itinerary = (props) => {
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [newActivity, setNewActivity] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Update dates when props change
    // useEffect(() => {
    //     setNewActivity(prev => ({
    //         ...prev,
    //         startDate: props.startDate || props.start_date,
    //         endDate: props.endDate || props.end_date
    //     }));
    // }, [props.startDate, props.start_date, props.endDate, props.end_date]);

    const deleteItinerary = async (itineraryId) => {
        if (!window.confirm('Are you sure you want to delete this itinerary? This will also remove all associated activities.')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ type: 'danger', text: 'No authentication token found' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/api/itinerary/${itineraryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete itinerary');
            }

            setMessage({ type: 'success', text: 'Itinerary deleted successfully!' });
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

            // Refresh trip data
            getTrip();

        } catch (error) {
            console.error('Error deleting itinerary:', error);
            setMessage({ type: 'danger', text: error.message || 'Failed to delete itinerary. Please try again.' });
        }
    };


    const handleAddActivity = async () => {
        if (!newActivity.title.trim() || !newActivity.description.trim() || !newActivity.startTime || !newActivity.endTime) {
            setMessage({ type: 'warning', text: 'Please fill in all fields' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ type: 'danger', text: 'No authentication token found' });
            setLoading(false);
            return;
        }

        try {
            console.log('Adding activity to itinerary:', props.id);
            console.log('Activity data:', newActivity);
            console.log('API endpoint:', `http://localhost:9090/api/itinerary/${props.id}/activities`);
            
            const response = await fetch(`http://localhost:9090/api/itinerary/${props.id}/activities`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newActivity)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response not ok:', response.status, errorText);
                throw new Error(`Failed to add activity: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log('Activity added successfully:', data);
            
            setMessage({ type: 'success', text: 'Activity added successfully!' });
            
            // Reset form and hide add activity form
            setNewActivity({
                title: '',
                description: '',
                startTime: '',
                endTime: ''
            });
            setShowAddActivity(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

            // Trigger parent refresh if needed
            if (props.onActivityAdded) {
                props.onActivityAdded();
            }

        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'danger', text: error.message || 'Failed to add activity. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAdd = () => {
        setNewActivity({
            title: '',
            description: '',
            startTime: '',
            endTime: ''
        });
        setShowAddActivity(false);
        setMessage({ type: '', text: '' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return 'Invalid Date';
        }
    };

    const formatDateDetailed = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            let prefix = '';
            if (date.toDateString() === today.toDateString()) {
                prefix = 'Today';
            } else if (date.toDateString() === tomorrow.toDateString()) {
                prefix = 'Tomorrow';
            }
            
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            
            return prefix ? `${prefix} (${formattedDate})` : formattedDate;
        } catch (error) {
            console.error('Error formatting detailed date:', dateString, error);
            return 'Invalid Date';
        }
    };

    const getActivityCount = () => {
        // Check multiple possible field names for activities
        const activities = props.activities;
        return Array.isArray(activities) ? activities.length : 0;
    };

    // Get activities from multiple possible field names
    const getActivities = () => {
        return props.activities || [];
    };

    // Debug: Log the props to see what data is being passed
    console.log('Itinerary props:', props);
    console.log('Start date:', props.startDate, 'End date:', props.endDate);
    console.log('Activities count:', getActivityCount());

    return (
        <Card className="itinerary-card mb-4 shadow-sm border-0">
            <Card.Header className="itinerary-header">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title className="h5 mb-2">
                            <Calendar className="me-2 text-primary" />
                            {props.title || 'Untitled Itinerary'}
                        </Card.Title>
                        <div className="itinerary-meta">
                            <div className="date-range mb-2">
                                <Calendar className="me-2 text-primary" />
                                <span className="text-muted fw-bold">Date Range:</span>
                                <span className="ms-2">{formatDateDetailed(props.startDate || props.start_date)} - {formatDateDetailed(props.endDate || props.end_date)}</span>
                            </div>
                            <div className="d-flex gap-2">
                                <Badge bg="secondary">
                                    {formatDate(props.startDate || props.start_date)}
                                </Badge>
                                <Badge bg="secondary">
                                    {formatDate(props.endDate || props.end_date)}
                                </Badge>
                                <Badge bg="info">
                                    {getActivityCount()} {getActivityCount() === 1 ? 'activity' : 'activities'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <Button
                            variant={showAddActivity ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowAddActivity(!showAddActivity)}
                            className="add-activity-btn"
                        >
                            {showAddActivity ? (
                                <>
                                    <X className="me-1" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="me-1" />
                                    Add Activity
                                </>
                            )}
                        </Button>
                        
                    
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteItinerary(props.id)}
                                className="delete-itinerary-btn"
                                title="Delete Itinerary"
                            >
                                <Trash className="me-1" />
                                Delete
                            </Button>
                    
                    </div>
                </div>
            </Card.Header>

            <Card.Body className="p-4">
                {props.description && (
                    <div className="itinerary-description mb-4">
                        <p className="text-muted mb-0">
                            <Clock className="me-2" />
                            {props.description}
                        </p>
                    </div>
                )}

                {message.text && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                        {message.text}
                    </Alert>
                )}

                {showAddActivity && (
                    <div className="add-activity-form mb-4">
                        <Card className="border-primary">
                            <Card.Header className="bg-primary text-white">
                                <h6 className="mb-0">
                                    <PlusCircle className="me-2" />
                                    Add New Activity
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Activity Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter activity title"
                                                value={newActivity.title}
                                                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                                className="border-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Describe the activity..."
                                                value={newActivity.description}
                                                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                                rows={2}
                                                className="border-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Start Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={newActivity.startTime}
                                                onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                                                className="border-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">End Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={newActivity.endTime}
                                                onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                                                className="border-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="success"
                                        onClick={handleAddActivity}
                                        disabled={loading}
                                        className="flex-fill"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="me-2" />
                                                Add Activity
                                            </>
                                        )}
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
                            </Card.Body>
                        </Card>
                    </div>
                )}

                <div className="activities-list">
                    {getActivities().length > 0 ? (
                        getActivities().map((activity, i) => (
                            <Activity 
                                key={i} 
                                itineraryId={props.id} 
                                {...activity}
                                onDelete={(activityId) => {
                                    if (props.onActivityDeleted) {
                                        props.onActivityDeleted(activityId);
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center text-muted py-4">
                            <Clock size={48} className="mb-3 opacity-50" />
                            <p className="mb-0">No activities planned yet</p>
                            <small>Click "Add Activity" to get started</small>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default Itinerary;