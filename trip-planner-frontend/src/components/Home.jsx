import { Container, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();

    return (
        <Container className="mt-4">
            <Card className="text-center">
                <Card.Body>
                    <Card.Title as="h1">Welcome to Trip Planner!</Card.Title>
                    <Card.Text className="lead">
                        Hello, {user.name}! Start planning your next adventure.
                    </Card.Text>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <Button as={Link} to="/add-trip" variant="primary" size="lg" className="me-md-2">
                            Plan New Trip
                        </Button>
                        <Button as={Link} to="/view-trips" variant="outline-primary" size="lg">
                            View My Trips
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Home;