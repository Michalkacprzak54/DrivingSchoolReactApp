import React from "react";
import { Spinner } from "react-bootstrap";

const CenteredSpinner = () => {
    return (
        <div className="center-spinner">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">£adowanie...</span>
            </Spinner>
        </div>
    );
};

export default CenteredSpinner;
