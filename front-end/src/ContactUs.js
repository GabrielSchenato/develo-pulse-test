import React from "react";

import {
  Form,
  Button,
  Container,
  Jumbotron,
  Alert,
  Spinner,
} from "react-bootstrap";

import axios from "axios";

export default class ContactUs extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    streetAddress: "",
    unitApt: "",
    provinceTerritoryState: "",
    city: "",
    email: "",
    cities: [],
    validated: false,
    sended: false,
    sendedWithError: false,
    isLoading: false,
  };

  render() {
    const handlerOnChangeProvinceTerritoryState = (province) => {
      axios
        .get(
          `https://imc-hiring-test.azurewebsites.net/Contact/Cities?province=${province}`
        )
        .then((res) => {
          const cities = res.data.Items;
          this.setState({ cities });
        });
    };

    const provinceTerritoryState = [
      "",
      "AB",
      "BC",
      "MB",
      "NB",
      "NL",
      "NT",
      "NU",
      "ON",
      "PE",
      "SK",
      "QC",
      "YT",
    ];

    const handleSubmit = (event) => {
      event.preventDefault();
      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        event.stopPropagation();
      } else {
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const streetAddress = this.state.streetAddress;
        const unitApt = this.state.unitApt;
        const provinceTerritoryState = this.state.provinceTerritoryState;
        const city = this.state.city;
        const email = this.state.email;

        this.setState({ isLoading: true });
        this.setState({ sendedWithError: false });
        axios
          .post(`http://localhost:3030/contact-us`, {
            firstName,
            lastName,
            streetAddress,
            unitApt,
            provinceTerritoryState,
            city,
            email,
          })
          .then((res) => {
            const { data } = res;
            if (data.success) {
              this.setState({ sended: true });
            } else {
              this.setState({ sendedWithError: true });
            }
            this.setState({ isLoading: false });
          });
      }

      this.setState({
        validated: true,
      });
    };

    const successElement = (
      <Alert variant="success">
        <Alert.Heading>Hey, thank you for contacting us</Alert.Heading>
        <p>We will answer you as soon as possible</p>
      </Alert>
    );

    const errorElement = (
      <Alert variant="danger">
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>Try again please</p>
      </Alert>
    );

    return (
      <Container className="p-3">
        <Jumbotron>
          <h1 className="header">Contact Us</h1>
        </Jumbotron>

        {this.state.sended ? successElement : null}
        {this.state.sendedWithError ? errorElement : null}

        {!this.state.sended ? (
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="formBasicFirstName">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                required
                maxLength="40"
                type="text"
                onChange={(e) => this.setState({ firstName: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">
                Please enter first name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicLastName">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                required
                type="text"
                maxLength="40"
                onChange={(e) => this.setState({ lastName: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">
                Please enter last name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicStreetAddress">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                required
                type="text"
                maxLength="128"
                onChange={(e) =>
                  this.setState({ streetAddress: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please enter street address
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicUnitApt">
              <Form.Label>Unit/Apt</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => this.setState({ unitApt: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formBasicProvinceTerritoryState">
              <Form.Label>Province/Territory/State *</Form.Label>
              <Form.Control
                required
                as="select"
                onChange={(e) => {
                  this.setState({ provinceTerritoryState: e.target.value });
                  handlerOnChangeProvinceTerritoryState(e.target.value);
                }}
              >
                {provinceTerritoryState.map((value, index) => (
                  <option value={value} key={index}>
                    {value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicCity">
              <Form.Label>City *</Form.Label>
              <Form.Control
                required
                as="select"
                onChange={(e) => this.setState({ city: e.target.value })}
              >
                <option></option>
                {this.state.cities.map((city) => (
                  <option value={city} key={city}>
                    {city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address *</Form.Label>
              <Form.Control
                required
                type="email"
                maxLength="128"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">
                Please enter email address
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit{" "}
              {this.state.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : null}
            </Button>
          </Form>
        ) : null}
      </Container>
    );
  }
}
