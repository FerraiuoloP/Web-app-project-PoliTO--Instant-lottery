import React from "react";
import { Container, Row, Col, Alert } from 'react-bootstrap';
import PropTypes from "prop-types";

// ErrorBoundary component to catch errors in child components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };

  }


  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container fluid>
          <Row>
            <Col>
              <Alert variant="danger" className="text-center p-4 rounded shadow border-2">
                <Alert.Heading className="fs-2">Error:</Alert.Heading>
                <p className="fs-4">An unexpected error has occurred</p>
              </Alert>
            </Col>
          </Row>
        </Container>);
    }


    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;