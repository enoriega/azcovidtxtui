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
import FormCheckInput from "react-bootstrap/FormCheckInput";

function Topics({names}){
    let topics = names.map((i, ix) => <li key={ix}>{i}</li>)
    return (
        <ul>
            {topics}
        </ul>
    )
}

/**
 * Represents a row of the grid
 * @param {*} param0 
 * @returns 
 */
function ItemRow({item, onSelected, onSetPreviouslySeen, itemIx}){

    let style = {}
    if(item.previouslySeen)
        style.backgroundColor = 'cornsilk';

    return (
        <Row style={style}>
            <Col className="newsTitle"><a href={item.uri} target="_blank">{item.title}</a></Col>
            <Col>{item.text.substring(0, 200)}...</Col>
            <Col><Topics names={item.topics} /></Col>
            {/*<Col className="date">{new Date(item.date).toDateString()}</Col>*/}
            <Col className="date">{item.date.toDateString()}</Col>
            <Col className="action"><Link to={"item"} state={{item:item}}><Button>Details</Button></Link></Col>
            
            {/* Viewed state */}
            <Col style={{textAlign:"center"}}><FormCheckInput style={{textAlign: "center"}} onChange={() => {}}
              checked={item.previouslySeen}
              onClick={(e) => {
                if(onSetPreviouslySeen){
                    e.item = item;
                    e.itemIx = itemIx;
                    onSetPreviouslySeen(e)
                }  
              }}
                 
                />
            </Col>
            {/* Checked status */}
            <Col style={{textAlign:"center"}}><FormCheckInput style={{textAlign: "center"}} checked={item.checked} onChange={() => {}} onClick={(e) => {
                if(onSelected) {
                    e.item = item;
                    e.itemIx = itemIx;
                    onSelected(e)
                }
            }} /></Col>
            <Col />
        </Row>
    )
}

/**
 * Pre-process an item in order to add the properties necessary to work in th interface
 */
function preProcessItem(item, previouslySeenStates){
    let previouslySeen = previouslySeenStates[item.uri] || false;
    return {
        ...item,
        text: item.text.replace(/\n/g, " "),
        topics: item.topics.map(i => i.toLowerCase()),
        date: new Date(Date.parse(item.date)),
        checked: false,
        previouslySeen: previouslySeen
    }
}

/**
 * Generates the topics out of the elements read from the data file
 * @param {items} items 
 * @returns 
 */
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

/**
 * Component that represents a rows of the grid
 * @param {*} param0 
 * @returns 
 */
function Rows({items, onSetPreviouslySeen, onChecked}) {
    return items.map( (item, ix) => <ItemRow item={item} key={ix} itemIx={ix} onSelected={onChecked} onSetPreviouslySeen={onSetPreviouslySeen} /> )
}

function List({items}) {
    let prevSeenKey = "prevSeenItems";
    let [dateRange, setDateRange] = useState([]);
    let [categories, setCategories] = useState(computeTopics(items));
    let [previouslySeenItems, setPreviouslySeenItems] = useState(localStorage.getItem(prevSeenKey)?JSON.parse(localStorage.getItem(prevSeenKey)):{});
    let [fixedItems, setFixedItems] = useState(items.map(i => preProcessItem(i, previouslySeenItems)));
    

    // var fixedItems = items.map(fixItem)
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

    // Set the previously seen flags


    let rows = <Rows items={fixedItems} 
                    onChecked={
                        e => {
                            fixedItems[e.itemIx].checked = !fixedItems[e.itemIx].checked;
                            setFixedItems([...fixedItems]);
                        }
                    }
                    
                    onSetPreviouslySeen={
                        e => {
                            let item = fixedItems[e.itemIx]
                            previouslySeenItems[item.uri] = (item.uri in previouslySeenItems)?!previouslySeenItems[item.uri]:true;
                            item.previouslySeen = previouslySeenItems[item.uri]
                            let x = {...previouslySeenItems}
                            localStorage.setItem(prevSeenKey, JSON.stringify(x))
                            setPreviouslySeenItems(x);
                            setFixedItems([...fixedItems])
                        }
                    }
                />


    function handleEvent(event, picker) {
        if(event.type === "apply") {
            setDateRange([picker.startDate, picker.endDate]);
        }
    }

    function itemToRow(i){
        let fields = new Array()
        for(const property in i) {
            fields.push(i[property])
        }
        return fields.join("\t");
    }

    function downloadSelectedItems(){
        let chosenItems = fixedItems.filter(i => i.checked)

        if(chosenItems.length > 0) {
            let header = [Object.keys(chosenItems[0]).join("\t")];
            let lines = chosenItems.map(itemToRow);
            // lines.reverse()
            let contents = (header.concat(lines)).join("\n");
            save("exported_data.tsv", contents);
        }
    }

    function save(filename, data) {
        const blob = new Blob([data], {type: 'text/tsv'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
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
                <Col />
                <Col>Previously Seen</Col>
                <Col>Select</Col>
                <Col><Button onClick={downloadSelectedItems}>Download Selected</Button></Col>
            </Row>
            {rows}
        </Container>
    );
}

export default List;

