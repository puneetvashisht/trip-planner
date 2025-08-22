import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Trip.css";
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
                <h1>{trip?.title}</h1>
                <h3>{trip?.description}</h3>
                <p>{trip?.startDate}</p>
                <p>{trip?.endDate}</p>
                <h4>Itinerary</h4>
                <form>
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
                </form>
                <div className="itinerary-container">
                {trip?.itinerary.map(itinerary => (
                    <div className="itinerary-card" key={itinerary.id}>
                        <h5>{itinerary.title}</h5>
                        <p>{itinerary.description}</p>
                        <p>{itinerary.startDate}</p>
                        <p>{itinerary.endDate}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
        )
}

export default Trip;