import React, { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SpeechToText = () => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [editedTranscript, setEditedTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSearch = useCallback(() => {
    const finalTranscript = editedTranscript || transcript;
    if (finalTranscript) {
      const searchQuery = encodeURIComponent(finalTranscript);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
      resetTranscript();
      setEditedTranscript('');
    }
  }, [editedTranscript, transcript, resetTranscript]);

  useEffect(() => {
    let timeoutId;

    const handleTimeout = () => {
      setAlertMessage('');
      setIsListening(false);
      SpeechRecognition.stopListening();
      handleSearch();
    };

    if (isListening) {
      setAlertMessage('Recording Started...');
      timeoutId = setTimeout(() => {
        setAlertMessage('Recording Stopped...');
        setTimeout(handleTimeout, 2000);
      }, 4000); // Total timeout of 6 seconds (2 seconds for "Recording stopped" + 4 seconds for "Recognition stopped")
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isListening, handleSearch]);

  const handleEditTranscript = (e) => {
    setEditedTranscript(e.target.value);
  };

  const handleStartListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening();
  };

  const handleStopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    handleSearch();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Speech recognition is not supported in your browser.</div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1 className="mb-4">Voice Search</h1>
          {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
          <p>Speak to search on Google:</p>
          <Button variant="primary" onClick={handleStartListening} className="mr-2">
            Start Listening
          </Button>
          <Button variant="danger"  onClick={handleStopListening} className="mx-4">
            Stop Listening
          </Button>
          <Form.Control
            as="textarea"
            className='my-3'
            rows={3}
            placeholder="Transcript will appear here..."
            value={editedTranscript || transcript}
            onChange={handleEditTranscript}
          />
          <Button variant="success" onClick={handleSearch} className="mt-2">
            Search on Google
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SpeechToText;
