import "./Item.css"
import {useLocation} from "react-router-dom";
import "./Manual.css"
import {useState} from "react";
import {Button, Form, Spinner, Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";

function Field({name, content, isLink}){
    let nicerContent = content.split('\n').map(line => <>{line}<br /></>);
    let inner = (!isLink)?nicerContent:<a href={content}>{nicerContent}</a>;
    return <div className="content-field"><span className="field-name">{name}</span>{inner}</div>
}

function Text({name, content}){
    return <fieldset className="contents">
        <legend>{name}</legend>
        {content}
    </fieldset>
}

function Manual(){
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [translation, setTranslation] = useState("");
    const [isLoading, setLoading] = useState(false);


    return (
        <>
            {isLoading && <Spinner animation="border" variant="danger" className='loading'/>}
            <div className="element">
                <Container fluid >
                    <Row>
                        <Col sm={8}>
                    <Form.Control as="textarea" rows={10} onChange={
                        evt => {
                            setInputText(evt.target.value);
                        }
                    } />
                        </Col>
                        <Col sm={4} >
                            <Button onClick={
                                evt => {
                                    setLoading(true);
                                   fetch("http://localhost:8000/api/summarize-text?" + new URLSearchParams({
                                       text: inputText,
                                   }), {
                                       method: 'POST'
                                   }).then(
                                       response => response.json()
                                   ).then(
                                       data => {
                                           setSummary(data);
                                           return data;
                                       }
                                   ).then(
                                       localSummary => {
                                           fetch("http://localhost:8000/api/translate-text?" + new URLSearchParams({
                                               text: localSummary,
                                           }), {
                                               method: 'POST'
                                           }).then(
                                               response => response.json()
                                           ).then(
                                               data => {
                                                   setTranslation(data)
                                                   setLoading(false)
                                               }
                                           )
                                       }
                                   )
                                }
                            }>Submit</Button>
                        </Col>
                    </Row>
                </Container>
                <Text name="Summary" content={summary} />
                <Text name="Spanish Summary" content={translation} />
            </div>
        </>
    );
}


export default Manual;