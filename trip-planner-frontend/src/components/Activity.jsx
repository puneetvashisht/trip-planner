import Card from 'react-bootstrap/Card';

const Activity = (props) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.description}</Card.Text>
                <Card.Text>{props.startTime}</Card.Text>
                <Card.Text>{props.endTime}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Activity;