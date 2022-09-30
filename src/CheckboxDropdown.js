import { observer } from "mobx-react-lite";

import React from "react";
import "./styles.css";

import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";

const CheckboxMenu =
    (
        {
            children,
            style,
            className,
            "aria-labelledby": labeledBy,
            onSelectAll,
            onSelectNone
        }
    ) => {
        return (
            <div
                style={style}
                className={`${className} CheckboxMenu`}
                aria-labelledby={labeledBy}
            >
                <div
                    className="d-flex flex-column"
                    style={{ maxHeight: "calc(100vh)", overflow: "none" }}
                >
                    <ul
                        className="list-unstyled flex-shrink mb-0"
                        style={{ overflow: "auto" }}
                    >
                        {children}
                    </ul>
                    <div className="dropdown-item border-top pt-2 pb-0">
                        <ButtonGroup size="sm">
                            <Button variant="link" onClick={onSelectAll}>
                                Select All
                            </Button>
                            <Button variant="link" onClick={onSelectNone}>
                                Select None
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        );
    };

const CheckDropdownItem = ({ children, id, checked, onChange }) => {
        return (
            <Form.Group className="dropdown-item mb-0" controlId={id}>
                <Form.Check
                    type="checkbox"
                    label={children}
                    checked={checked}
                    onChange={onChange && onChange.bind(onChange, id)}
                />
            </Form.Group>
        );
    };

export const CheckboxDropdown = ({ items, onChange }) => {
    const handleChecked = (key, event) => {
        items.find(i => i.id === key).checked = event.target.checked;
        onChange([...items]);
    };

    const handleSelectAll = () => {
        items.forEach(i => (i.checked = true));
        onChange([...items]);
    };

    const handleSelectNone = () => {
        items.forEach(i => (i.checked = false));
        onChange([...items]);
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Categories
            </Dropdown.Toggle>

            <Dropdown.Menu
                as={CheckboxMenu}
                onSelectAll={handleSelectAll}
                onSelectNone={handleSelectNone}
            >
                {items.map(i => (
                    <Dropdown.Item
                        key={i.id}
                        as={CheckDropdownItem}
                        id={i.id}
                        checked={i.checked}
                        onChange={handleChecked}
                    >
                        {i.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}