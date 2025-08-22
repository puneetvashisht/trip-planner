import Card from 'react-bootstrap/Card';
import Activity from './Activity';


const Itinerary = (props) => {
    return (
      <Card>
        <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.description}</Card.Text>
            <Card.Text>{props.startDate}</Card.Text>
            <Card.Text>{props.endDate}</Card.Text>

            {props.activities.map((activity, i) => (
                <Activity key={i} {...activity} />
            ))}
        </Card.Body>
      </Card>
    )
}

export default Itinerary;