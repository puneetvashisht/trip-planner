import Nav from 'react-bootstrap/Nav';

function Header() {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/view-trips" eventKey="link-1">View Trips</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/add-trip" eventKey="link-2">Add Trip</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Header;