import "./Item.css"
import {useLocation} from "react-router-dom";

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

function Item(){
    const location = useLocation()
    const { item } = location.state
    return (
        <div className="element">
            <Field name="Title" content={item.title} />
            <Field name="Source" content={item.uri} isLink={true} />
            <Field name="Date" content={item.date.toDateString()} />
            <Text name="Original Contents" content={item.text} />
            <Text name="Summary" content={item.summary} />
            <Text name="Spanish Summary" content={item.translatedSummary} />
        </div>
    );
}


export default Item;