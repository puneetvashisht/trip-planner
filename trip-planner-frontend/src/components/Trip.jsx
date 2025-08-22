import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Trip.css";
import Image from 'react-bootstrap/Image';
import tokyo from "../assets/images/tokyo.jpg";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Itinerary from "./Itinerary";
import Card from 'react-bootstrap/Card';

const Trip = () => {

    const { id } = useParams();
    const [trip, setTrip] = useState();
    console.log(id);

    const addItineraryToTrip = () => {
        console.log(itinerary);

        fetch(`http://localhost:9090/api/trips/${id}/itinerary`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(itinerary)
        })
            .then(res => console.log(res.status))
    }

    const getTrip = () => {
        fetch(`http://localhost:9090/api/trips/${id}`)
            .then(response => response.json())
            .then(data => setTrip(data));
    }

    useEffect(() => {
        getTrip();
    }, []);

    const [itinerary, setItinerary] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
    });

    const handleChange = (e) => {
        const newItinerary = { ...itinerary };
        newItinerary[e.target.name] = e.target.value;
        setItinerary(newItinerary);
    }

    return (
        <div className="content-section">
            <div className="trip-container">
                <Container>
                    <Row>
                        <Col xs={6} md={6}>
                            <Image src={tokyo} fluid />
                        </Col>
                        <Col xs={6} md={6}>
                            {/* align to bottom */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                <h1>{trip?.title}</h1>
                                <h3>{trip?.description}</h3>
                                <p>From : {trip?.startDate}</p>
                                <p>To : {trip?.endDate}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={6}>
                            <div>
                                {trip?.itinerary.map(itinerary => (
                                    <Itinerary key={itinerary.id} {...itinerary} />
                                ))}
                            </div>
                        </Col>
                        <Col xs={6} md={6}>
                            <Card>
                                <Card.Body>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" name="title" onChange={handleChange} value={itinerary.title} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea id="description" name="description" onChange={handleChange} value={itinerary.description} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date</label>
                                    <input type="date" id="startDate" name="startDate" onChange={handleChange} value={itinerary.startDate} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="endDate">End Date</label>
                                    <input type="date" id="endDate" name="endDate" onChange={handleChange} value={itinerary.endDate} />
                                </div>
                                <button type="button" onClick={addItineraryToTrip}>Add Itinerary</button>
                                </Card.Body> 
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Trip;