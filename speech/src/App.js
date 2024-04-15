import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpeechToText from './VoiceRecognition';
const App = () => {
  const [textInput, setTextInput] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const speakText = async () => {
    if (!textInput) {
      setAlertMessage('Please enter text to speak.');
      return;
    }

    try {
      await axios.post('http://localhost:3500/speak', { text: textInput });
      setAlertMessage('Text spoken successfully!');
      setTimeout(() => {
        setAlertMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error speaking text:', error);
      setAlertMessage('Error speaking text. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4} className='pt-5'>
          <h1 className="mb-4">Text to Speech</h1>
          {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
          <Form>
            <Form.Group controlId="textArea">
              <Form.Control
                as="textarea"
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text"
              />
            </Form.Group>
            <Button variant="primary" className='mt-3' onClick={speakText}>
              Speak
            </Button>
          </Form>
        </Col>
        <Col><SpeechToText/></Col>
      </Row>
    </Container>
  );
};

export default App;
