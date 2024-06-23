import React, { useState } from "react"
import { Row, Col, Form, InputGroup, Button as BootButton } from "react-bootstrap"
import SearchBar from "./SearchBar"
import LeaderTables from "./LeaderTables"
import { IDataPage } from "../pages/Data"
import "../styles/Form.css"
import "../styles/bg-gradient.css"

const MyForm = (props:
    { // these are the props for myForm
        handleSubmit: // handlesubmit has a shape of...
        // having an IDataPage interface
        ({ id, type }: IDataPage) => void
    }) => {

    // this function handles rendering the dropdown of the searchbar in a certain way
    const dropDownHandler =
        (option: any[],
            index: number,
            onClick: () => void): JSX.Element => {
            const [id, alternate_name, name, count] = option
            const useName: string = name == null ? alternate_name : name
            // renders div after selecting the name to use
            return <div className='option'
                key={index}
                onClick={onClick}>{useName}</div>
        }

    // this function handles the creation of a downloadble html file on the report-end
    // I used some help from chatgpt to conceptualize what exactly I did here
    const myDownloadHandler = () => {
        // creates a file to download using the html from the page itself
        const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
        // this line constructs a url based on the file generated
        const url = URL.createObjectURL(blob);

        // here we download the file to the computer
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.html'
        document.head.appendChild(a)
        a.click()

        // cleanup of URL and the element
        document.head.removeChild(a)
        URL.revokeObjectURL(url);
    }

    // changes the radiochoice based on the radio being pressed
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadioChoice(e.target.value)
    }

    //states
    const [backEndStatus, setBackEndStatus] = useState('Online')
    const [radioChoice, setRadioChoice] = useState("")
    const [idSelection, setIdSelection] = useState(-1)

    return (
        <Form className='my-Form-Gradient my-Form-Container'>
            <Row>
                <Col>
                    Step 1: Choose...
                </Col>
                <Col md={6} style={{ paddingTop: '0px' }}>
                    {`Step 2: Find${radioChoice ? " a " + radioChoice : "..."}`}
                </Col>
                <Col style={{ paddingTop: '0px' }}>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        Status:
                        <div style={{ paddingRight: '1rem', paddingLeft: '1rem' }}>
                            ({backEndStatus})</div>
                        <div style={{
                            borderRadius: '50%',
                            backgroundColor: `${backEndStatus == 'Online' ? 'green' : 'red'}`,
                            width: '25px'
                        }}></div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Form.Group as={Col}>
                    <Form.Check type="radio" label="Single stock" value="stock"
                        name="formHorizontalRadios"
                        onChange={handleRadio} />
                    <Form.Check type="radio" label="Market sector" value="sector"
                        name="formHorizontalRadios"
                        onChange={handleRadio} />
                    <Form.Check type="radio" label="Whole market" value="market"
                        name="formHorizontalRadios"
                        onChange={handleRadio} />
                </Form.Group>
                <Form.Group md={6} as={Col}>
                    <InputGroup>
                        <SearchBar optionRender={dropDownHandler}
                            type={radioChoice}
                            setBackEndStatus={setBackEndStatus}
                            setIdSelection={setIdSelection}
                        />
                        <BootButton
                            variant='success'
                            style={{ width: '20%' }}
                            onClick={() =>
                                props.handleSubmit({
                                    id: idSelection,
                                    type: radioChoice
                                })}>
                            {/* The text for the button below */}
                            Submit
                        </BootButton>
                    </InputGroup>
                    {/* (debug) <div>Asset id: {idSelection}</div> */}
                </Form.Group>
                <Form.Group as={Col}>
                    
                </Form.Group>
            </Row>
            <Row style={{ paddingTop: '20vh' }}>
                <LeaderTables />
            </Row>
        </Form>
    )
}

export default MyForm