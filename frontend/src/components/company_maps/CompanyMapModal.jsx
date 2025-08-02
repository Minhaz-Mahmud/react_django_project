/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Card,
  Chip,
  Fade,
  Backdrop,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Fullscreen as FullscreenIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 20,
    maxWidth: 900,
    width: "95%",
    height: "80vh",
    margin: 16,
    overflow: "hidden",
    boxShadow:
      "0 32px 64px -12px rgba(0,0,0,0.25), 0 25px 55px -14px rgba(0,0,0,0.18)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2.5),
  position: "relative",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTypography-root": {
    fontWeight: 700,
    fontSize: "1.4rem",
    display: "flex",
    alignItems: "center",
    paddingRight: theme.spacing(6),
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: "50%",
  transform: "translateY(-50%)",
  color: theme.palette.primary.contrastText,
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    transform: "translateY(-50%) scale(1.05)",
  },
  transition: "all 0.3s ease",
}));

const MapWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100%",
  width: "100%",
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: theme.palette.grey[100],
  "& .leaflet-container": {
    height: "100% !important",
    width: "100% !important",
    borderRadius: "inherit",
  },
  "& .leaflet-control-container": {
    "& .leaflet-top.leaflet-right": {
      top: 16,
      right: 16,
    },
    "& .leaflet-control": {
      borderRadius: 12,
      boxShadow: theme.shadows[3],
      border: "none",
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
  },
}));

const MapControlsOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  width: 44,
  height: 44,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
  transition: "all 0.3s ease",
}));

const LocationInfoCard = styled(Card)(({ theme }) => ({
  position: "absolute",
  bottom: 16,
  left: 16,
  right: 16,
  zIndex: 1000,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(15px)",
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  padding: theme.spacing(2),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minHeight: 400,
  gap: theme.spacing(2),
}));

const CompanyMapModal = ({ companyLocation, handleClose, companyName }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { latitude, longitude, address } = companyLocation || {};
  const position = [latitude, longitude];
  const hasValidLocation =
    latitude && longitude && !isNaN(latitude) && !isNaN(longitude);

  useEffect(() => {
    if (hasValidLocation) {
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasValidLocation]);

  // Custom marker icon with better styling
  const customIcon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [32, 41],
    iconAnchor: [16, 41],
    popupAnchor: [0, -41],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
  });

  const handleZoomIn = () => {
    if (mapRef) {
      mapRef.setZoom(mapRef.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef) {
      mapRef.setZoom(mapRef.getZoom() - 1);
    }
  };

  const handleCenterMap = () => {
    if (mapRef) {
      mapRef.flyTo(position, 15, { duration: 1 });
    }
  };

  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <StyledDialog
      open={true}
      onClose={handleClose}
      maxWidth="lg"
      fullScreen={isMobile}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" },
      }}
    >
      <StyledDialogTitle>
        <LocationIcon sx={{ mr: 1.5, fontSize: "1.6rem" }} />
        {companyName} - Location
        <CloseButton onClick={handleClose} size="small">
          <CloseIcon />
        </CloseButton>
      </StyledDialogTitle>

      <DialogContent sx={{ padding: 0, height: "100%", position: "relative" }}>
        {!hasValidLocation ? (
          <Box
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Alert
              severity="warning"
              sx={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
              }}
              icon={<LocationIcon sx={{ fontSize: "3rem", mb: 1 }} />}
            >
              <Typography
                sx={{ fontSize: "1.5rem", textAlign: "center" }}
                variant="h5"
                fontWeight="bold"
                gutterBottom
              >
                Location Not Available
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                The location information for {companyName} is not available or
                invalid.
              </Typography>
            </Alert>
          </Box>
        ) : !mapLoaded ? (
          <LoadingContainer>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="60%"
              sx={{ borderRadius: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Loading map data...
            </Typography>
          </LoadingContainer>
        ) : mapError ? (
          <Box
            sx={{ p: 3, height: "100%", display: "flex", alignItems: "center" }}
          >
            <Alert
              severity="error"
              sx={{ width: "100%", borderRadius: 2 }}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setMapError(false);
                    setMapLoaded(false);
                    setTimeout(() => setMapLoaded(true), 500);
                  }}
                >
                  <MyLocationIcon />
                </IconButton>
              }
            >
              <Typography variant="h6">Unable to load map</Typography>
              <Typography>
                Please check your internet connection and try again.
              </Typography>
            </Alert>
          </Box>
        ) : (
          <MapWrapper>
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              whenCreated={setMapRef}
              onError={() => setMapError(true)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position} icon={customIcon}>
                <Popup>
                  <Box sx={{ minWidth: 200, p: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                    >
                      {companyName}
                    </Typography>
                    {address && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {address}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {formatCoordinates(latitude, longitude)}
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            </MapContainer>

            {/* Custom Map Controls */}
            <MapControlsOverlay>
              <ControlButton onClick={handleZoomIn} title="Zoom In">
                <ZoomInIcon />
              </ControlButton>
              <ControlButton onClick={handleZoomOut} title="Zoom Out">
                <ZoomOutIcon />
              </ControlButton>
              <ControlButton
                onClick={handleCenterMap}
                title="Center on Location"
              >
                <MyLocationIcon />
              </ControlButton>
            </MapControlsOverlay>

            {/* Location Information Card */}
            <LocationInfoCard>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {companyName}
                    </Typography>
                    {address && (
                      <Typography variant="body2" color="text.secondary">
                        {address}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Chip
                  label={formatCoordinates(latitude, longitude)}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Box>
            </LocationInfoCard>
          </MapWrapper>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default CompanyMapModal;
