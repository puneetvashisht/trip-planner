import { useState, useEffect } from 'react';

const ViewTrips = () => {

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetch('http://localhost:9090/api/trips')
            .then(response => response.json())
            .then(data => setTrips(data))
            .catch(error => console.error('Error fetching trips:', error));
    }, []);

    const tripRows = trips.map((trip,i) => <tr key={i}>
            <td>{trip.title}</td>
            <td>{trip.description}</td>
            <td>{trip.startDate}</td>
            <td>{trip.endDate}</td>
        </tr>
    );

    console.log(trips);

    return (
        // table to display trips
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Trip Title</th>
                    <th>Description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
            </thead>
            <tbody>
                {tripRows}
            </tbody>
        </table>    
    )
}

export default ViewTrips;