import { Form, Button } from 'react-bootstrap';

const AddActivity = (props) => {

    const addActivity = () => {
        props.setNewActivity({ ...props.newActivity, title: '', description: '', startTime: '', endTime: '' });
        props.onAddActivity();
    }

    return (
        <div>
            <h1>Add Activity</h1>
            <Form.Control
                type="text"
                placeholder="Activity Name"
                value={props.newActivity.title}
                onChange={(e) => props.setNewActivity({ ...props.newActivity, title: e.target.value })}
            />
            <Form.Control
                type="text"
                placeholder="Activity Description"
                value={props.newActivity.description}
                onChange={(e) => props.setNewActivity({ ...props.newActivity, description: e.target.value })}
            />
            <Form.Control
                type="time"
                placeholder="Activity Start Time"
                value={props.newActivity.startTime}
                onChange={(e) => props.setNewActivity({ ...props.newActivity, startTime: e.target.value })}
            />
            <Form.Control
                type="time"
                placeholder="Activity End Time"
                value={props.newActivity.endTime}
                onChange={(e) => props.setNewActivity({ ...props.newActivity, endTime: e.target.value })}
            />
            <Button variant="primary" onClick={addActivity}>Add Activity</Button>
        </div>
    )
}

export default AddActivity;