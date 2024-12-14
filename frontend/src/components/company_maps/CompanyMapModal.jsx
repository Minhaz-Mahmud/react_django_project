/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from "react";
import { Modal, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./CompanyMapModal.css";

const CompanyMapModal = ({ companyLocation, handleClose }) => {
  const { latitude, longitude } = companyLocation;
  const position = [latitude, longitude];

  return (
    <Modal
      show={true}
      onHide={handleClose}
      centered
      size="lg"
      aria-labelledby="company-location-modal"
      className="company-map-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="company-location-modal">Company Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="map-container">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={position}
              icon={
                new Icon({
                  iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                })
              }
            >
              <Popup>Company Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyMapModal;
