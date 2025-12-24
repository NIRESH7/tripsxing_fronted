import React, { useState, useEffect, useRef } from "react";
import { AutoComplete, Input } from "antd";
import { debounce } from "lodash";

declare global {
    interface Window {
        google: any;
    }
}

interface GoogleMapsAutocompleteProps {
    value?: string;
    onChange?: (value: string) => void;
    onSelect?: (value: string, option: any) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

const GoogleMapsAutocomplete: React.FC<GoogleMapsAutocompleteProps> = ({
    value,
    onChange,
    onSelect,
    placeholder,
    style,
}) => {
    const [options, setOptions] = useState<
        { value: string; label: string; place_id: string }[]
    >([]);
    const autocompleteService = useRef<any>(null);
    const placesService = useRef<any>(null);
    const divRef = useRef<HTMLDivElement>(null); // For PlacesService attributions

    useEffect(() => {
        if (window.google && !autocompleteService.current) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        if (window.google && !placesService.current && divRef.current) {
            placesService.current = new window.google.maps.places.PlacesService(divRef.current);
        }
    }, []);

    const fetchSuggestions = debounce((searchText: string) => {
        if (!searchText || !autocompleteService.current) return;

        const request = {
            input: searchText,
            componentRestrictions: { country: "in" }, // Restrict to India
        };

        autocompleteService.current.getPlacePredictions(
            request,
            (predictions: any[], status: string) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    const mappedOptions = predictions.map((prediction) => ({
                        value: prediction.description,
                        label: prediction.description,
                        place_id: prediction.place_id,
                    }));
                    setOptions(mappedOptions);
                } else {
                    setOptions([]);
                }
            }
        );
    }, 300);

    const handleSearch = (val: string) => {
        fetchSuggestions(val);
    };

    const handleSelect = (val: string, option: any) => {
        if (!placesService.current && window.google && divRef.current) {
            placesService.current = new window.google.maps.places.PlacesService(divRef.current);
        }

        if (placesService.current) {
            const request = {
                placeId: option.place_id,
                fields: ["geometry"],
            };

            placesService.current.getDetails(request, (place: any, status: string) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                    const lat = place.geometry.location.lat();
                    const lon = place.geometry.location.lng();

                    if (onSelect) {
                        onSelect(val, { ...option, lat, lon });
                    }
                }
            });
        }

        if (onChange) {
            onChange(val);
        }
    };

    return (
        <>
            <div ref={divRef}></div>
            <AutoComplete
                value={value}
                options={options}
                onSearch={handleSearch}
                onSelect={handleSelect}
                onChange={onChange}
                style={style}
            >
                <Input placeholder={placeholder || "Enter address (India)"} />
            </AutoComplete>
        </>
    );
};

export default GoogleMapsAutocomplete;
