import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Button} from "react-bootstrap";
import "./list.css"
import {CheckboxDropdown} from "./CheckboxDropdown";

import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import {useState} from "react";
import {Link} from "react-router-dom";

function Topics({names}){
    let topics = names.map((i, ix) => <li key={ix}>{i}</li>)
    return (
        <ul>
            {topics}
        </ul>
    )
}

function ItemRow({item}){
    return (
        <Row>
            <Col className="newsTitle">{item.title}</Col>
            <Col>{item.text.substring(0, 200)}...</Col>
            <Col><Topics names={item.topics} /></Col>
            {/*<Col className="date">{new Date(item.date).toDateString()}</Col>*/}
            <Col className="date">{item.date.toDateString()}</Col>
            <Col className="action"><Link to={"item"} state={{item:item}}><Button>Details</Button></Link></Col>
        </Row>
    )
}

function fixItem(item){
    return {
        ...item,
        topics: item.topics.map(i => i.toLowerCase()),
        date: new Date(Date.parse(item.date))
    }
}

function computeTopics(items){
    var topics = [...new Set(items.map( i => i.topics.map(t => t.toLowerCase())
    ).flat())]

    topics = topics.map(
        t => ({
            id: t,
            label: t,
            checked: true
        })
    )

    return topics
}

function Rows({items}) {
    return items.map( (item, ix) => <ItemRow item={item} key={ix} /> )
}

function List({items}) {

    let [dateRange, setDateRange] = useState([]);
    let [categories, setCategories] = useState(computeTopics(items));

    var fixedItems = items.map(fixItem)
    fixedItems.sort((a, b) => (a.date > b.date) ? -1: 1)


    if(dateRange.length > 0){
        let start = dateRange[0];
        let end = dateRange[1];
       fixedItems = fixedItems.filter(i => {
           return new Date(i.date) >= start && new Date(i.date) <= end
       })
    }

    // Filter per category
    fixedItems = fixedItems.filter(i => {
        let allowed = new Set(categories.filter(c => c.checked).map(c => c.id))
        return i.topics.some(t => allowed.has(t))

    })


    let rows = <Rows items={fixedItems} />


    function handleEvent(event, picker) {
        if(event.type === "apply") {
            setDateRange([picker.startDate, picker.endDate]);
        }
    }


    return (
        <Container id="grid" fluid>
            <Row className="header">
                <Col>Title</Col>
                <Col>Contents</Col>
                <Col><CheckboxDropdown items={categories} onChange={setCategories} /></Col>
                <Col>
                    <DateRangePicker onEvent={handleEvent}>
                        <Button>Set Date Range</Button>
                    </DateRangePicker>
                </Col>
                <Col></Col>
            </Row>
            {rows}
        </Container>
    );
}

export default List;

