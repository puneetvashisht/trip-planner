import Card from 'react-bootstrap/Card';
import * as Icon from 'react-bootstrap-icons';
import { FloatingLabel, Form } from 'react-bootstrap';
import { useState } from 'react';

const Activity = (props) => {

    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(props.description);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleEditActivity = () => {
        fetch(`http://localhost:9090/api/itinerary/${props.itineraryId}/activities/${props.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: description })
        })
        .then(response => {
            console.log(response.status);
            setIsEditing(false);
        })
    }

    const handleDeleteActivity = () => {
        console.log(props.itineraryId);
        console.log(props.id);
        fetch(`http://localhost:9090/api/itinerary/${props.itineraryId}/activities/${props.id}`, {
            method: 'DELETE'
        })
        .then(response => console.log(response.status))
        // .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    return (
        <Card>
            <Card.Body>
                {/* clickable icon  */}
                <div className="d-flex justify-content-end">
                    <Icon.Trash className="justify-content-end" onClick={() => handleDeleteActivity()}/>
                    <Icon.PencilSquare className="justify-content-end" onClick={() => setIsEditing(true)}/>   
                </div>
             
                {/* <Card.Title>{props.title}</Card.Title> */}
                <FloatingLabel controlId="floatingTextarea2" label="Things to do">
                    <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: '50px' }}
                    value={description}
                    onChange={handleDescriptionChange}
                    disabled={!isEditing}
                    onBlur={handleEditActivity}
                    />
                </FloatingLabel>
                {/* <Card.Text>{props.description}</Card.Text> */}
                <Card.Text><Icon.Clock /> {props?.startTime.split(':')[0]}:{props.startTime.split(':')[1]} - {props.endTime.split(':')[0]}:{props.endTime.split(':')[1]}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Activity;