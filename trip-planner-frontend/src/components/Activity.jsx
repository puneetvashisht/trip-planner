import { useState } from 'react';
import { Card, Form, Button, Badge, Row, Col } from 'react-bootstrap';
import { Pencil, Trash, Clock, Check, X } from 'react-bootstrap-icons';
import './Activity.css';

const Activity = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(props.description);
    const [loading, setLoading] = useState(false);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleEditActivity = async () => {
        if (!description.trim()) {
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/api/itinerary/${props.itineraryId}/activities/${props.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: description })
            });

            if (!response.ok) {
                throw new Error('Failed to update activity');
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteActivity = async () => {
        if (!window.confirm('Are you sure you want to delete this activity?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/api/itinerary/${props.itineraryId}/activities/${props.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete activity');
            }

            // Trigger parent component refresh if needed
            if (props.onDelete) {
                props.onDelete(props.id);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancelEdit = () => {
        setDescription(props.description);
        setIsEditing(false);
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString.substring(0, 5); // Format as HH:MM
    };

    return (
        <Card className="activity-card mb-3 shadow-sm border-0">
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                        <Clock className="text-primary me-2" />
                        <Badge bg="info" className="me-2">
                            {formatTime(props?.startTime)} - {formatTime(props.endTime)}
                        </Badge>
                    </div>
                    
                    <div className="activity-actions">
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => setIsEditing(true)}
                                    title="Edit Activity"
                                >
                                    <Pencil className="me-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={handleDeleteActivity}
                                    title="Delete Activity"
                                >
                                    <Trash className="me-1" />
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={handleEditActivity}
                                    disabled={loading}
                                    title="Save Changes"
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <Check className="me-1" />
                                    )}
                                    Save
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    title="Cancel Edit"
                                >
                                    <X className="me-1" />
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe your activity..."
                            rows={3}
                            className="activity-textarea"
                            autoFocus
                        />
                    </Form.Group>
                ) : (
                    <div className="activity-description">
                        <p className="mb-0">
                            {description || 'No description available'}
                        </p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default Activity;