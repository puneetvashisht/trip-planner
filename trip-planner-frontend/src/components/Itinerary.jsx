import Card from 'react-bootstrap/Card';
import Activity from './Activity';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import AddActivity from './AddActivity';

const Itinerary = (props) => {
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [newActivity, setNewActivity] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: ''
    });

    const handleAddActivity = () => {
        // setNewActivity(activity);
        // setShowAddActivity(false);
        console.log(newActivity);
        fetch(`http://localhost:9090/api/itinerary/${props.id}/activities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newActivity)
        })
        .then(response => response.json())
        // .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    return (
      <Card>
        <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.description}</Card.Text>
            <Card.Text>{props.startDate}</Card.Text>
            <Card.Text>{props.endDate}</Card.Text>

            {props.activities.map((activity, i) => (
                <Activity key={i} itineraryId={props.id} {...activity} />
            ))}
              <Button variant="primary" onClick={() => setShowAddActivity(true)}>Add Activity</Button>
            {showAddActivity && (
                <AddActivity newActivity={newActivity} setNewActivity={setNewActivity}  onAddActivity={handleAddActivity} />
            )}
        </Card.Body>
      </Card>
    )
}

export default Itinerary;